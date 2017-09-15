<?php

namespace Drupal\moderation_dashboard\Routing;

use Drupal\Core\Url;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Response subscriber to redirect user login to the Moderation Dashboard.
 */
class ResponseSubscriber implements EventSubscriberInterface {

  /**
   * Redirects user login to the Moderation Dashboard, when appropriate.
   *
   * @param \Symfony\Component\HttpKernel\Event\FilterResponseEvent $event
   *   The response event.
   */
  public function onResponse(FilterResponseEvent $event) {
    $response = $event->getResponse();
    $request = $event->getRequest();
    if ($response instanceof RedirectResponse) {
      $user = \Drupal::currentUser();
      $is_login = $request->request->get('form_id') === 'user_login_form';
      if ($user->hasPermission('use moderation dashboard') && $is_login) {
        $url = Url::fromRoute('page_manager.page_view_moderation_dashboard_moderation_dashboard-panels_variant-0', ['user' => $user->id()]);
        $response->setTargetUrl($url->toString());
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::RESPONSE][] = ['onResponse', 100];
    return $events;
  }

}
