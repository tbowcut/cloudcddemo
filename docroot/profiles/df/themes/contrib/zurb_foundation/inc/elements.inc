<?php
/**
 * @file
 * Override drupal core messages with Zurb Foundation alert-box messages.
 * Customize the colors within the _settings.scss file.
 *
 * http://foundation.zurb.com/docs/elements.php#panelEx
 */
function zurb_foundation_status_messages($variables) {
  $display = $variables['message_list'];
  $output = '';

  $status_heading = array(
    'error' => t('Error message'),
    'status' => t('Status message'),
    'warning' => t('Warning message'),
  );

  $status_mapping = array(
    'error' => 'alert',
    'status' => 'success',
    'warning' => 'secondary'
  );

  foreach ($display as $type => $messages) {
    if (isset($status_mapping[$type])) {
      $output .= "<div class=\"zurb-foundation-callout callout $status_mapping[$type]\" data-closable=\"fade-out\">\n";
    }
    else {
      $output .= "<div class=\"zurb-foundation-callout callout\" data-closable=\"fade-out\">\n";
    }

    if (!empty($status_heading[$type])) {
      $output .= '<h2 class="visually-hidden">' . $status_heading[$type] . "</h2>\n";
    }

    if (count($messages) > 1) {
      foreach ($messages as $message) {
        $output .= '<p>' . $message . '</p>';
      }
    }
    else {
      $output .= $messages[0];
    }

    if(!theme_get_setting('zurb_foundation_status_in_reveal')) {
      $output .= '<button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button>';
    }

    $output .= "</div>\n";
  }

  // Enable Modal Status Messages
  if ($output != '' && theme_get_setting('zurb_foundation_status_in_reveal')) {
    $output = '<div id="status-messages" data-reveal class="reveal" role="dialog" data-animation-in="fade-in" data-animation-out="fade-out">'. $output;
    $output .= '<button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button>';
    $output .= "</div>\n";
    // Add a library which reveals the modal on load.
    $library = 'zurb_foundation/status_in_reveal';
  }
  else {
    // Add a library which removes whitespace from our parent region on close.
    $library = 'zurb_foundation/alert_close';
  }

  $output = array(
    '#markup' => $output,
    '#attached' => array(
      'library' => array(
        $library
      ),
    ),
    '#allowed_tags' => ['div', 'button', 'a', 'span', 'h2', 'p'],
  );
  $output = render($output);

  return $output;
}
