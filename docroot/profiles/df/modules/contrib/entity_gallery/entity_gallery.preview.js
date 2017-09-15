/**
 * @file
 * Preview behaviors.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Disables all non-relevant links in entity gallery previews.
   *
   * Destroys links (except local fragment identifiers such as href="#frag") in
   * entity gallery previews to prevent users from leaving the page.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches confirmation prompt for clicking links in entity gallery preview
   *   mode.
   * @prop {Drupal~behaviorDetach} detach
   *   Detaches confirmation prompt for clicking links in entity gallery preview
   *   mode.
   */
  Drupal.behaviors.entityGalleryPreviewDestroyLinks = {
    attach: function (context) {

      function clickPreviewModal(event) {
        // Only confirm leaving previews when left-clicking and user is not
        // pressing the ALT, CTRL, META (Command key on the Macintosh keyboard)
        // or SHIFT key.
        if (event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
          event.preventDefault();
          var $previewDialog = $('<div>' + Drupal.theme('entityGalleryPreviewModal') + '</div>').appendTo('body');
          Drupal.dialog($previewDialog, {
            title: Drupal.t('Leave preview?'),
            buttons: [
              {
                text: Drupal.t('Cancel'),
                click: function () {
                  $(this).dialog('close');
                }
              }, {
                text: Drupal.t('Leave preview'),
                click: function () {
                  window.top.location.href = event.target.href;
                }
              }
            ]
          }).showModal();
        }
      }

      var $preview = $(context).find('.content').once('entity-gallery-preview');
      if ($(context).find('.entity-gallery-preview-container').length) {
        $preview.on('click.preview', 'a:not([href^=#], #edit-backlink, #toolbar-administration a)', clickPreviewModal);
      }
    },
    detach: function (context, settings, trigger) {
      if (trigger === 'unload') {
        var $preview = $(context).find('.content').removeOnce('entity-gallery-preview');
        if ($preview.length) {
          $preview.off('click.preview');
        }
      }
    }
  };

  /**
   * Switch view mode.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches automatic submit on `formUpdated.preview` events.
   */
  Drupal.behaviors.entityGalleryPreviewSwitchViewMode = {
    attach: function (context) {
      var $autosubmit = $(context).find('[data-drupal-autosubmit]').once('autosubmit');
      if ($autosubmit.length) {
        $autosubmit.on('formUpdated.preview', function () {
          $(this.form).trigger('submit');
        });
      }
    }
  };

  /**
   * Theme function for entity gallery preview modal.
   *
   * @return {string}
   *   Markup for the entity gallery preview modal.
   */
  Drupal.theme.entityGalleryPreviewModal = function () {
    return '<p>' +
      Drupal.t('Leaving the preview will cause unsaved changes to be lost. Are you sure you want to leave the preview?') +
      '</p><small class="description">' +
      Drupal.t('CTRL+Left click will prevent this dialog from showing and proceed to the clicked link.') + '</small>';
  };

})(jQuery, Drupal);
