<?php

namespace Drupal\Tests\moderation_dashboard\Kernel;

use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\BrowserTestBase;

/**
 * Contains tests for the Moderation Dashboard module.
 *
 * @group moderation_dashboard
 */
class ModerationDashboardTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['moderation_dashboard'];

  /**
   * Tests that the Moderation Dashboard loads as expected.
   */
  public function testModerationDashboardLoads() {
    $user = $this->createUser(['use moderation dashboard', 'access content', 'view all revisions']);

    // Deny access for Anonymous users.
    $this->drupalGet('/user/1/moderation/dashboard');
    $this->assertSession()->statusCodeEquals(403);

    // Deny access if no Content Type has moderation enabled.
    $this->drupalLogin($user);
    $this->drupalGet('/user/' . $user->id() . '/moderation/dashboard');
    $this->assertSession()->statusCodeEquals(403);

    // Deny access if no moderated Node has been created (fresh install).
    $node_type = NodeType::create([
      'type' => 'page',
    ]);
    $node_type->setThirdPartySetting('workbench_moderation', 'enabled', TRUE);
    $node_type->save();
    $this->drupalGet('/user/' . $user->id() . '/moderation/dashboard');
    $this->assertSession()->statusCodeEquals(403);

    // Allow access if everything looks good.
    $node = Node::create([
      'type' => 'page',
      'title' => 'Test title first revision',
      'moderation_state' => 'published',
    ]);
    $node->save();
    $this->drupalGet('/user/' . $user->id() . '/moderation/dashboard');
    $this->assertSession()->statusCodeEquals(200);
  }

}
