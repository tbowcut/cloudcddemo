<?php

namespace Drupal\df\Command;

use Drupal\lightning\Command\BehatInitCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * A command to generate Behat configuration for an installed Drupal site.
 */
class DFBehatInitCommand extends BehatInitCommand {

  /**
   * BehatInitCommand constructor.
   *
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   The file system service.
   * @param string $app_root
   *   The Drupal application root.
   */
  public function __construct($file_system, $app_root) {
    parent::__construct($file_system, $app_root);
  }

  /**
   * {@inheritdoc}
   */
  protected function execute(InputInterface $input, OutputInterface $output) {
    parent::execute($input, $output);

    $config = $this->readConfig();

    // Use the Drupal Extension, if available.
    if (class_exists('\Drupal\DrupalExtension\ServiceContainer\DrupalExtension')) {
      // Use DF-specific message selectors.
      $config['default']['extensions']['Drupal\DrupalExtension']['selectors']['message_selector'] = '.zurb-foundation-callout';
      $config['default']['extensions']['Drupal\DrupalExtension']['selectors']['error_message_selector'] = '.zurb-foundation-callout.alert';
      $config['default']['extensions']['Drupal\DrupalExtension']['selectors']['success_message_selector'] = '.zurb-foundation-callout.success';
    }

    $this->writeConfig($config, $input->getOption('merge'));
  }

}
