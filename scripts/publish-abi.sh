#!/usr/bin/env bash

set -e

declare -a POSITIONAL_ARGS

while [[ $# -gt 0 ]]; do
  case $1 in
  --local)
    local=1
    shift # past argument
    ;;
  --no-build)
    skip_build=1
    shift # past argument
    ;;
  -* | --*)
    echo "Unknown option $1"
    exit 1
    ;;
  *)
    POSITIONAL_ARGS+=("$1") # save positional arg
    shift                   # past argument
    ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

echo "### Release script started..."
if [[ $skip_build -eq 0 ]]; then
  npm run build
fi
echo "### Build finished. Copying abis."
rm -rf abi
mkdir -p abi
# copy all abis to ./abi
find artifacts/contracts ! -iregex ".*([a-zA-Z0-9_]).json" -exec cp {} abi \; 2>/dev/null
# remove non-abi files
rm abi/*.dbg.json
# copy sol
rm -rf sol
mkdir -p sol
cp -r contracts/** sol
# publish from root
echo "### Publishing..."
if [[ $local -eq 1 ]]; then
  npm publish
else
  npm version patch -m "[Manual release] [skip ci] %s"
  npm publish
  git push --no-verify && git push --tags --no-verify
fi
echo "### Release Done."
