#!/usr/bin/bash

set -ex

echo 123

rm -rf ./dist_chrm
rm -rf ./dist_mdn

mkdir ./dist_chrm
mkdir ./dist_mdn

gulp b 

rollup -c

cp -r ./icons ./dist_chrm/
cp -r ./icons ./dist_mdn/

cd ./dist_mdn
zip -r package-mdn .

cd ..
zip -r package-chrm dist_chrm

echo DONE