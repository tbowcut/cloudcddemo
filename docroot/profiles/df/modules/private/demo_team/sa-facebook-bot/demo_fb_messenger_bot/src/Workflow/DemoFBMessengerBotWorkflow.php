<?php

namespace Drupal\demo_fb_messenger_bot\Workflow;

use Drupal\fb_messenger_bot\Conversation\ConversationFactoryInterface;
use Drupal\fb_messenger_bot\FacebookService;
use Drupal\fb_messenger_bot\Message\ButtonMessage;
use Drupal\fb_messenger_bot\Message\ListMessage;
use Drupal\fb_messenger_bot\Message\PostbackButton;
use Drupal\fb_messenger_bot\Message\TextMessage;
use Drupal\fb_messenger_bot\Message\ImageMessage;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\fb_messenger_bot\Step\BotWorkflowStep;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\fb_messenger_bot\Workflow\FBMessengerBotWorkflow;
use Psr\Log\LoggerInterface;
use GuzzleHttp\Exception\RequestException;

/**
 * Class DemoFBMessengerBotWorkflow.
 *
 * @package Drupal\fb_messenger_bot\Workflow
 */
class DemoFBMessengerBotWorkflow extends FBMessengerBotWorkflow {

  /**
   * Constructs the demo fb messenger bot workflow.
   *
   * @param ConfigFactoryInterface $configFactory
   *   The config factory.
   * @param \Drupal\fb_messenger_bot\Conversation\ConversationFactoryInterface $conversationFactory
   *   The conversation factory.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $stringTranslation
   *   The string translation service.
   * @param FacebookService $fbService
   *   The facebook service.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   */
  public function __construct(ConfigFactoryInterface $configFactory, ConversationFactoryInterface $conversationFactory, TranslationInterface $stringTranslation, FacebookService $fbService, LoggerInterface $logger) {
    parent::__construct($configFactory, $conversationFactory, $stringTranslation, $fbService, $logger);
  }

  /**
   * Helper function to build out steps.
   *
   * @return array (BotWorkflowStepInterface)
   *   An array of BotWorkflowStepInterfaces.
   *
   */
  public function buildSteps($conversation, $receivedMessage) {
    $stepList = [];
    $products = [];
    $final_url = '';
    $client = \Drupal::httpClient();

    if (!empty($conversation)) {
      $config = \Drupal::service('config.factory')->getEditable('fb_bot.' . $conversation->getUserId());
      if (!empty($config->get('url'))) {
        $final_url = $config->get('url');
        try {
          $product_list = $client->get($final_url . '/api/node/product?cache=' . rand());
          $product = (string) $product_list->getBody();
          $products = json_decode($product, TRUE);
        }
        catch (RequestException $e) {
          watchdog_exception('fb_messenger_bot', $e);
          $config->set('name', '');
          $config->set('url', '');
          $config->set('email', '');
          $config->save();
        }
      }
    }

    // Set step welcoming user to conversation.
    $welcomeStep = new BotWorkflowStep('Welcome', 'welcome', [
      new TextMessage('Hi! Thanks for contacting Obio. What can I help you with?')
    ]);
    $welcomeStep->setResponseHandlers([
        '*' => [
          'handlerMessage' => NULL,
          'goto' => 'whatsYourLook',
        ]
    ]);
    $stepList['welcome'] = $welcomeStep;

    $yourLookStep = new BotWorkflowStep('What is your look', 'whatsYourLook',
      array(
        new TextMessage('Oh, OK. Do you have a particular design or style in mind?'),
      )
    );
    $yourLookStep->setResponseHandlers(
      array(
        '*' => array(
          'handlerMessage' => NULL,
          'goto' => 'ambianceOptions',
        ),
      )
    );
    $stepList['whatsYourLook'] = $yourLookStep;

    // Only show startup tagged products if available.
    $startup_tagged = [];
    if (isset($products[0]['field_tags'])) {
      foreach($products as $product) {
        $tags = explode(', ', $product['field_tags']);
        if (is_array($tags) && in_array('startup', $tags)) {
          $startup_tagged[] = $product;
        }
      }
    }
    if (isset($startup_tagged[0]) && isset($startup_tagged[1])) {
      $products = $startup_tagged;
    }

    // Reset array so keys start at 0.
    array_values($products);
    // Only use the first two values from the results.
    if (isset($products[0]) && isset($products[1])) {
      $listElements = [
        [
          'title' => $products[0]['title'],
          'image_url' => $products[0]['uri'],
        ],
        [
          'title' => $products[1]['title'],
          'image_url' => $products[1]['uri'],
        ]
      ];

      $company1Product = $products[0]['title'];
      $company2Product = $products[1]['title'];

      $company1Desc = $products[0]['field_product_description'];
      $company2Desc = $products[1]['field_product_description'];

      $company1Path = $products[0]['path'];
      $company2Path = $products[1]['path'];

      $company1pic = (!empty($products[0]['uri']) ? new ImageMessage($products[0]['uri']) : new TextMessage('[Image missing]'));
      $company2pic = (!empty($products[1]['uri']) ? new ImageMessage($products[1]['uri']) : new TextMessage('[Image missing]'));

      $ambianceStep = new BotWorkflowStep('Ambiance Options', 'ambianceOptions',
        array(
          new TextMessage('Here are some options you might be interested in that people like you thought were great:'),
          new ListMessage($listElements),
          new ButtonMessage("Either of these spark interest?",
            array(
              new PostbackButton($company1Product, 'companyXAmbiance'),
              new PostbackButton($company2Product, 'companyYAmbiance'),
            )
          ),
        )
      );

      $ambianceStep->setResponseHandlers(
        array(
          'companyXAmbiance' => array(
            'handlerMessage' => NULL,
            'goto' => 'packageA',
          ),
          'companyYAmbiance' => array(
            'handlerMessage' => NULL,
            'goto' => 'packageB',
          ),
        )
      );
      $stepList['ambianceOptions'] = $ambianceStep;

      $packageStep = new BotWorkflowStep('Package A', 'packageA',
        array(
          new TextMessage('Here is more info regarding: ' . $company1Product . '.'),
          $company1pic,
          new TextMessage(strip_tags($company1Desc)),
          new TextMessage("Click below for more details and pics from OBIO"),
          new TextMessage($company1Path . '?identityType=facebook&identity=' . $conversation->getUserId()),
        )
      );
      $packageStep->setResponseHandlers(
        array(
          '*' => array(
            'handlerMessage' => NULL,
            'goto' => 'closing',
          ),
        )
      );
      $stepList['packageA'] = $packageStep;

      $packageBStep = new BotWorkflowStep('Package B', 'packageB',
        array(
          new TextMessage('Here is more info regarding: ' . $company2Product),
          $company2pic,
          new TextMessage(strip_tags($company2Desc)),
          new TextMessage("Click below for more details and pics from OBIO"),
          new TextMessage($company2Path . '?identityType=facebook&identity=' . $conversation->getUserId()),
        )
      );
      $packageBStep->setResponseHandlers(
        array(
          '*' => array(
            'handlerMessage' => NULL,
            'goto' => 'closing',
          ),
        )
      );
      $stepList['packageB'] = $packageBStep;
    }

    $closingStep = new BotWorkflowStep('Closing', 'closing',
      array(
        new TextMessage("I'd be happy to put you in touch with your agent!"),
        new ImageMessage(file_create_url(drupal_get_path('module', 'dfs_obio_commerce') . '/images/wendy.jpg')),
        new TextMessage('Your professional design consultant, Wendy, will be contacting you shortly at your phone number 202-555-2362'),
      )
    );

    $stepList['closing'] = $closingStep;

    // Set validation callbacks.
    foreach ($stepList as $step) {
      $step_name = $step->getMachineName();
      $validationFunction = $this->getActivationValidationFunction($conversation);
      $invalidResponse = $this->getActivationFailMessage();
      $step->setValidationCallback($validationFunction);
      $step->setInvalidResponseMessage($invalidResponse);
    }

    return $stepList;
  }

  /**
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   *
   */
  public static function getActivationFailMessage() {
    $outgoingMessage = new TextMessage("Your account is not activated to be used with this Bot. To activate, type: activate first_name email https://site.url lift_account_id lift_site_id content_hub_api_key content_hub_secret_key
    (Example: activate Bud bud@example.com https://bmclient85z.devcloud.acquia-sites.com BUDSITE bmclient85z f0O B4r)");
    return $outgoingMessage;
  }
  /**
   * Set up a zip code validation function.
   *
   * @return callable
   *   A zip code validation function.
   */
  protected function getActivationValidationFunction($conversation) {
    $activationValidator = function($input) use($conversation) {
      if (!empty($conversation)) {
        $config = \Drupal::service('config.factory')->getEditable('fb_bot.' . $conversation->getUserId());
        if (empty($config->get('url'))) {
          return FALSE;
        } 
        return TRUE;

      } else{
        return TRUE;
      }
    };
    return $activationValidator;
  }


  /**
   * Overrides default implementation provided in BotWorkflowTrait.
   *
   * {@inheritdoc}
   */
  protected function getTrollingMessage() {
    $messages = array();
    $messages[] = new TextMessage("Hey! Trying to demo here!");
    $messages[] = new TextMessage("Read the last message we sent out to get an idea of what kind of response we're expecting.");
    $messages[] = new TextMessage("You can also start over by sending us the text 'Start Over'.");
    return $messages;
  }

}
