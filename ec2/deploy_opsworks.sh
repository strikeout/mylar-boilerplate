#!/bin/sh

SRC_DIR="../meteor/"
DEPLOY_DIR="../ec2/deploy/"

cd $SRC_DIR

rm -rf .demeteorized/
rm -rf .demeteorized

git tag $(date "+%Y%m%d%H%M")

demeteorizer --release 0.8.1.3
rsync -ur .demeteorized/ $DEPLOY_DIR

cd $DEPLOY_DIR

git add --all .
git commit -a -m $(date "+%Y%m%d%H%M")
git tag $(date "+%Y%m%d%H%M")
git push -u origin --all
rm -rf programs/client/*.js
rm -rf programs/client/*.css
