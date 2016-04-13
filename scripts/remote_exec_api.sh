#!/usr/bin/env bash

main() {
  set -e
  parseParams $@
  shift
  setEnvironment

  if [ "${NODE_ENV}" = "development" ]; then
    if [ -z "${API_DIR}" ]; then
      echo "API_DIR not configured in .env"
      exit
    else
      bash ${API_DIR}/scripts/${SCRIPT} $@
    fi
  else
    curl -s https://raw.githubusercontent.com/OpenCollective/api/master/scripts/${SCRIPT} | bash -s -- $@
  fi
}

parseParams() {
  if [ "$1" != "" ]; then
    SCRIPT=$1
  else
    usage
  fi
}

usage() {
  CMD=remote_exec_api.sh
  echo " "
  echo "Usage: $CMD <remote API script> [<params>]"
  echo " "
  echo "E.g : $CMD test_e2e.sh api:install"
  echo " "
  exit $1;
}

setEnvironment() {
  LOCAL_DIR=$PWD
  LOCAL_NAME=$(basename ${LOCAL_DIR})
  [ -f "${LOCAL_DIR}/.env" ] && source ${LOCAL_DIR}/.env

  if [ -z "${NODE_ENV}" ]; then
    NODE_ENV=development
  fi
}

main $@