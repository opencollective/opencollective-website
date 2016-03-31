# OpenCollective Website [![Circle CI](https://circleci.com/gh/OpenCollective/website/tree/master.svg?style=svg&circle-token=529943730e6598363053a54a31969aa0278f0f33)](https://circleci.com/gh/OpenCollective/website/tree/master)

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

# Sponsors

  <a href="https://opencollective.com/opencollective/backers/0/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/0/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/1/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/1/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/2/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/2/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/3/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/3/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/4/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/4/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/5/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/5/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/6/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/6/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/7/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/7/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/8/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/8/avatar" height="64">
  </a>
  <a href="https://opencollective.com/opencollective/backers/9/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/9/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/10/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/10/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/11/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/11/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/12/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/12/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/13/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/13/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/14/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/14/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/15/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/15/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/16/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/16/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/17/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/17/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/18/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/18/avatar" height="64">
  </a>
<a href="https://opencollective.com/opencollective/backers/19/website" target="_blank">
    <img src="https://opencollective.com/opencollective/backers/19/avatar" height="64">
  </a>

[[Become a sponsor](https://opencollective.com/opencollective)]
