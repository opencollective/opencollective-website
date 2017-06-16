#!/bin/bash
# This script only runs on circleci, just before the e2e tests
# first version cfr. https://discuss.circleci.com/t/add-ability-to-cache-apt-get-programs/598/6


if [ "$NODE_ENV" = "circleci" ]; then
  echo "Installing Google Chrome for E2E tests";
else
  exit;
fi

cd
# If opencollective-api directory doesn't exist
if [ ! -d "opencollective-api" ]; then
  echo "Cloning opencollective-api repo"
  git clone git@github.com:opencollective/opencollective-api.git --depth 1
  cd opencollective-api
  rm circle.yml # circleci doesn't like having more than one circle.yml
  echo "Running npm install on api"
  npm install
  cd
fi

# Install Google Chrome
cd ~/cache
if [ ! -e "google-chrome-stable_current_amd64.deb" ]; then
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
fi;

sudo dpkg -i ./google-chrome*.deb
sudo apt-get install -f

sudo apt-get install GraphicsMagick