<p align="center" style="background-color: #F8A65D;">
    <img alt="oss image" src="https://shootismoke.app/static/logo_text_2lines-cf697d3ebc27c385cd2f30e1f6a68c51.svg" width="300px">
</p>
<h4 align="center">Know how many cigarettes you smoke based on the pollution of your location.</h4>

<p align="center">
  <a href="https://github.com/shootismoke/webapp/actions">
    <img alt="Github Actions" src="https://github.com/shootismoke/webapp/workflows/CI/badge.svg?branch=master" />
  </a>
  <a href="https://codeclimate.com/github/shootismoke/webapp/maintainability">
    <img alt="codeclimate" src="https://api.codeclimate.com/v1/badges/9fc8ebb000978f14b6d0/maintainability" />
  </a>
  <a href="https://spectrum.chat/shootismoke">
    <img alt="spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
  </a>
</p>

<br />

## :rocket: Website: https://shootismoke.app

## :hammer: Build it yourself

```bash
# Clone this repo
git clone https://github.com/shootismoke/webapp && cd webapp

# Use the Node version this project targets (see .nvmrc).
nvm install && nvm use

# Install dependencies.
npm ci

# Fill in secret tokens (see below).
cp .env.example .env

# Run the app.
npm run dev
```

The webapp will launch at http://localhost:3000. It uses [Next.js](https://nextjs.org/), you can check out [their docs](https://nextjs.org/docs/).

`.env.example` is enough to boot -- CI runs the whole test suite against a
straight copy of it. The two keys it leaves blank degrade only the routes that
need them (see the table below). Check the server came up with:

```bash
curl -s localhost:3000/api/health   # {"status":"ok",...}
```

`/api/users` keeps its data in a SQLite file, created on first use at
`BACKEND_SQLITE_PATH` (`.data/shootismoke.db` by default). There is no database
server to install or start, and `rm -rf .data` is how you reset it. It goes
through `node:sqlite`, which is built into Node from 24 on -- that, and not
just `engines`, is why the project needs Node 24 or newer.

If `npm run dev` dies with `Watchpack Error (watcher): EMFILE: too many open
files`, start it as `WATCHPACK_POLLING=true npm run dev`. Route discovery in
dev rides on that same watcher, so the other symptom of it is nested dynamic
routes intermittently 404ing (`/city/kashgar` fails while `/` still works).
Run one dev server at a time, too -- two of them sharing `.next` corrupt each
other's build output and look like the same bug. Give a second one its own
directory instead: `NEXT_DIST_DIR=.next-alt PORT=3001 npm run dev`.

> Deploying? See [deploy/README.md](./deploy/README.md).

### Environment variables

Next.js loads `.env` automatically. Every credential below has a free tier.

| Env Variable | Description | Url | Comments |
| --- | --- | --- | --- |
| `BACKEND_AQICN_TOKEN` | World Air Quality Index, used by `/api/aq`. | http://aqicn.org/api | `.env.example` ships a public development token, so this one works out of the box. |
| `BACKEND_GEOAPIFY_API_KEY` | Geocoding for city search, used by `/api/geocode`. | https://www.geoapify.com | Blank in `.env.example`. Without it, city search returns an error; the rest of the site is unaffected. |
| `BACKEND_OPENAQ_API_KEY` | Air quality measurements, used by `/api/aq`. | https://openaq.org | Blank in `.env.example`. OpenAQ v3 requires a key on every request, so it only joins the race when one is configured; `/api/aq` runs on aqicn and waqi alone without it. |
| `BACKEND_SECRET` | Shared secret gating the `/api/users` routes: a caller must send it as the `x-shootismoke-secret` header. Not a `NEXT_PUBLIC_` value, so the site's own pages never send it -- the caller is the mobile app. CORS is also enabled, but it only constrains browsers. | n/a | `.env.example` ships `ssshhh!`, and any value works locally as long as client and server agree. **Leave it unset and the `/api/users` routes stop checking at all** (an absent header compares equal to an unset variable). |
| `BACKEND_SQLITE_PATH` | Path to the SQLite file behind `/api/users`. | n/a | Optional. Created on first use, along with any missing parent directories. Defaults to `.data/shootismoke.db`. |
| `NEXT_PUBLIC_SENTRY_API_KEY` | Sentry bug tracking. | https://sentry.io | Optional. |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | Amplitude analytics. | https://amplitude.com | Optional. Note: we respect [DNT](https://en.wikipedia.org/wiki/Do_Not_Track), and we **never** track PII. |

Two more variables are read at build and dev time rather than being
credentials, and are unset by default:

| Env Variable | Description |
| --- | --- |
| `NEXT_IMAGES_UNOPTIMIZED` | Set to `true` to skip `next/image` optimization. The optimizer refetches every remote image server-side, so on a machine that can't reach `live.staticflickr.com` directly it 500s and the ranking cards render as bare alt text. This hands the fetch to the browser instead. Leave it off in production. |
| `NEXT_DIST_DIR` | Build directory, `.next` by default. Read by `next build`, `next dev` and `next start` alike -- deployments build into a staging directory and swap it in. |

The two `NEXT_PUBLIC_*` values are compiled into the client bundle and are
public by design. Everything else stays on the server, which is why the
frontend reaches those providers through `/api/aq` and `/api/geocode` rather
than calling them directly.

Maintainers can skip the table. The same keys travel as one encrypted file:

```bash
node scripts/dev-secrets.js open   # dev.env.enc -> .env
```

The passphrase comes from the team password manager. Without it, use your own
keys as above -- nothing in the build depends on the sealed file.

## :raising_hand: Contribute

If you find a bug, or if you have an idea for this app, please [file an issue here](https://github.com/shootismoke/webapp/issues). We really appreciate feedback and inputs!

More information on contributing [here](./CONTRIBUTING.md).

## :microscope: Tests

The codebase is covered by different types of tests:

-   Unit tests: located in the `src/` folder, next to the tested files, and end with `.spec.ts{x}`.
-   Backend E2E tests: located in `test/e2e/backend`.
-   Frontend E2E tests: located in `test/cypress`, using [Cypress](https://www.cypress.io).

```bash
npm run lint       # tsc --noEmit + eslint
npm run test:unit  # unit tests only, no server needed
npm test           # everything, including the e2e specs
```

`npm test` talks to a running app, so start `npm run dev` in another terminal
first. The e2e specs read the same `.env` the server does. One unit spec,
`src/common/dataproviders/providers/openaq/openaq.spec.ts`, calls the live
OpenAQ API and needs `BACKEND_OPENAQ_API_KEY` (or `OPENAQ_API_KEY` inline) plus
network access.

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.

## :star: Credits

Created with pride by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://amaurym.com).
