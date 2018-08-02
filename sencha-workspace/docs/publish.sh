#!/bin/bash

if [ ! -d "build" ]; then
    echo "Build directory does not exist, running ./build.sh"
    ./build.sh
fi

cd build

if [ ! -d ".git" ]; then
    echo "Git not initialized in build directory, cloning gh-pages"
    git init
    git remote add origin git@github.com:SlateFoundation/slate-cbl.git
fi

echo "Ensuring HEAD matches remote gh-pages head"
git fetch origin gh-pages
git symbolic-ref HEAD refs/remotes/origin/gh-pages

SOURCE_COMMIT=$(git --git-dir=../../../.git rev-parse HEAD)
echo "Committing build for SlateFoundation/slate-cbl@$SOURCE_COMMIT"
git add --all
git commit -m "Update jsduck build to SlateFoundation/slate-cbl@$SOURCE_COMMIT"

echo "Pushing to origin/gh-pages"
git push -u origin HEAD:gh-pages