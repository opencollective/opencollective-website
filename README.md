# OpenCollective Mobile app [![Circle CI](https://circleci.com/gh/OpenCollective/opencollective-mobileapp/tree/master.svg?style=svg&circle-token=f96fc77d4d46882a72fff85ad9ce98b8b9f58ca7)](https://circleci.com/gh/OpenCollective/opencollective-mobileapp/tree/master)

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

If you want to deploy to staging, you need to push your code to the `staging` branch. CircleCI will run the tests on this branch and push to Heroku for you if successful.

### Manually
If you want to deploy the app on Heroku manually (only for production), you need to add the remotes:

```
git remote add heroku-production https://git.heroku.com/opencollective-prod-app.git
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
