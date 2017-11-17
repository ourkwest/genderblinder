#!/usr/bin/env bash

if [[ `git status --porcelain` ]]; then
  echo "Please commit your changes."
  exit 1
fi


CURRENT_VERSION=$(grep -e '"version": ' extension/manifest.json | cut -d \" -f 4)
NEXT_VERSION=$(echo ${CURRENT_VERSION} | cut -d . -f 1).$(($(echo ${CURRENT_VERSION} | cut -d . -f 2) + 1))

echo "Bumping version number: $CURRENT_VERSION -> $NEXT_VERSION"

#cat extension/manifest.json | sed -e "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEXT_VERSION\"/g"

sed -i '' -e "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEXT_VERSION\"/g" extension/manifest.json

cp -r extension tempdir

cat extension/popup.html | sed -e "s/{{version}}/v. $NEXT_VERSION/g" > tempdir/popup.html

cd tempdir
zip tempfile.zip *
cd ..
cp tempdir/tempfile.zip extension.zip
rm -rf tempdir

