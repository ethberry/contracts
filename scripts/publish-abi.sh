#!/usr/bin/env bash

set -e

echo "### Release script started..."
npm run build
echo "### Build finished"
echo "### Copying contract/** to root"
#rm -rf abi
#mkdir -p abi
## copy all abis to ./abi
#find artifacts/contracts ! -iregex ".*([a-zA-Z0-9_]).json" -exec cp {} abi \; 2>/dev/null
## remove non-abi files
#rm abi/*.dbg.json
## copy sol
#rm -rf sol
#mkdir -p sol
cp -r contracts/** ./
# publish from root
echo "### Publishing..."
npm version patch -m "[Manual release] [skip ci] %s"
npm publish
git push --no-verify && git push --tags --no-verify
echo "### Release Done!"
