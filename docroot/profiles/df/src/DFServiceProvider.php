<?php

namespace Drupal\df;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceModifierInterface;

class DFServiceProvider implements ServiceModifierInterface {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    if ($container->has('lightning.behat_init')) {
      // Override the class used for the lightning.behat_init service.
      $definition = $container->getDefinition('lightning.behat_init');
      $definition->setClass('\Drupal\df\Command\DFBehatInitCommand');
    }
  }

}
