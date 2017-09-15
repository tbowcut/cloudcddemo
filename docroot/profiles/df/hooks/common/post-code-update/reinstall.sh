#!/bin/sh
#
# Cloud Hook: Reinstall Demo Framework
#
# Run `drush site-install df` in the target environment.

site="$1"
target_env="$2"
drupal_directory=$(drush @$site.$target_env dd)
scenario_path="$drupal_directory"/scenario.txt

# Fresh install of Demo Framework.
drush @$site.$target_env site-install df --account-pass=admin --yes

# Enable a scenario if a textfile, named 'scenario.txt', containing the name of
# a scenario exists in the site's drupal directory.

# Check if the scenario file exists.
if [ -e "$scenario_path" ]; then
    # Read the scenario.txt file which should contain the name of a scenario to
    # enable or 'none'.
    scenario=$(cat "$scenario_path")

    # Enable the scenario if one was specified.
    if [ "$scenario" != none ]; then
        drush @$site.$target_env enable-scenario $scenario;
    fi
  else
    echo "A scenario.txt containing the name of a scenario to enable was not found in $drupal_directory, skipping scenario enablement."
fi