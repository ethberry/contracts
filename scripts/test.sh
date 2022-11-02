#!/usr/bin/env bash


echo -e "\033[34mTesting...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

lerna bootstrap --concurrency 1 --hoist --ignore-scripts
lerna run build --stream

lerna exec --scope @gemunion/contracts-access-list -- npm run test
lerna exec --scope @gemunion/contracts-erc20 -- npm run test
lerna exec --scope @gemunion/contracts-erc721 -- npm run test
lerna exec --scope @gemunion/contracts-erc998 -- npm run test
lerna exec --scope @gemunion/contracts-erc1155 -- npm run test
lerna exec --scope @gemunion/contracts-misc -- npm run test
lerna exec --scope @gemunion/contracts-examples -- npm run test
lerna exec --scope @gemunion/contracts-utils -- npm run test

