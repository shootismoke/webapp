# Deploying shootismoke.app

One OVH VPS runs both environments, with Caddy in front and Cloudflare in
front of that. No containers. Ansible provisions the box; nothing is built on
it. Both environments are built in CI and pushed as artifacts.

```
Cloudflare (proxy, edge cache, TLS to visitors)
        │  Full (strict)
        ▼
Caddy   (apt, TLS via Cloudflare Origin CA)
        │
        ├── shootismoke.app          → 127.0.0.1:3000   next start   (production)
        └── staging.shootismoke.app  → 127.0.0.1:3001   next start   (staging)
                                                  │
                                     both → MongoDB Atlas (only /api/users/*)
                                          → aqicn / waqi / openaq
```

|  | Production | Staging |
| --- | --- | --- |
| URL | shootismoke.app | staging.shootismoke.app |
| Runs | `next start` | `next start` |
| User | `shootismoke` | `shootismoke-staging` |
| Path | `/srv/shootismoke/production/webapp` | `/srv/shootismoke/staging/webapp` |
| Built by | the `deploy` workflow, from the tag | the `deploy` workflow, from the commit |
| Updated by | pushing a `prod-v*` tag | each commit pushed to `master` |
| Database | its own Atlas cluster | its own Atlas cluster |

The two run as different users on purpose. It prevents the staging deployment
from writing over production.

## Why builds do not happen on the box

The box has 4 GB and runs both environments on it. Prerendering ~1000 city
pages is the heaviest thing this project does, and it is the one step that does
not need to be there. So it runs on a CI runner (or your laptop) and only the
output travels.

Staging used to be the exception: a `next dev` that compiled on the box and hot
reloaded. That put the heaviest workload on the same 4 GB as the live site, for
a server that behaves differently from the one production runs. Both
environments now take the same path -- runner builds, rsync, swap, restart --
so what you see on staging is the same artifact shape that goes live.

Only `.next` travels. `node_modules` cannot: a checkout on a Mac carries
`@next/swc-darwin-arm64` and a darwin `sharp` binary, neither of which runs on
Linux. `.next` is plain JavaScript and is portable, so the box runs its own
`npm ci --omit=dev` and gets binaries matching itself.

## One-time setup

### 1. The box

An OVH **VPS-1** (2 vCores, 4 GB, 40 GB NVMe). Ubuntu 24.04 LTS, or 26.04 LTS
for the longer support window -- nothing here pins a release, and the NodeSource
and Caddy repositories both use version-agnostic paths. Add your SSH key at
create time.

OVH's Ubuntu image gives you a sudo-capable `ubuntu` user and disables root SSH
login, which is what `inventory.yml` assumes. The playbook escalates with
`become`, so that user is all it needs.

The included one-day automated backup is a rollback for the *box*, not a
replacement for source control. Keep work pushed to GitHub.

### 2. DNS and TLS

1. Move `shootismoke.app`'s nameservers to Cloudflare.
2. `A` records for `shootismoke.app`, `www`, and `staging` → the box's IP, all
   **proxied** (orange cloud).
3. SSL/TLS mode: **Full (strict)**.
4. SSL/TLS → Origin Server → *Create Certificate*, covering `shootismoke.app`
   **and `*.shootismoke.app`** so it also serves staging. Then:

   ```bash
   scp origin.pem origin.key root@BOX:/etc/caddy/certs/
   ssh root@BOX 'chown caddy:caddy /etc/caddy/certs/* && chmod 640 /etc/caddy/certs/*'
   ```

   Caddy cannot use Let's Encrypt here: with the domain proxied, the HTTP-01
   challenge never reaches the box. The Origin CA certificate is free and valid
   for 15 years. The playbook stops with an explanation if it is missing.

### 3. Secrets

```bash
cd deploy
cp group_vars/all/vault.example.yml group_vars/all/vault.yml
$EDITOR group_vars/all/vault.yml
ansible-vault encrypt group_vars/all/vault.yml
```

**This repository is public.** Vault ciphertext is safe to publish; plaintext is
not. Install the guard so a plaintext vault cannot be committed by accident:

```bash
ln -sf ../../deploy/scripts/vault-guard.sh ../.git/hooks/pre-commit
```

Two values in there reach browsers by design — `NEXT_PUBLIC_SENTRY_API_KEY` (a
write-only ingestion DSN) and `NEXT_PUBLIC_AMPLITUDE_API_KEY`. Every other
credential stays on the server: the browser reaches those providers through
`/api/aq` and `/api/geocode` instead.

### 4. Run the playbook

Fill in `inventory.yml` (the box's IP) and the two key lists in
`group_vars/all/vars.yml`. Those lists are only needed for direct access as the
environment service users; the workflow logs in through the provisioner's
`ubuntu` account instead.

```bash
ansible-playbook site.yml --ask-vault-pass
```

The playbook uses only `ansible.builtin` modules, so there are no collections to
install first -- `ansible-core` alone is enough.

Re-run it after any change under `deploy/roles/`. The systemd units, the
Caddyfile and the two `.env` files only reach the box through the playbook; the
deploy workflow ships builds and never touches them.

It is safe to re-run. It only creates the checkouts on the first run, and it
never touches either environment's `.next`.

Both environments stay down until a deployment ships them a build, which is
expected on a fresh box: production until you push a `prod-v*` tag, staging
until the next push to `master`.

### 5. GitHub secrets

Authorize the Actions key for the `ubuntu` account using an existing login:

```bash
ssh-copy-id -i ~/.ssh/shootismoke-github-actions.pub ubuntu@shootismoke.app
```

Then open Settings → Secrets and variables → Actions. The workflow needs one
repository secret:

| Secret | What it is |
| --- | --- |
| `OVH_DEPLOY_SSH_KEY` | private key whose public half is authorized for `ubuntu` |

The host (`shootismoke.app`) and user (`ubuntu`) are public workflow settings.
The workflow switches to `shootismoke-staging` or `shootismoke` before changing
application files, so their ownership remains correct. Note that `ubuntu` has
sudo access: this CI key is effectively an administrator credential for the VPS.

## Releasing production

```bash
git tag prod-v2
git push origin prod-v2
```

The workflow builds into `.next-release`, rsyncs it to `.next-incoming` on the
box, and runs `deploy/release.sh` there. That moves the checkout to the tag,
installs production dependencies, swaps the build in and waits for health. It
rolls back to the previous build automatically if the new one does not come up.

To release from a laptop instead, check out the pushed tag and run:

```bash
git checkout prod-v2
OVH_DEPLOY_HOST=1.2.3.4 deploy/push-build.sh prod-v2
```

The laptop script refuses to run against a dirty tree, when `HEAD` is not the
tag, or when the tag is not pushed — otherwise a tag stops describing what is
actually live.

The end-to-end Cypress suite used to chain off the deploy workflow. Run it by
hand from the Actions tab (`e2e` → Run workflow) after a release you want
checked.

To roll back, release the previous tag. To roll back right now, without waiting
for a build:

```bash
ssh shootismoke@BOX
cd /srv/shootismoke/production/webapp
sudo systemctl stop shootismoke
rm -rf .next && mv .next-previous .next
sudo systemctl start shootismoke
```

## Working on staging

Each push to `master` makes the workflow build the commit, rsync the result to
`.next-incoming` on the box, then reset the staging checkout to that exact
commit, run `npm ci --omit=dev`, swap the build in and wait for its health
endpoint. It rolls back to the previous build if the new one does not come up,
exactly as production does.

There is no hot reload and no compiler on the box: staging serves a build, so
editing files in `/srv/shootismoke/staging/webapp` changes nothing until the
next deployment, which resets the checkout anyway. Develop locally with
`npm run dev`.

```bash
sudo systemctl restart shootismoke-staging   # if the server itself dies
journalctl -u shootismoke-staging -f
```

Staging serves `X-Robots-Tag: noindex` so its copy of the ~1000 city pages does
not compete with the real site in search results. There is a commented
`basic_auth` block in the Caddyfile template if you want it behind a password.

## How pages stay fresh

The upstream city list changes every couple of hours. Vercel used to run a cron
that rebuilt all ~1000 pages. Now pages carry `revalidate: 7200`, so Next
regenerates each one in the background the first time it is requested after
going stale, and deploys only happen on code changes. `getStaticPaths` uses
`fallback: 'blocking'`, so cities added upstream get a page on first request
rather than needing a release.

The list itself comes from `gitlab.com/shootbot/cities`, fetched at build time.
A build with no route to gitlab.com fails at "Collecting page data".

## Health and logs

```bash
curl https://shootismoke.app/api/health           # {"status":"ok","uptime":...}
curl https://staging.shootismoke.app/api/health
sudo journalctl -u shootismoke -f
sudo journalctl -u shootismoke-staging -f
sudo journalctl -u caddy -f
git -C /srv/shootismoke/production/webapp describe --tags   # what is live
```

`/api/health` deliberately does not touch MongoDB: only the four `/api/users/*`
routes need it, and the rest of the site should stay up without it.

## API routes

| Route | Cached | Notes |
| --- | --- | --- |
| `/api/health` | no | liveness; no database |
| `/api/aq?lat=&lng=` | `s-maxage=300` | air quality, raced across providers |
| `/api/geocode?q=` | `s-maxage=3600` | place search for the search bar |
| `/api/users/*` | `no-store` | the mobile app's subscriptions; needs Mongo |

`/api/aq` and `/api/geocode` exist so the provider credentials stay on the
server. Their `Cache-Control` lets Cloudflare absorb repeat lookups, which is
why the Caddyfile only forces `no-store` on `/api/users/*`.

## Memory

4 GB, shared. The systemd units carry `MemoryMax` — 1 GB each — so neither
environment can take the other down. Staging used to get 1.6 GB because a dev
server holds far more than `next start` does; it runs the same server as
production now, so it gets the same ceiling. There is 2 GB of swap for the
`npm ci` spike during a deployment.

If staging starts getting OOM-killed, raise `staging_memory_max` in
`group_vars/all/vars.yml` and re-run the playbook. If both are under pressure at
once, that is the signal to move up a VPS tier to 8 GB.
