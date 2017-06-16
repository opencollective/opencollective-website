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

cd opencollective-api
echo "Running api"
npm start &
sleep 5
cd -

set -e

APT_PACKAGES=(google-chrome-stable)
APT_CACHE=~/cache/apt

# Work from the directory CI will cache
mkdir -p ${APT_CACHE}
cd ${APT_CACHE}

# check we have a deb for each package
useCache=true
for pkg in "${APT_PACKAGES[@]}"; do
  if ! ls | grep "^${pkg}"; then
    useCache=false
  fi
done

set -x

if [ ${useCache} == true ]; then
  sudo dpkg -i *.deb
  exit 0
fi

wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install "${APT_PACKAGES[@]}"

cp -v /var/cache/apt/archives/*.deb ${APT_CACHE} || true