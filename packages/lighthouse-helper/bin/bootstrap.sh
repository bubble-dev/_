#!/usr/bin/env bash

cd $1

echo $(pwd)

rm -rf node_modules/

yarn install

if [[ $1 != "lighthouse-stats" ]]; then

mkdir node_modules/@klarna/shipping-module

# ln -s seem to only work properly with full path
ln -s  $(pwd)/../build  node_modules/@klarna/shipping-module/build
else
echo skipping linking
fi

PUBLIC_URL=$2 yarn build

cd ../

echo $(pwd)
