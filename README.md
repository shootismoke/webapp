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

Run the following commands:

```bash
# Clone this repo
git clone https://github.com/shootismoke/webapp && cd webapp

# Install dependencies.
yarn install

# Fill in secret tokens.
cp .env.example .env.development

# Run the MongoDB daemon locally.
mongod --dbpath /path/to/my/db

# Run the app.
yarn dev
```

The webapp will launch at http://localhost:3000. It uses [Next.js](https://nextjs.org/), you can check out [their docs](https://nextjs.org/docs/).

> Note: A Docker images is [in the works](https://github.com/shootismoke/webapp/issues/115).

### Use your own API tokens

For local development, all API secret tokens should live in the `.env.development` file for development, as described [in the Next.js docs](https://nextjs.org/docs/basic-features/environment-variables).

| Env Variable                                           | Description                                                                                           | Url                                 | Comments                                                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_AQICN_TOKEN`                              | World Air Quality Index, used in frontend.                                                            | http://aqicn.org/api                | Required. You can use the public one in `.env.example` for development.                                   |
| `NEXT_PUBLIC_SENTRY_API_KEY`                           | Sentry bug tracking.                                                                                  | https://sentry.io                   | Optional.                                                                                                 |
| `NEXT_PUBLIC_AMPLITUDE_API_KEY`                        | Amplitude analytics                                                                                   | https://amplitude.com               | Optional. Note: we respect [DNT](https://en.wikipedia.org/wiki/Do_Not_Track), and we **never** track PII. |
| `BACKEND_SECRET`                                       | Secret used in headers between frontend and backend API calls. Please note that CORS is also enabled. | n/a                                 | Required. Defaults to `ssshhh!` .                                                                         |
| `BACKEND_AQICN_TOKEN`                                  | World Air Quality Index, used in backend.                                                             | http://aqicn.org/api                | Required. You can use the public one in `.env.example` for development.                                   |
| `BACKEND_MAILGUN_API_KEY` and `BACKEND_MAILGUN_DOMAIN` | Credentials used for sending emails with Mailgun.                                                     | https://www.mailgun.com/            | Optional. Only used in the [script to send emails](./scripts/email.ts).                                   |
| `BACKEND_MONGODB_ATLAS_URI`                            | Connection string to MongoDB.                                                                         | https://www.mongodb.com/cloud/atlas | Required. Defaults to `mongodb://localhost/shootismoke`.                                                  |

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
