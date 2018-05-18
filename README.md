# This repository is deprecated

[![Greenkeeper badge](https://badges.greenkeeper.io/opencollective/opencollective-website.svg)](https://greenkeeper.io/)

Please refer to the
[opencollective/frontend](https://github.com/opencollective/frontend)
repository, which is the replacement of our UI.

# OpenCollective Website

[![Circle CI](https://circleci.com/gh/OpenCollective/opencollective-website/tree/master.svg?style=shield&circle-token=529943730e6598363053a54a31969aa0278f0f33)](https://circleci.com/gh/OpenCollective/opencollective-website/tree/master)
[![Slack Status](https://slack.opencollective.com/badge.svg)](https://slack.opencollective.com)
[![Gitter chat](https://badges.gitter.im/OpenCollective/OpenCollective.svg)](https://gitter.im/OpenCollective/OpenCollective)
[![Dependency Status](https://david-dm.org/opencollective/opencollective-website.svg)](https://david-dm.org/opencollective/opencollective-website)

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

Use the `npm run deploy:staging` or `npm run deploy:production`.
CircleCI will run the tests on this branch and push to Heroku if successful (to staging only)

For quick pushing of hotfixes, you can do `npm run deploy:hotfix`. It'll take `master` and push to remote `production`, then push to `staging` to keep everything in sync.

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

See [Wiki](https://github.com/OpenCollective/OpenCollective/wiki/Software-testing).

## Stack

- https://github.com/rackt/redux
- https://facebook.github.io/react/
