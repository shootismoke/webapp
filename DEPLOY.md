# Deploying shootismoke.app

The site runs as a single Docker container (Next.js in standalone mode) behind
Caddy on one host, with Cloudflare proxying in front. Images are built by GitHub
Actions and pulled by the host; the host never builds.

```
Cloudflare (proxy, edge cache, TLS to visitors)
        │  Full (strict)
        ▼
Caddy   (TLS via Cloudflare Origin CA, gzip/zstd, cache headers)
        ▼
app     (node server.js, port 3000)  ──►  MongoDB Atlas   (only /api/users/*)
                                     ──►  aqicn / waqi / openaq
```

## One-time setup

### 1. The host

Any small Linux box works; a Hetzner CX22 is about €4/month and has plenty of
headroom. The site is almost entirely static and served from cache.

```bash
# on the host
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"      # log out and back in

mkdir -p /srv/shootismoke/certs && cd /srv/shootismoke
```

Copy `compose.yaml` and `Caddyfile` from this repo into `/srv/shootismoke`, then
create `/srv/shootismoke/.env` with the **BACKEND_** values from
`.env.example`. `NEXT_PUBLIC_*` values are **not** read here — they are compiled
into the client bundle at build time (see step 4).

### 2. Cloudflare

1. Move `shootismoke.app`'s nameservers to Cloudflare.
2. `A` record for `shootismoke.app` → the host's IP, **proxied** (orange cloud).
   Same for `www`.
3. SSL/TLS mode: **Full (strict)**.
4. SSL/TLS → Origin Server → *Create Certificate*. Save the certificate to
   `/srv/shootismoke/certs/origin.pem` and the key to
   `/srv/shootismoke/certs/origin.key`.

   Caddy cannot use Let's Encrypt here: with the domain proxied, the HTTP-01
   challenge never reaches the host. The Origin CA certificate is free and
   valid for 15 years.

5. Optionally add a cache rule for `/_next/static/*` with a long edge TTL. Caddy
   already sends `immutable` for those, so this is belt and braces.

### 3. SSH access for deploys

On the host, add a deploy key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/gh-deploy -N ''
cat ~/.ssh/gh-deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/gh-deploy         # the private half goes into GitHub secrets
```

### 4. GitHub secrets

Settings → Secrets and variables → Actions:

| Secret | What it is |
| --- | --- |
| `DEPLOY_HOST` | host IP or hostname |
| `DEPLOY_USER` | SSH user |
| `DEPLOY_SSH_KEY` | the private key from step 3 |
| `DEPLOY_PATH` | `/srv/shootismoke` |
| `NEXT_PUBLIC_AQICN_TOKEN` | |
| `NEXT_PUBLIC_GEOAPIFY_API_KEY` | |
| `NEXT_PUBLIC_OPENAQ_API_KEY` | optional; without it openaq sits out |
| `NEXT_PUBLIC_SENTRY_API_KEY` | |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | |

`NEXT_PUBLIC_*` values are inlined into the JavaScript that ships to browsers.
They are public by definition, but it does mean the built image embeds them —
treat the image as no more secret than the site itself.

### 5. First run

```bash
# on the host
cd /srv/shootismoke
docker compose up -d
```

Then push to `production` and the `deploy` workflow takes over.

## Deploying

Merge to `production`. The workflow builds the image, pushes it to
`ghcr.io/shootismoke/webapp`, SSHes in, pulls, restarts the app container, and
polls `/api/health` until the site answers.

To roll back, pin a previous image on the host:

```bash
IMAGE_TAG=<short-sha> docker compose up -d --no-deps app
```

Tags are the first 12 characters of the commit SHA.

## How pages stay fresh

The city list upstream changes every couple of hours. Previously a cron
triggered a full rebuild of all ~1000 pages on Vercel. Now the pages carry
`revalidate: 7200`, so Next regenerates each one in the background the first
time it is requested after it goes stale. Deploys only happen on code changes.

Two consequences:

- `.next/cache` is a named volume. Without it, every restart throws away the
  regenerated pages and the next visitor to each city pays full price.
- `getStaticPaths` uses `fallback: 'blocking'`, so cities added upstream get a
  page on first request rather than needing a redeploy.

## Health and logs

```bash
curl https://shootismoke.app/api/health   # {"status":"ok","uptime":...}
docker compose logs -f app
docker compose ps                         # healthcheck state
```

`/api/health` deliberately does not touch MongoDB: only the four `/api/users/*`
routes need it, and the rest of the site should stay up without it.
