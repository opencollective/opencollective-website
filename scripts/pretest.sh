#!/usr/bin/env bash

# interrupt on any error
set -e

# load .env file to get NODE_ENV
if [ -f ".env" ]; then
  source ".env"
fi

npm run hint

if [ "$NODE_ENV" = "circleci" ] || [ "$NODE_ENV" = "development" ]; then
  npm run rexec:api install_selenium_server.sh
fi