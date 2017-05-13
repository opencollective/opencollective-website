#!/usr/bin/env bash

# interrupt on any error
set -e

npm run build

if [ "$NODE_ENV" = "circleci" ]; then
  # pre-install API to attempt to get its node_modules cached by circleci
  npm run test:e2e:exec api:install
fi