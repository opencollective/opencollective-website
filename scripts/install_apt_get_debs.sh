#!/usr/bin/env bash

set -e

APT_PACKAGES=(google-chrome-stable)
APT_CACHE=~/cache/apt

mkdir -p ${APT_CACHE}/partial
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get -o dir::cache::archives=${APT_CACHE} update
sudo apt-get -o dir::cache::archives=${APT_CACHE} install -y "${APT_PACKAGES[@]}"