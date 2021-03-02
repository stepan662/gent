#!/bin/bash
set -x

yarn --cwd ./gent-diagram unlink react
yarn --cwd ./example-frontend unlink gent-diagram
yarn --cwd ./example-process unlink gent-core

rm -rf ~/.config/yarn/link

yarn --cwd ./gent-diagram install --force
yarn --cwd ./example-frontend install --force
yarn --cwd ./example-process install --force
