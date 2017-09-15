<?php

/**
 * @file
 * Contains \Drupal\acsf\Event\AcsfDuplicationScrubConfigurationHandler.
 */

namespace Drupal\acsf\Event;

/**
 * Handles the scrubbing of Drupal core state / configuration.
 *
 * Note that 'scrubbing' in our case doesn't mean just clearing configuration
 * values but also initializing them for use in a new website.
 *
 * Anything that is not specifically core or absolutely required by ACSF should
 * live in a separate contrib / distribution specific module. (See e.g.
 * gardens_duplication module in the Gardens distribution.)
 */
class AcsfDuplicationScrubConfigurationHandler extends AcsfEventHandler {

  /**
   * Implements AcsfEventHandler::handle().
   */
  public function handle() {
    drush_print(dt('Entered @class', array('@class' => get_class($this))));

    // Delete selected state values.
    $variables = array(
      'node.min_max_update_time',
      'system.cron_last',
      'system.private_key',
    );
    $state_storage = \Drupal::state();
    foreach ($variables as $name) {
      $state_storage->delete($name);
    }

    // Change configuration variables that must differ per site:

    if (\Drupal::moduleHandler()->moduleExists('acsf_sso')) {
      // Repopulate/overwrite the subset of SAML auth data which is factory /
      // sitegroup/env/factory-site-nid specific. (This indeed also overwrites
      // values which have not changed, since only the site nid changed. But we
      // want to reuse code without introducing more granularity.)
      module_load_include('install', 'acsf_sso');
      acsf_sso_install_set_env_dependent_config();
    }
  }

}
