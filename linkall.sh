#!/bin/bash
set -x

# remove all existing links
rm -rf ~/.config/yarn/link

# create links
yarn --cwd ./gent-diagram link
yarn --cwd ./example-frontend/node_modules/react link
yarn --cwd ./gent-core link

# connect to links
yarn --cwd ./gent-diagram link react
yarn --cwd ./example-frontend link gent-diagram
yarn --cwd ./example-process link gent-core
