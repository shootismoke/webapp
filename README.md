<p align="center" style="background-color: #F8A65D;">
    <img alt="oss image" src="https://shootismoke.app/static/logo_text_2lines-cf697d3ebc27c385cd2f30e1f6a68c51.svg" width="300px">
</p>
<h4 align="center">Know how many cigarettes you smoke based on the pollution of your location.</h4>

<p align="center">
  <a href="https://github.com/shootismoke/webapp/actions">
    <img alt="Github Actions" src="https://github.com/shootismoke/webapp/workflows/CI/badge.svg" />
  </a>
  <a href="https://david-dm.org/shootismoke/webapp">
    <img alt="david-dm" src="https://img.shields.io/david/shootismoke/webapp.svg" />
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

# Install dependencies
yarn install

# Fill in secret tokens
cp .env.example .env.development

# Run the app with Next.js
yarn dev
```

The webapp uses [Next.js](https://nextjs.org/), you can check out [their docs](https://nextjs.org/docs/).

#### Use your own API tokens

All API secret tokens should live in the `.env.development` file for development, as described [in the Next.js docs](https://nextjs.org/docs/basic-features/environment-variables).

| Service                 | Url                   | Comments                                                                |
| ----------------------- | --------------------- | ----------------------------------------------------------------------- |
| World Air Quality Index | http://aqicn.org/api/ | Required. You can use the public one in `.env.example` for development. |
| Sentry Bug Tracking     | https://sentry.io     | Optional.                                                               |
| Amplitude Analytics     | https://amplitude.com | Optional. Note: we **never** track PII.                                 |

## :raising_hand: Contribute

If you find a bug, or if you have an idea for this app, please [file an issue here](https://github.com/shootismoke/webapp/issues). We really appreciate feedback and inputs!

More information on contributing [here](./CONTRIBUTING.md).

## :microscope: Tests

The codebase unfortunately isn't much covered by tests. Check out the `*.spec.ts` files in the project for tests.

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.

## :star: Credits

Created with pride by [Marcelo](http://www.marcelocoelho.cc) & [Amaury](https://www.toptal.com/resume/amaury-martiny#utilize-unreal-developers-today).
