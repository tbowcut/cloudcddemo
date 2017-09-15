<?php

namespace Drupal\entity_gallery\Form;

use Drupal\Core\Entity\ContentEntityDeleteForm;

/**
 * Provides a form for deleting an entity gallery.
 */
class EntityGalleryDeleteForm extends ContentEntityDeleteForm {

  /**
   * {@inheritdoc}
   */
  protected function getDeletionMessage() {
    /** @var \Drupal\entity_gallery\EntityGalleryInterface $entity */
    $entity = $this->getEntity();

    $entity_gallery_type_storage = $this->entityManager->getStorage('entity_gallery_type');
    $entity_gallery_type = $entity_gallery_type_storage->load($entity->bundle())->label();

    if (!$entity->isDefaultTranslation()) {
      return $this->t('@language translation of the @type %label has been deleted.', [
        '@language' => $entity->language()->getName(),
        '@type' => $entity_gallery_type,
        '%label' => $entity->label(),
      ]);
    }

    return $this->t('The @type %title has been deleted.', array(
      '@type' => $entity_gallery_type,
      '%title' => $this->getEntity()->label(),
    ));
  }

  /**
   * {@inheritdoc}
   */
  protected function logDeletionMessage() {
    /** @var \Drupal\entity_gallery\EntityGalleryInterface $entity */
    $entity = $this->getEntity();
    $this->logger('content')->notice('@type: deleted %title.', ['@type' => $entity->getType(), '%title' => $entity->label()]);
  }

}
