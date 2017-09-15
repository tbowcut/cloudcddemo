<?php

namespace Drupal\df_tools_services\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Provides a resource for retrieving basic site information.
 *
 * @RestResource(
 *   id = "site_info",
 *   label = @Translation("Site Info"),
 *   uri_paths = {
 *     "canonical" = "/site_api/site_info"
 *   }
 * )
 */
class SiteInfoResource extends ResourceBase {

  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $theme = \Drupal::config('system.theme')->get('default');
    $site_name = \Drupal::config('system.site')->get('name');
    $theme_palette = color_get_palette($theme);
    $response = [
      'site_name' => $site_name,
      'theme_palette' => is_array($theme_palette) ? $theme_palette : [],
    ];
    return new JsonResponse($response);
  }

}
