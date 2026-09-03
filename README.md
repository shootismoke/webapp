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

MongoDB is only used by `/api/users`. Every other page and API route works
without it, so there is no need to run a database unless you are working on
that route -- and then `mongod --dbpath /path/to/my/db` matches the default
connection string.

> Deploying? See [deploy/README.md](./deploy/README.md).

### API tokens

Next.js loads `.env` automatically. Every key below has a free tier.

| Env Variable | Description | Url | Comments |
| --- | --- | --- | --- |
| `BACKEND_AQICN_TOKEN` | World Air Quality Index, used by `/api/aq`. | http://aqicn.org/api | Required. You can use the public one in `.env.example` for development. |
| `BACKEND_GEOAPIFY_API_KEY` | Geocoding for city search, used by `/api/geocode`. | https://www.geoapify.com | Required. |
| `BACKEND_OPENAQ_API_KEY` | Air quality measurements, used by `/api/aq`. | https://openaq.org | Required. |
| `BACKEND_SECRET` | Secret used in headers between frontend and backend API calls. Please note that CORS is also enabled. | n/a | Required. Defaults to `ssshhh!`. |
| `BACKEND_MONGODB_ATLAS_URI` | Connection string to MongoDB. | https://www.mongodb.com/cloud/atlas | Only used by `/api/users`. Defaults to `mongodb://localhost/shootismoke`. |
| `NEXT_PUBLIC_SENTRY_API_KEY` | Sentry bug tracking. | https://sentry.io | Optional. |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | Amplitude analytics. | https://amplitude.com | Optional. Note: we respect [DNT](https://en.wikipedia.org/wiki/Do_Not_Track), and we **never** track PII. |

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

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.

## :star: Credits

Created with pride by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://amaurym.com).
