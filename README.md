# OpenCollective Website [![Circle CI](https://circleci.com/gh/OpenCollective/opencollective-mobileapp/tree/master.svg?style=svg&circle-token=f96fc77d4d46882a72fff85ad9ce98b8b9f58ca7)](https://circleci.com/gh/OpenCollective/opencollective-mobileapp/tree/master)

Note: Currently, this is only serving the `/:slug` and `/:slug/widget` pages. 
The static pages `/`, `/faq`, `/about` are served from the [website-static](https://github.com/opencollective/website-static) server. Eventually we move over those static pages to this repo.

## Setup

```
npm install
```

## Run in dev

```
npm install foreman -g
npm run dev
```

## Build for production

```
npm run build
```

## Deployment

Use the `scripts/deploy.sh [env]`
CircleCI will run the tests on this branch and push to Heroku if successful (to staging only)

### Manually
If you want to deploy the app on Heroku manually (only for production), you need to add the remotes:

```
git remote add heroku-production https://git.heroku.com/opencollective-prod-website.git
```

Then you can run:

```
git push heroku-production master
```

## Test

```
// in a separate window
npm run testserver
npm test
```

## Stack

- https://github.com/rackt/redux
- https://facebook.github.io/react/
