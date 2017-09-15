#!/bin/sh
set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# Use: Package current working Demo Framework site into a tarball and deploy it to cloud.
# Example: ./autobahn.sh ~/Sites/demo myacquiasub

# required [TARGET] the source for your Demo Framework site docroot and vendor dirs.
# required [SUB] the subscription to deploay to.
# optional [SITE] defaults to 'default', use if your settings.php is within a multisite folder.

TARGET=$1
SUB=$2
SITE=${3:-default}

(
cd $TARGET
# Grab latest demotocloud.sh script.
if [[ ! -e demotocloud.sh || ! -e common.sh ]]; then
  git clone https://github.com/acquia/cloud-demo-script.git
  cp cloud-demo-script/demotocloud.sh .
  cp cloud-demo-script/common.sh .
  rm -rf cloud-demo-script
fi
# Double check that we *really* have the script.
if [[ ! -r demotocloud.sh || ! -r common.sh ]]; then
  echo 'Cloud demo script did not clone correctly.'
  exit 1
fi
)

echo "Running package.sh"
(
cd $TARGET
yes "yes" | ./package.sh $TARGET autobahn_generated_$SUB $SITE
)

echo "Running demotocloud.sh"
(
cd $TARGET
yes "yes" | ./demotocloud.sh -f autobahn_generated_$SUB-$(date +%F).tar.gz -s $SUB
)
