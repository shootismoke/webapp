# Deploying shootismoke.app

One Hetzner box runs the Next server under systemd, with Caddy in front of it
and Cloudflare in front of that. No containers. Deploys build **on the server**;
GitHub Actions only triggers them over SSH.

```
Cloudflare (proxy, edge cache, TLS to visitors)
        │  Full (strict)
        ▼
Caddy      (apt, TLS via Cloudflare Origin CA, compression, cache headers)
        ▼
127.0.0.1:3000   shootismoke.service  ──►  MongoDB Atlas (only /api/users/*)
                                      ──►  aqicn / waqi / openaq
```

## One-time setup

### 1. The box

A Hetzner CX22 (2 vCPU, 4 GB) is about €4/month and enough. See the note on
build memory at the bottom before going smaller.

```bash
sudo adduser --system --group --home /srv/shootismoke shootismoke

# Node 22 (matches .nvmrc)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Caddy
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update && sudo apt-get install -y caddy
```

### 2. The checkout

```bash
sudo -u shootismoke git clone https://github.com/shootismoke/webapp \
  /srv/shootismoke/webapp
cd /srv/shootismoke/webapp
sudo -u shootismoke git checkout production
```

Create `/srv/shootismoke/webapp/.env` from `.env.example` and fill it in. Since
the build runs here, this file needs **both** the `BACKEND_*` values and the
`NEXT_PUBLIC_*` ones — the latter are compiled into the client bundle at build
time.

```bash
sudo chown shootismoke:shootismoke .env && sudo chmod 600 .env
```

### 3. The service

```bash
sudo cp deploy/shootismoke.service /etc/systemd/system/
sudo systemctl daemon-reload

# First build, by hand.
sudo -u shootismoke bash -c 'cd /srv/shootismoke/webapp && npm ci && npm run build'
sudo systemctl enable --now shootismoke
curl localhost:3000/api/health
```

The deploy script restarts the unit, so let the app user do that without a
password:

```bash
echo 'shootismoke ALL=(root) NOPASSWD: /bin/systemctl start shootismoke, /bin/systemctl stop shootismoke, /bin/systemctl restart shootismoke' \
  | sudo tee /etc/sudoers.d/shootismoke
sudo chmod 440 /etc/sudoers.d/shootismoke
```

### 4. Caddy

```bash
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo mkdir -p /etc/caddy/certs
# put the Cloudflare Origin CA cert and key here (next step)
sudo systemctl reload caddy
```

### 5. Cloudflare

1. Move `shootismoke.app`'s nameservers to Cloudflare.
2. `A` records for `shootismoke.app` and `www` → the box's IP, **proxied**
   (orange cloud).
3. SSL/TLS mode: **Full (strict)**.
4. SSL/TLS → Origin Server → *Create Certificate*. Save the certificate to
   `/etc/caddy/certs/origin.pem` and the key to `/etc/caddy/certs/origin.key`,
   both readable by the `caddy` user.

   Caddy cannot use Let's Encrypt here: with the domain proxied, the HTTP-01
   challenge never reaches the box. The Origin CA certificate is free and valid
   for 15 years.

### 6. GitHub secrets

Settings → Secrets and variables → Actions. Only SSH access is needed — the
API keys live in `.env` on the box, not in CI.

| Secret | What it is |
| --- | --- |
| `DEPLOY_HOST` | box IP or hostname |
| `DEPLOY_USER` | SSH user allowed to run `deploy/deploy.sh` |
| `DEPLOY_SSH_KEY` | its private key |

## Deploying

Merge to `production`. The workflow SSHes in and runs `deploy/deploy.sh`, which
fetches, installs, builds, swaps the build in and waits for health. You can run
the same thing by hand:

```bash
sudo -u shootismoke /srv/shootismoke/webapp/deploy/deploy.sh production
```

`next build` rewrites the dist directory, and a running `next start` reads from
it lazily — building straight over a live `.next` makes the site throw
`Cannot find module './xyz.js'` until the build finishes. So the script builds
into `.next-staging` and swaps, which keeps the outage to a service restart
(~2 s) rather than the length of a build (minutes).

The previous build is kept as `.next-previous`, and the script rolls back to it
automatically if the new one does not come up healthy. To roll back later:

```bash
cd /srv/shootismoke/webapp
sudo systemctl stop shootismoke
rm -rf .next && mv .next-previous .next
sudo systemctl start shootismoke
```

## How pages stay fresh

The upstream city list changes every couple of hours. Vercel used to run a cron
that rebuilt all ~1000 pages. Now pages carry `revalidate: 7200`, so Next
regenerates each one in the background the first time it is requested after
going stale, and deploys only happen on code changes. `getStaticPaths` uses
`fallback: 'blocking'`, so cities added upstream get a page on first request
rather than needing a redeploy.

## Health and logs

```bash
curl https://shootismoke.app/api/health   # {"status":"ok","uptime":...}
sudo journalctl -u shootismoke -f
sudo journalctl -u caddy -f
```

`/api/health` deliberately does not touch MongoDB: only the four `/api/users/*`
routes need it, and the rest of the site should stay up without it.

## A note on build memory

Prerendering ~1000 city pages is the heaviest thing this box does. If the build
gets OOM-killed on a small instance, add swap:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Or cap Node: `NODE_OPTIONS=--max-old-space-size=2048` in `.env`.
