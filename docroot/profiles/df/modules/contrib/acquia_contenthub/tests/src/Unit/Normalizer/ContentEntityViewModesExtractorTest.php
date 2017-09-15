<?php

namespace Drupal\Tests\acquia_contenthub\Unit\Normalizer;

use Drupal\Core\Session\AccountInterface;
use Drupal\Tests\UnitTestCase;
use Drupal\acquia_contenthub\Normalizer\ContentEntityViewModesExtractor;

require_once __DIR__ . '/../Polyfill/Drupal.php';

/**
 * PHPUnit test for the ContentEntityViewModesExtractor class.
 *
 * @coversDefaultClass \Drupal\acquia_contenthub\Normalizer\ContentEntityViewModesExtractor
 *
 * @group acquia_contenthub
 */
class ContentEntityViewModesExtractorTest extends UnitTestCase {

  /**
   * The current session user.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $currentUser;

  /**
   * Entity display repository.
   *
   * @var \Drupal\Core\Entity\EntityDisplayRepositoryInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $entityDisplayRepository;

  /**
   * Entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $entityTypeManager;

  /**
   * Entity Config Storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $entityConfigStorage;

  /**
   * The entity type config.
   *
   * @var \Drupal\acquia_contenthub\ContentHubEntityTypeConfigInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $entityTypeConfig;

  /**
   * Renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $renderer;

  /**
   * The Kernel.
   *
   * @var \Symfony\Component\HttpKernel\HttpKernelInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $kernel;

  /**
   * Account Switcher Service.
   *
   * @var \Drupal\Core\Session\AccountSwitcherInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $accountSwitcher;

  /**
   * Content Entity.
   *
   * @var \Drupal\Core\Entity\ContentEntityInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $contentEntity;

  /**
   * Content Hub Subscription.
   *
   * @var \Drupal\acquia_contenthub\ContentHubSubscription|\PHPUnit_Framework_MockObject_MockObject
   */
  protected $contentHubSubscription;

  /**
   * Config Factory.
   *
   * @var \Drupal\Core\Config\ConfigFactory|\PHPUnit_Framework_MockObject_MockObject
   */
  private $configFactory;

  /**
   * The Block Manager.
   *
   * @var \Drupal\Core\Block\BlockManagerInterface|\PHPUnit_Framework_MockObject_MockObject
   */
  private $blockManager;

  /**
   * Settings.
   *
   * @var \Drupal\Core\Config\Config|\PHPUnit_Framework_MockObject_MockObject
   */
  private $settings;

  /**
   * Content Entity View Modes Extractor.
   *
   * @var \Drupal\acquia_contenthub\Normalizer\ContentEntityViewModesExtractor
   */
  private $contentEntityViewModesExtractor;

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    $this->currentUser = $this->getMock('Drupal\Core\Session\AccountProxyInterface');
    $this->entityDisplayRepository = $this->getMock('Drupal\Core\Entity\EntityDisplayRepositoryInterface');
    $this->entityTypeManager = $this->getMock('Drupal\Core\Entity\EntityTypeManagerInterface');
    $this->entityConfigStorage = $this->getMock('\Drupal\Core\Entity\EntityStorageInterface');
    $this->entityTypeConfig = $this->getMock('Drupal\acquia_contenthub\ContentHubEntityTypeConfigInterface');
    $this->renderer = $this->getMock('Drupal\Core\Render\RendererInterface');
    $this->kernel = $this->getMock('Symfony\Component\HttpKernel\HttpKernelInterface');
    $this->accountSwitcher = $this->getMock('Drupal\Core\Session\AccountSwitcherInterface');
    $this->contentEntity = $this->getMock('Drupal\Core\Entity\ContentEntityInterface');
    $this->contentHubSubscription = $this->getMockBuilder('\Drupal\acquia_contenthub\ContentHubSubscription')
      ->disableOriginalConstructor()
      ->getMock();
    $this->configFactory = $this->getMock('Drupal\Core\Config\ConfigFactoryInterface');
    $this->blockManager = $this->getMock('Drupal\Core\Block\BlockManagerInterface');

    $config = $this->getMockBuilder('Drupal\Core\Config\Config')
      ->disableOriginalConstructor()
      ->getMock();
    $config->expects($this->once())
      ->method('get')
      ->with('user_role')
      ->willReturn(AccountInterface::ANONYMOUS_ROLE);

    $this->configFactory->expects($this->once())
      ->method('get')
      ->with('acquia_contenthub.entity_config')
      ->willReturn($config);

    $this->contentEntityViewModesExtractor = new ContentEntityViewModesExtractor($this->currentUser, $this->entityDisplayRepository, $this->entityTypeManager, $this->renderer, $this->kernel, $this->accountSwitcher, $this->contentHubSubscription, $this->configFactory, $this->blockManager);

  }

  /**
   * Test the getRenderedViewModes method, configured not to be rendered.
   *
   * @covers ::getRenderedViewModes
   */
  public function testGetRenderedViewModesConfiguredNotToBeRendered() {
    $this->contentEntity->expects($this->once())
      ->method('getEntityTypeId')
      ->willReturn('entity_type_1');
    $this->contentEntity->expects($this->once())
      ->method('bundle')
      ->willReturn('bundle_1');

    $this->entityTypeManager->expects($this->once())
      ->method('getStorage')
      ->with('acquia_contenthub_entity_config')
      ->willReturn($this->entityConfigStorage);
    $this->entityConfigStorage->expects($this->once())
      ->method('loadMultiple')
      ->with(['entity_type_1'])
      ->willReturn([]);

    $rendered_view_modes = $this->contentEntityViewModesExtractor->getRenderedViewModes($this->contentEntity);

    $this->assertNull($rendered_view_modes);
  }

  /**
   * Test the getRenderedViewModes method, has view mode.
   *
   * @covers ::getRenderedViewModes
   */
  public function testGetRenderedViewModesHasViewMode() {
    $this->contentEntity->expects($this->any())
      ->method('getEntityTypeId')
      ->willReturn('entity_type_1');
    $this->contentEntity->expects($this->any())
      ->method('bundle')
      ->willReturn('bundle_1');

    $this->entityTypeManager->expects($this->at(0))
      ->method('getStorage')
      ->with('acquia_contenthub_entity_config')
      ->willReturn($this->entityConfigStorage);
    $this->entityTypeManager->expects($this->any(1))
      ->method('getStorage')
      ->with('acquia_contenthub_entity_config')
      ->willReturn($this->entityConfigStorage);
    $this->entityConfigStorage->expects($this->any(0))
      ->method('loadMultiple')
      ->with(['entity_type_1'])
      ->willReturn(['entity_type_1' => $this->entityTypeConfig]);
    $this->entityConfigStorage->expects($this->any(1))
      ->method('loadMultiple')
      ->with(['entity_type_1'])
      ->willReturn(['entity_type_1' => $this->entityTypeConfig]);
    $this->entityTypeConfig->expects($this->once())
      ->method('getRenderingViewModes')
      ->with('bundle_1')
      ->willReturn(['view_mode_2']);
    $this->entityDisplayRepository->expects($this->once())
      ->method('getViewModeOptionsByBundle')
      ->with('entity_type_1', 'bundle_1')
      ->willReturn([
        'view_mode_1' => 'view_mode_1 label',
        'view_mode_2' => 'view_mode_2 label',
      ]);

    $this->entityTypeConfig->expects($this->once())
      ->method('getPreviewImageField')
      ->with('bundle_1')
      ->willReturn('field_media->field_image');
    $this->entityTypeConfig->expects($this->once())
      ->method('getPreviewImageStyle')
      ->with('bundle_1')
      ->willReturn('medium');

    $field_media = $this->getMockBuilder('Drupal\Core\Entity\ContentEntityInterface')
      ->disableOriginalConstructor()
      ->getMock();
    $field_image = $this->getMockBuilder('Drupal\Core\Entity\ContentEntityInterface')
      ->disableOriginalConstructor()
      ->getMock();
    $media_entity = $this->getMock('Drupal\Core\Entity\EntityInterface');
    $image_entity = $this->getMock('Drupal\file\FileInterface');
    $image_entity->expects($this->once())
      ->method('bundle')
      ->willReturn('file');
    $image_entity->expects($this->once())
      ->method('getFileUri')
      ->willReturn('a_file_uri');

    $this->contentEntity->field_media = $field_media;
    $this->contentEntity->field_media->entity = $media_entity;
    $this->contentEntity->field_media->entity->field_image = $field_image;
    $this->contentEntity->field_media->entity->field_image->entity = $image_entity;

    $entity_manager = $this->getMock('Drupal\Core\Entity\EntityManagerInterface');
    $entity_storage = $this->getMock('Drupal\Core\Entity\EntityStorageInterface');
    $container = $this->getMock('Drupal\Core\DependencyInjection\Container');
    $image_style = $this->getMockBuilder('Drupal\image\Entity\ImageStyle')
      ->disableOriginalConstructor()
      ->getMock();
    $url_generator = $this->getMockBuilder('Drupal\Core\Routing\UrlGenerator')
      ->disableOriginalConstructor()
      ->getMock();
    $url_generator->expects($this->once())
      ->method('getPathFromRoute')
      ->willReturn('a_generated_url');

    \Drupal::setContainer($container);
    $container->expects($this->at(0))
      ->method('get')
      ->with('entity.manager')
      ->willReturn($entity_manager);
    $container->expects($this->at(1))
      ->method('get')
      ->with('url_generator')
      ->willReturn($url_generator);
    $entity_manager->expects($this->once())
      ->method('getEntityTypeFromClass')
      ->with('Drupal\image\Entity\ImageStyle')
      ->willReturn($image_entity);
    $image_entity->expects($this->once())
      ->method('bundle')
      ->willReturn('file');
    $image_entity->expects($this->once())
      ->method('getFileUri')
      ->willReturn('a_file_uri');
    $entity_manager->expects($this->once())
      ->method('getStorage')
      ->with($image_entity)
      ->willReturn($entity_storage);
    $entity_storage->expects($this->once())
      ->method('load')
      ->with('medium')
      ->willReturn($image_style);
    $image_style->expects($this->once())
      ->method('buildUrl')
      ->with('a_file_uri')
      ->willReturn('a_style_decorated_file_uri');

    $this->contentHubSubscription->expects($this->once())
      ->method('setHmacAuthorization')
      ->will($this->returnArgument(0));

    $response = $this->getMock('Drupal\Core\Render\HtmlResponse');
    $response->expects($this->once())
      ->method('getContent')
      ->willReturn('a_html_response_content');
    $this->kernel->expects($this->once())
      ->method('handle')
      ->willReturn($response);

    $rendered_view_modes = $this->contentEntityViewModesExtractor->getRenderedViewModes($this->contentEntity);

    $expected_rendered_view_modes = [
      'view_mode_2' => [
        'id' => 'view_mode_2',
        'preview_image' => 'file_create_url:a_style_decorated_file_uri',
        'label' => 'view_mode_2 label',
        'url' => '/a_generated_url',
        'html' => 'a_html_response_content',
      ],
    ];

    $this->assertEquals($expected_rendered_view_modes, $rendered_view_modes);
  }

}
