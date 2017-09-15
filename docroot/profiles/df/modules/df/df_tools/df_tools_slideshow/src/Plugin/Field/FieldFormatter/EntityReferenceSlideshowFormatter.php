<?php

namespace Drupal\df_tools_slideshow\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceEntityFormatter;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

/**
 * Renders any entity reference field as a slideshow of rendered entities.
 *
 * @FieldFormatter(
 *   id = "entity_reference_slideshow",
 *   label = @Translation("Rendered entity as Slideshow"),
 *   description = @Translation("Display the referenced entities rendered by entity_view() as slides in a slideshow."),
 *   field_types = {
 *     "entity_reference"
 *   }
 * )
 */
class EntityReferenceSlideshowFormatter extends EntityReferenceEntityFormatter {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'view_mode' => 'default',
      'link' => FALSE,
      'slick' => [
        'arrows' => TRUE,
        'draggable' => TRUE,
        'dots' => TRUE,
        'accessibility' => TRUE,
        'adaptiveHeight' => FALSE,
        'variableWidth' => FALSE,
        'autoplay' => FALSE,
        'centerMode' => FALSE,
        'infinite' => TRUE,
        'useCSS' => TRUE,
        'mobileFirst' => FALSE,
        'rtl' => FALSE,
        'fade' => FALSE,
        'pauseOnDotsHover' => FALSE,
        'vertical' => FALSE,
      ],
      'use_view_mode_pager' => FALSE,
      'pager_view_mode' => 'default',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $elements = [];
    $elements['view_mode'] = [
      '#type' => 'select',
      '#options' => $this->entityDisplayRepository->getViewModeOptions($this->getFieldSetting('target_type')),
      '#title' => $this->t('View mode'),
      '#default_value' => $this->getSetting('view_mode'),
      '#required' => TRUE,
    ];

    $elements['slick'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Slick settings'),
      '#description' => $this->t('Visit @url to view detailed descriptions for each setting.', ['@url' => 'http://kenwheeler.github.io/slick/#settings']),
    ];

    foreach ($this->getSetting('slick') as $setting => $default_value) {
      $elements['slick'][$setting] = [
        '#type' => 'checkbox',
        '#title' => $setting,
        '#default_value' => $default_value,
      ];
    }

    $elements['use_view_mode_pager'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use an entity view mode for the pager'),
      '#default_value' => $this->getSetting('use_view_mode_pager'),
    ];

    $elements['pager_view_mode'] = [
      '#type' => 'select',
      '#options' => $this->entityDisplayRepository->getViewModeOptions($this->getFieldSetting('target_type')),
      '#title' => $this->t('Pager view mode'),
      '#default_value' => $this->getSetting('pager_view_mode'),
      '#required' => TRUE,
      '#states' => [
        'visible' => [
          ':input[name*="[use_view_mode_pager]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = parent::viewElements($items, $langcode);

    $elements['#attached']['library'][] = 'df_tools_slideshow/main';

    $elements['#attributes']['class'][] = 'df-tools-slideshow';

    $slideshow_id = \Drupal::service('uuid')->generate();
    $elements['#attributes']['data-df-tools-slideshow-instance-id'] = $slideshow_id;

    // Fix slick boolean values so that they're passed to javascript correctly.
    $slick = [];
    foreach ($this->getSetting('slick') as $setting => $value) {
      $slick[$setting] = (bool) $value;
    }

    $original_view_mode = $this->getSetting('view_mode');

    if ($this->getSetting('use_view_mode_pager')) {
      static::$recursiveRenderDepth = [];
      $pager_view_mode = $this->getSetting('pager_view_mode');
      $this->setSetting('view_mode', $pager_view_mode);
      $pager_elements = parent::viewElements($items, $langcode);
      foreach (Element::getVisibleChildren($pager_elements) as $i) {
        if (isset($elements[$i])) {
          $elements[$i]['pager_element'] = [
            '#type' => 'container',
            0 => $pager_elements[$i],
            '#attributes' => [
              'class' => ['df-tools-slideshow-pager-element'],
            ],
          ];
        }
      }
      $slick['customPaging'] = TRUE;
      $slick['dots'] = TRUE;
    }

    $this->setSetting('view_mode', $original_view_mode);

    $elements['#attached']['drupalSettings']['DFToolsSlideshow'][$slideshow_id]['slick'] = $slick;

    return $elements;
  }

}
