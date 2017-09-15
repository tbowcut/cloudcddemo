<?php

namespace Drupal\moderation_dashboard\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\Core\Routing\RoutingEvents;
use Symfony\Component\Routing\RouteCollection;

/**
 * Attaches a permission requirement to our Page Manager route.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    if ($route = $collection->get('page_manager.page_view_moderation_dashboard_moderation_dashboard-panels_variant-0')) {
      $route->setRequirement('_permission', 'use moderation dashboard');
      $route->setRequirement('_custom_access', 'moderation_dashboard_page_access');
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // Run after \Drupal\page_manager\Routing\PageManagerRoutes.
    $events[RoutingEvents::ALTER][] = ['onAlterRoutes', -161];
    return $events;
  }

}
