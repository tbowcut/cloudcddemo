<?php

namespace Drupal\moderation_dashboard\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\user\Entity\User;

/**
 * Provides the "Moderation Dashboard Activity" block.
 *
 * @Block(
 *   id = "moderation_dashboard_activity",
 *   admin_label = @Translation("Moderation Dashboard Activity"),
 *   category = @Translation("Moderation Dashboard")
 * )
 */
class ModerationDashboardActivity extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $database = \Drupal::database();
    $results1 = $database->query('select revision_uid as uid,count(*) as count from {node_revision} where revision_timestamp >= unix_timestamp(date_sub(now(), interval 1 month)) group by revision_uid;')
      ->fetchAllAssoc('uid', \PDO::FETCH_ASSOC);
    $results2 = $database->query('select n.uid,count(n.uid) as count from (select nid,uid from {node_field_data} where created >= unix_timestamp(date_sub(now(), interval 1 month)) group by nid,uid) n group by n.uid;')
      ->fetchAllAssoc('uid', \PDO::FETCH_ASSOC);
    $users = User::loadMultiple(array_merge(array_keys($results1), array_keys($results2)));
    $data = [
      'labels' => [],
      'datasets' => [
        [
          'label' => $this->t('Content edited'),
          'data' => [],
          'backgroundColor' => [],
        ],
        [
          'label' => $this->t('Content authored'),
          'data' => [],
          'backgroundColor' => [],
        ],
      ],
    ];
    foreach ($users as $uid => $user) {
      $data['labels'][] = $user->label();
      $data['datasets'][0]['data'][] = isset($results1[$uid]['count']) ? $results1[$uid]['count'] : 0;
      $data['datasets'][0]['backgroundColor'][] = 'rgba(11,56,223,.8)';
      $data['datasets'][1]['data'][] = isset($results2[$uid]['count']) ? $results2[$uid]['count'] : 0;
      $data['datasets'][1]['backgroundColor'][] = 'rgba(27,223,9,.8)';
    }
    $build = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['moderation-dashboard-activity'],
      ],
      '#attached' => [
        'library' => ['moderation_dashboard/activity'],
        'drupalSettings' => ['moderation_dashboard_activity' => $data],
      ],
    ];
    return $build;
  }

}
