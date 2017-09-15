<?php

namespace Drupal\df_tools_frontend\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Uses the frontend theme for Lightning Media routes, to be consistent with
 * Content Browser and Panels IPE.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  public function alterRoutes(RouteCollection $collection) {
    foreach (['entity_browser.media_browser', 'entity_browser.image_browser', 'entity_browser.media_browser_in_modal'] as $name) {
      if ($route = $collection->get($name)) {
        $route->setOption('_admin_route', FALSE);
      }
    }
  }

}
