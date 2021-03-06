#!/bin/sh

# Use: Package  Demo Framework into a tarball for deployment.
# Example: ./package.sh ../Sites/my_site my_site_archive

# required [TARGET] the source for your Demo Framework site docroot and vendor dirs
# required [FILE] the desired file name (do not include any extension)
# optional [SITE] defaults to 'default', use if your settings.php is within a multisite folder.

TARGET=${1:-$PWD}
FILE=${2:-demo}
SITE=${3:-default}

# Generated...
CONCAT=$FILE-$(date +%F)

# DIY throbber in the house.
throb() {
    local pid=$1
    local delay=0.05
    local spinstr='/\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Ensure the target directory exists.
if [ ! -r $TARGET ]; then
  echo "Target not found."
  exit 1
fi

# Check if a settings.php file exists before starting the script.
if [ ! -e $TARGET/docroot/sites/$SITE/settings.php ]; then
  echo "No DB connection for docroot: $TARGET. Ensure settings.php is configured before packaging."
  exit 1
fi

# Check if any existing tarball should be overwritten.
if [ -e $CONCAT.tar.gz ]; then
  while true; do
    read -p "Do you wish to overwrite existing package $CONCAT.tar.gz? [y/N] " yn
    case $yn in
        [Yy]* ) echo "Package $CONCAT.tar.gz will be overwritten."; break;;
        [Nn]* ) echo "Packaging canceled."; exit;;
        * ) echo "Please answer yes or no.";;
    esac
  done
fi

(
  # Move into the docroot and create the archive.
  cd $TARGET/docroot
  # Use local drush if possible, otherwise assume its globally installed.
  if [ -d ../vendor/drush ]; then
    echo "Using local drush from the provided vendor directory."
    DRUSH=../vendor/drush/drush/drush
  else
    echo "Using default drush provided by the machine environment."
    DRUSH=drush
  fi
  echo "Packaging drush site archive..."
  $DRUSH archive-dump $SITE --destination=../$FILE.tar.gz --overwrite --tar-options='--exclude=sites/default/files/php' &>/dev/null
) & throb $!

# Prepare the proper archive dump.
cd $TARGET
if [ ! -e $FILE.tar.gz ]; then
  echo "Archive not found."
  exit 1
fi

(
  echo "Now altering site archive for Demo Framework compatibility."
  rm -rf archive-dump
  mkdir archive-dump
  tar xfz $FILE.tar.gz -C archive-dump
  rm -rf $FILE.tar.gz
) & throb $!

# Clean up symlinks.
list=( docroot/profiles/df/*/private/* )
if [ -L ${list[1]} ]; then
  # Drush already takes care of this but we need to notify the user.
  echo "Symlinks generated by install.sh removed from the archive."
fi

(
  # Copy the vendor directory manually. :(
  cp -R vendor archive-dump/.
  echo "Vendor directory added to the archive."

  # Remove residual git files.
  rm -rf archive-dump/docroot/core/.git*
  rm -rf archive-dump/docroot/profiles/*/.git*
  rm -rf archive-dump/docroot/libraries/*/.git*
  rm -rf archive-dump/vendor/*/*/.git*
) & throb $!

# Add cloud compatibility for demotocloud.sh script.
echo "Now checking settings.php for Cloud Demo Script compatibility."
settings_check=$(grep -c "dfd8\/dfd8-settings.inc" archive-dump/docroot/sites/$SITE/settings.php 2>/dev/null)
if [ "$settings_check" -eq 0 ]; then
  if [ ! -w archive-dump/docroot/sites/$SITE/settings.php ]; then
    echo "We need to alter your settings.php and permissions are too tight!"
    sudo chmod -R 755 archive-dump/docroot/sites
  fi
  echo "if (file_exists('/var/www/site-php')) { require('/var/www/site-php/dfd8/dfd8-settings.inc'); }" >> archive-dump/docroot/sites/$SITE/settings.php
  echo "Your settings.php file has been modified to work with the demotocloud.sh script."
else
  echo "Your settings.php file is already set up correctly, so we did not modify it."
fi

(
  # Create the package.
  mv archive-dump $CONCAT
  tar -zcf $CONCAT.tar.gz $CONCAT
  rm -rf $CONCAT
  echo "Packaging complete: $(tput setab 6; tput setaf 7)$CONCAT.tar.gz$(tput sgr 0)"
) & throb $!
