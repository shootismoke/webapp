# CLAUDE.md

Next.js 15 app (pages router, TypeScript, Tailwind). See [README.md](./README.md)
for the project itself; this file only covers running it locally.

## Dev server

```bash
WATCHPACK_POLLING=true NEXT_IMAGES_UNOPTIMIZED=true npm run dev   # http://localhost:3000
```

Next loads `.env` automatically. If you don't have one yet, see
[Getting a `.env`](#getting-a-env). `/api/users` keeps its data in a SQLite
file (`BACKEND_SQLITE_PATH`, `.data/shootismoke.db` by default) that the app
creates on first request; there is no database server to start, and
`rm -rf .data` resets it.

**`WATCHPACK_POLLING=true` is not optional here.** Without it the file watcher
dies with `Watchpack Error (watcher): EMFILE: too many open files`, and since
dev route discovery is driven by that watcher, nested dynamic routes
intermittently fail to register — `/city/kashgar` returns 404 while `/` and
`/faq` still work. It is a race, so a run that looks fine proves nothing;
`--turbopack` does not avoid it. Polling clears the EMFILE errors entirely and
hot reload still works.

Run **one** dev server at a time. Two sharing `.next` corrupt each other's
build output, and the symptom looks like the bug above — routes that worked a
moment ago start returning 404/500. To run a second one, give it its own
directory: `NEXT_DIST_DIR=.next-alt PORT=3001 …`.

`NEXT_IMAGES_UNOPTIMIZED=true` is only needed when the machine can't reach
`live.staticflickr.com` directly. `next/image` refetches every remote image
server-side, so behind a proxy the optimizer 500s on all of them and the
ranking cards render as bare alt text (`1st`, `2nd`, …) instead of city
photos. The flag hands the fetch to the browser. Leave it off otherwise —
production wants the optimizer.

## Getting a `.env`

Dev credentials travel as one encrypted file, `dev.env.enc`, committed at the
repo root and unsealed with a passphrase from the team password manager. Node
only — no ansible, openssl or gpg to install.

### From a fresh laptop

```bash
git clone https://github.com/shootismoke/webapp && cd webapp
nvm install && nvm use             # Node 22, per .nvmrc
npm ci                             # not `npm install`; the lockfile is authoritative

node scripts/dev-secrets.js open   # prompts; paste the passphrase
WATCHPACK_POLLING=true npm run dev
```

Only the fourth line needs something the clone does not already contain: the
passphrase, which comes from the team password manager and nowhere else. Ask
whoever last ran `seal` if it is not in there. Everything the app needs to
serve a page is in `.env` after that — the database included, in the sense
that there is nothing to start: SQLite ships inside Node.

Someone without the passphrase is not blocked. `cp .env.example .env` and fill
in your own AQICN, Geoapify and OpenAQ keys — all three have free tiers, and
every route except `/api/users` works on them. Outside contributors are
expected to take this path; the sealed file is a convenience for the team, not
a dependency of the build.

### The two commands

```bash
node scripts/dev-secrets.js open   # dev.env.enc -> .env
node scripts/dev-secrets.js seal   # .env -> dev.env.enc
```

`open` overwrites `.env`, copying the old one to `.env.backup` (gitignored)
first. Both are written `0600`. It prompts on a TTY; where there is none, it
reads `DEV_SECRETS_PASSPHRASE` instead. Prefer the prompt on a laptop — an
environment variable ends up in shell history and in the environment of every
child process.

Run `seal` after rotating any of the five keys, and commit the new
`dev.env.enc`. Re-sealing with the same passphrase is fine; the salt and IV
are fresh each time, so the ciphertext changes on every run even when the
plaintext does not.

This is **not** the deploy vault and must not become it. It carries five keys:
the two `NEXT_PUBLIC_*` (already compiled into the client bundle, so public
either way) and the AQICN, Geoapify and OpenAQ keys. Everything in
`deploy/group_vars/all/vault.yml` stays there and never reaches a
contributor's laptop — `open` writes `BACKEND_SQLITE_PATH=.data/shootismoke.db`
and `BACKEND_SECRET=ssshhh!` locally instead. So a leaked passphrase costs a
rate limit, nothing more. Adding a production credential to `SHARED_KEYS` would
change that.

The production database is a file on the deploy box, not a service with a
connection string, so there is no longer a production database credential to
leak in the first place. See [deploy/README.md](./deploy/README.md).

The ciphertext is committed to a **public** repository, which gives an
attacker unlimited offline guesses. scrypt at N=2¹⁷ is the only thing between
them and the keys, so the passphrase must be generated rather than chosen:
`openssl rand -base64 24`. Share that one string through the password manager,
never the rendered `.env`, and never over Slack or email.

For production secrets — and for the `--ask-vault-pass` workflow — see
[deploy/README.md](./deploy/README.md).

## Smoke checks

```bash
curl -s localhost:3000/api/health                    # {"status":"ok",...}
curl -s "localhost:3000/api/aq?lat=48.85&lng=2.35"   # note: lat/lng, not latitude/longitude
curl -s "localhost:3000/api/geocode?q=Paris"
curl -so /dev/null -w '%{http_code}\n' localhost:3000/city/kashgar
```

Valid `/city/<slug>` slugs come from the upstream city list
(`kashgar`, `kota`, `cawnpore`, …) — an unknown slug is a legitimate 404.

## The gitlab.com city list

`getAllCities()` fetches a ~2 MB JSON blob from gitlab.com on every cold start
and caches it in-process. Behind a proxy that stack drops the body mid-stream
a good fraction of the time, surfacing as `AxiosError: stream has been
aborted` and a 500 on whichever page hit it first — so the fetch is wrapped in
`async-retry`. Keep it that way; a single unretried attempt is not reliable
enough to serve a page from.
