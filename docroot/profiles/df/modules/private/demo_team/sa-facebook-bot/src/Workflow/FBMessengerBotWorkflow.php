<?php

namespace Drupal\fb_messenger_bot\Workflow;

use Drupal\fb_messenger_bot\Conversation\BotConversationInterface;
use Drupal\fb_messenger_bot\Conversation\ConversationFactoryInterface;
use Drupal\fb_messenger_bot\FacebookService;
use Drupal\fb_messenger_bot\Message\ButtonMessage;
use Drupal\fb_messenger_bot\Message\PostbackButton;
use Drupal\fb_messenger_bot\Message\TextMessage;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\fb_messenger_bot\Step\BotWorkflowStep;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Psr\Log\LoggerInterface;
use GuzzleHttp\Exception\RequestException;

/**
 * Class FBMessengerBotWorkflow.
 *
 * @package Drupal\fb_messenger_bot\Workflow
 */
class FBMessengerBotWorkflow implements BotWorkflowInterface {
  use BotWorkflowTrait;
  use StringTranslationTrait;

  /**
   * @var \Drupal\fb_messenger_bot\Conversation\ConversationFactoryInterface;
   */
  protected $conversationFactory;

  /**
   * @var \Drupal\fb_messenger_bot\FacebookService
   */
  protected $fbService;

  /**
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * Allowed message types.
   */
  protected $allowedMessageTypes = array(
    FacebookService::MESSAGE_TYPE_TEXT,
    FacebookService::MESSAGE_TYPE_POSTBACK,
  );

  /**
   * FBMessengerBotWorkflow constructor.
   *
   * Build our step list and call trait's setSteps method.
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
    $this->config = $configFactory->get('fb_messenger_bot.settings');
    $this->conversationFactory = $conversationFactory;
    $this->stringTranslation = $stringTranslation;
    $this->fbService = $fbService;
    $this->logger = $logger;
  }

  /**
   * Helper function to build out steps.
   *
   * @return array (BotWorkflowStepInterface)
   *   An array of BotWorkflowStepInterfaces.
   *
   */
  public function buildSteps($conversation, $receivedMessage) {
    $stepList = array();

    // Set step welcoming user to conversation.
    $welcomeStep = new BotWorkflowStep('Welcome', 'welcome',
      array(
        new TextMessage('Hi there!'),
      )
    );

    $welcomeStep->setResponseHandlers(
      array(
        '*' => array(
          'handlerMessage' => NULL,
          'goto' => 'builtABot',
        ),
      )
    );

    $stepList['welcome'] = $welcomeStep;

    $builtStep = new BotWorkflowStep('Built A Bot', 'builtABot',
      new ButtonMessage('Glad you stopped by for a chat. Have you ever built a chat bot?',
        array(
          new PostbackButton('Yep!', 'builtABot_Yes'),
          new PostbackButton("Nope!", 'builtABot_No'),
        )
      )
    );

    $builtStep->setResponseHandlers(
      array(
        'builtABot_Yes' => array(
          'handlerMessage' => NULL,
          'goto' => 'veteranBuilder',
        ),
        'builtABot_No' => array(
          'handlerMessage' => NULL,
          'goto' => 'neverBuilt',
        ),
      )
    );

    $stepList['builtABot'] = $builtStep;

    $veteranStep = new BotWorkflowStep('Veteran Builder', 'veteranBuilder',
      array(
        new TextMessage("Awesome. We'd love to get your constructive feedback on this module we've put together."),
        new TextMessage("Maybe even some contributions to our repo if you've got ideas!"),
        new ButtonMessage("Click the button below to go to the next step!",
          array(
            new PostbackButton('Final step', 'veteranBuilder_final'),
          )
        ),
      )
    );

    $veteranStep->setResponseHandlers(
      array(
        'veteranBuilder_final' => array(
          'handlerMessage' => NULL,
          'goto' => 'closing',
        ),
      )
    );

    $stepList['veteranBuilder'] = $veteranStep;

    $neverBuiltStep = new BotWorkflowStep('Never Built', 'neverBuilt',
      array(
        new TextMessage("No problem! We hope this module we put together helps you out in launching your own Facebook bot!"),
        new ButtonMessage("Click the button below to go to the next step!",
          array(
            new PostbackButton('Final step', 'neverBuilt_final'),
          )
        ),
      )
    );

    $neverBuiltStep->setResponseHandlers(
      array(
        'neverBuilt_final' => array(
          'handlerMessage' => NULL,
          'goto' => 'closing',
        ),
      )
    );

    $stepList['neverBuilt'] = $neverBuiltStep;

    $closingStep = new BotWorkflowStep('Closing', 'closing',
      array(
        new TextMessage("Whether or not you've built a bot in the past,"),
        new TextMessage('drop us a line in Github with comments, thoughts, ideas, and/or feedback.'),
        new TextMessage("Anyone is open to contribute to this project! :)"),
      )
    );

    $stepList['closing'] = $closingStep;

    // Set validation callbacks.
    foreach ($stepList as $step) {
      $step_name = $step->getMachineName();
      switch ($step_name) {
        case 'welcome':
          $validationFunction = $this->getTextMessageValidatorFunction();
          $invalidResponse = $this->getGenericValidationFailMessage();
          break;

        case 'builtABot':
          $allowedPayloads = ['builtABot_Yes', 'builtABot_No'];
          $validationFunction = $this->getPostbackValidatorFunction($allowedPayloads);
          $invalidResponse = $this->getPostbackValidationFailMessage();
          break;

        case 'veteranBuilder':
          $allowedPayloads = ['veteranBuilder_final'];
          $validationFunction = $this->getPostbackValidatorFunction($allowedPayloads);
          $invalidResponse = $this->getPostbackValidationFailMessage();
          break;

        case 'neverBuilt':
          $allowedPayloads = ['neverBuilt_final'];
          $validationFunction = $this->getPostbackValidatorFunction($allowedPayloads);
          $invalidResponse = $this->getPostbackValidationFailMessage();
          break;

        default:
          $validationFunction = $this->getGenericValidatorFunction();
          $invalidResponse = $this->getGenericValidationFailMessage();
          break;
      }

      $step->setValidationCallback($validationFunction);
      $step->setInvalidResponseMessage($invalidResponse);
    }

    return $stepList;
  }

  /**
   * Set up the message structure for the generic validation failure message.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   *
   */
  public static function getGenericValidationFailMessage() {
    $outgoingMessage = new TextMessage("Sorry, I couldn't process that. Can you please try that step again?");
    return $outgoingMessage;
  }

  /**
   * Set up a generic validation function.
   *
   * @return callable
   *   A validation function.
   *
   */
  protected function getGenericValidatorFunction() {
    $temporaryValidator = function ($input) {
      return $input;
    };

    return $temporaryValidator;
  }

  /**
   * Set up a generic validation function for text messages.
   *
   * @return callable
   *   A generic validation function for text messages.
   */
  protected function getTextMessageValidatorFunction() {
    $validator = function ($input) {
      if ((empty($input['message_type'])) || $input['message_type'] != FacebookService::MESSAGE_TYPE_TEXT) {
        return FALSE;
      }
      else {
        return TRUE;
      }
    };

    return $validator;
  }

  /**
   * Set up the message structure for the zip code validation failure message.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   */
  public static function getZipCodeValidationFailMessage() {
    $outgoingMessage = new TextMessage("Sorry! That's not a zip code that we can accept. It should be in one of the following formats:\n12345\n12345-6789");
    return $outgoingMessage;
  }

  /**
   * Set up a zip code validation function.
   *
   * @return callable
   *   A zip code validation function.
   */
  protected function getZipCodeValidatorFunction() {
    $zipCodeValidator = function ($input) {
      if ((empty($input['message_type'])) || $input['message_type'] != FacebookService::MESSAGE_TYPE_TEXT) {
        return FALSE;
      }
      $zipCodeRegex = "/^[0-9]{5,5}(\-)?([0-9]{4,4})?$/";
      if (!empty(preg_match($zipCodeRegex, $input['message_content']))) {
        return TRUE;
      }
      else {
        return FALSE;
      }
    };

    return $zipCodeValidator;
  }

  /**
   * Set up the message structure for postback message validation failures.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   */
  public static function getPostbackValidationFailMessage() {
    $outgoingMessage = new TextMessage("To continue, just tap a button from the previous question.");
    return $outgoingMessage;
  }

  /**
   * Get the postback validator closure.
   *
   * @param array $allowedPayloads
   *   An array of strings, representing allowed payload names.
   *
   * @return callable
   *   The callable validation function.
   */
  protected function getPostbackValidatorFunction(array $allowedPayloads) {
    $postbackValidator = function($input) use($allowedPayloads) {
      if (empty($input['message_type']) || $input['message_type'] != FacebookService::MESSAGE_TYPE_POSTBACK) {
        return FALSE;
      }
      if (empty($input['message_content']) || !in_array($input['message_content'], $allowedPayloads)) {
        return FALSE;
      }
      return TRUE;
    };

    return $postbackValidator;
  }

  /**
   * Set up the message structure for the phone validation failure message.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   */
  public static function getPhoneValidationFailMessage() {
    $outgoingMessage = new TextMessage("Sorry! That's not a phone number that we can accept. It should be in the following format: 123-456-7890");
    return $outgoingMessage;
  }

  /**
   * Set up a phone number validation function.
   *
   * @return callable
   *   A phone number validation function.
   */
  protected function getPhoneValidatorFunction() {
    $phoneNumberValidator = function ($input) {
      if ((empty($input['message_type'])) || $input['message_type'] != FacebookService::MESSAGE_TYPE_TEXT) {
        return FALSE;
      }
      $phoneNumberRegex = "/^([0-9]{3}|(\([0-9]{3}\)))[\-. ]?[0-9]{3}[\-. ]?[0-9]{4}$/";
      if (!empty(preg_match($phoneNumberRegex, $input['message_content']))) {
        return TRUE;
      }
      else {
        return FALSE;
      }
    };

    return $phoneNumberValidator;
  }

  /**
   * Set up the message structure for the email validation failure message.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   The message to send back to the user.
   */
  public static function getEmailValidationFailMessage() {
    $outgoingMessage = new TextMessage("Sorry! That's not an email address that we can accept. It should be in the following format: yourname@example.com");
    return $outgoingMessage;
  }

  /**
   * Set up an email validation function.
   *
   * @return callable
   *   An email validation function.
   */
  protected function getEmailValidatorFunction() {
    $emailValidator = function ($input) {
      if ((empty($input['message_type'])) || $input['message_type'] != FacebookService::MESSAGE_TYPE_TEXT) {
        return FALSE;
      }
      if (preg_match('/@.*?(\..*)+/', $input['message_content']) === 0) {
        return FALSE;
      }
      // Ensure no 4-byte characters are part of the e-mail, because those are stripped from messages.
      if (preg_match('/[\x{10000}-\x{10FFFF}]/u', $input['message_content']) !== 0) {
        return FALSE;
      }
      if ((bool)filter_var($input['message_content'], FILTER_VALIDATE_EMAIL) == FALSE) {
        return FALSE;
      }

      return \Drupal::service('email.validator')->isValid($input['message_content'], FALSE, TRUE);
    };

    return $emailValidator;
  }

  /**
   * Overrides default implementation provided in BotWorkflowTrait.
   *
   * {@inheritdoc}
   */
  protected function preprocessSpecialMessages(array $receivedMessage, BotConversationInterface &$conversation) {
    // TODO This is hacked in the bot code - it needs to be moved to the DemoFBBotWorkflow
    // Yes we should be injecting services here. No we are not currently.
    $config = \Drupal::service('config.factory')->getEditable('fb_bot.' . $conversation->getUserId());
    $moduleHandler = \Drupal::service('module_handler');
    $email_validator = \Drupal::service('email.validator');
    $specialMessages = array();
    if (preg_match('/^activate/i', trim($receivedMessage['message_content']))) {
      list($foo, $name, $email, $url, $lift_account, $lift_site_id, $api_key, $secret_key) = explode(' ', trim($receivedMessage['message_content']));
      // Remove quotes from url
      $url = str_replace("'", "", $url);
      // Validate url
      $url_validate = parse_url($url);
      try {
        $response = \Drupal::httpClient()->get($url);
      }
      catch (RequestException $e) {
        watchdog_exception('fb_messenger_bot', $e);
      }
      // Check for https then proceed forward.
      if ($url_validate['scheme'] != 'https') {
        $specialMessages[] = new TextMessage('The URL must start with https');
      } elseif (!$email_validator->isValid($email)) {
        $specialMessages[] = new TextMessage('The email "' . $email . '" could not be validated');
      } elseif (isset($response)  && $response->getStatusCode() == 200) {
        $config->set('name', $name);
        $config->set('url', $url);
        $config->set('email', $email);
        $config->set('lift_account', $lift_account);
        $config->set('lift_site_id', $lift_site_id);
        $config->set('api_key', $api_key);
        $config->set('secret_key', $secret_key);
        $config->save();
        // When Lift is enabled, log the activation message event.
        if ($moduleHandler->moduleExists('as_lift')) {
          $lift_config = \Drupal::service('config.factory')->getEditable('acquia_lift.settings');
          $lift_config->set('credential.account_id', $config->get('lift_account'));
          $lift_config->set('credential.site_id', $config->get('lift_site_id'));
          $content_hub_config = \Drupal::service('config.factory')->getEditable('acquia_contenthub.admin_settings');
          $content_hub_config->set('api_key', $config->get('api_key'));
          $content_hub_config->set('secret_key', $config->get('secret_key'));
          _as_lift_create_event($conversation->getUserId(),
            'facebook',
            [$email => 'email'],
            'Facebook message',
            'Facebook Messenger',
            [['event', '20', 'activate']],
            $lift_config,
            $content_hub_config
          );
        }
        $specialMessages = $this->startOver($conversation);
      }
      else {
        $specialMessages[] = new TextMessage('Sorry, that url does not resolve.');
      }
    }
    // On every request, set Lift event when the email is set for the profile.
    if ($moduleHandler->moduleExists('as_lift') && $email_validator->isValid($config->get('email'))) {
      $lift_config = \Drupal::service('config.factory')->getEditable('acquia_lift.settings');
      $lift_config->set('credential.account_id', $config->get('lift_account'));
      $lift_config->set('credential.site_id', $config->get('lift_site_id'));
      $content_hub_config = \Drupal::service('config.factory')->getEditable('acquia_contenthub.admin_settings');
      $content_hub_config->set('api_key', $config->get('api_key'));
      $content_hub_config->set('secret_key', $config->get('secret_key'));
      _as_lift_create_event($conversation->getUserId(),
        'facebook',
        [$config->get('email') => 'email'],
        'Facebook message',
        'Facebook Messenger',
        [['event', '20', 'User input: "' . trim($receivedMessage['message_content']) . '"']],
        $lift_config,
        $content_hub_config
      );
    }

    // Start Over functionality.
    if (preg_match('/^start( )*over$/i', trim($receivedMessage['message_content']))) {
      $specialMessages = $this->startOver($conversation);
    }

    // Reset everything.
    if (preg_match('/^reset( )*bot/i', trim($receivedMessage['message_content']))) {
      $config->clear('name');
      $config->clear('url');
      $config->clear('email');
      $config->clear('lift_account');
      $config->clear('lift_site_id');
      $config->clear('api_key');
      $config->clear('secret_key');
      $config->save();
      $specialMessages[] = new TextMessage('Bot has been reset');
    }

    // Check settings.
    if (preg_match('/^check( )*bot/i', trim($receivedMessage['message_content']))) {
      $specialMessages[] = new TextMessage('Name: ' . $config->get('name'));
      $specialMessages[] = new TextMessage('Url: ' . $config->get('url'));
      $specialMessages[] = new TextMessage('Email: ' . $config->get('email'));
      $specialMessages[] = new TextMessage('Lift Account: ' . $config->get('lift_account'));
      $specialMessages[] = new TextMessage('Lift Site Id: ' . $config->get('lift_site_id'));
    }

    return $specialMessages;
  }

  /**
   *
   * Overrides default implementation provided in BotWorkflowTrait.
   *
   * {@inheritdoc}
   */
  protected function checkDisallowedMessageType(array $receivedMessage, BotConversationInterface &$conversation) {
    $allowedTypes = $this->allowedMessageTypes;
    if (in_array($receivedMessage['message_type'], $allowedTypes, TRUE)) {
      return array();
    }
    return array(
      new TextMessage("Whatever it is that you sent..we can't process it! Try again!"),
    );
  }

  /**
   * Overrides default implementation provided in BotWorkflowTrait.
   *
   * {@inheritdoc}
   */
  protected function getTrollingMessage() {
    $messages = array();
    $messages[] = new TextMessage("Hey there! I'm not following what you're trying to say.");
    $messages[] = new TextMessage("Read the last message we sent out to get an idea of what kind of response we're expecting.");
    $messages[] = new TextMessage("You can also start over by sending us the text 'Start Over'.");
    return $messages;
  }

  /**
   * Starts the Conversation over.
   *
   * @param BotConversationInterface $conversation
   *   The Conversation to start over. Will be destroyed and rebuilt.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   Returns the start over message.
   */
  protected function getContent(BotConversationInterface &$conversation) {
    $company1 = $company2 = 'A';

    $ambianceStep = new BotWorkflowStep('Ambiance Options', 'ambianceOptions',
      array (
      new TextMessage('AAA Like you, Catapult Dynamics and Short Stacked Integration are startup companies. Take a look at their ambiance for inspiration.'), 
      new TextMessage($company1),
      new TextMessage($company2),
      new ButtonMessage("Which of these do you like?",
          array(
          new PostbackButton('Catapult Dynamics', 'copmanyXAmbiance'),
          new PostbackButton('Short Stacked Integration', 'copmanyYAmbiance'),
          ) 
        ),
      )
    );

    $response = $ambianceStep->getQuestionMessage();
    $conversation = $this->conversationFactory->getConversation($conversation->getUserId())->setLastStep('copmanyXAmbiance');

    return $response;
  }


  /**
   * Starts the Conversation over.
   *
   * @param BotConversationInterface $conversation
   *   The Conversation to start over. Will be destroyed and rebuilt.
   *
   * @return \Drupal\fb_messenger_bot\Message\MessageInterface
   *   Returns the start over message.
   */
  protected function startOver(BotConversationInterface &$conversation) {
    $stepName = $this->getDefaultStep();
    // Remove the existing conversation from the database and start new one.
    $uid = $conversation->getUserId();
    $conversation->delete();

    // Assign the newly loaded conversation to the original $conversation
    // variable passed by reference.
    $conversation = $this->conversationFactory->getConversation($uid)->setLastStep($stepName);
    $conversation->save();

    // Send the welcome message.
    $response = $this->getStep($stepName)->getQuestionMessage();
    return $response;
  }

  /**
   * Stores the user's first and last name from FB.
   *
   * @param BotConversationInterface $conversation
   *   The Conversation to retrieve and set the name for.
   *
   * @return bool
   *   TRUE if names set, FALSE if not.
   */
  protected function setName(BotConversationInterface &$conversation) {
    $uid = $conversation->getUserId();
    $nameFromFB = $this->fbService->getUserInfo($uid);
    if ((!empty($nameFromFB['first_name'])) && !empty($nameFromFB['first_name'])) {
      $conversation->setValidAnswer('firstName', $nameFromFB['first_name'], TRUE);
      $conversation->setValidAnswer('lastName', $nameFromFB['last_name'], TRUE);
      return TRUE;
    }
    else {
      $conversation->setValidAnswer('firstName', '', TRUE);
      $conversation->setValidAnswer('lastName', '', TRUE);
      $this->logger->error('Failed to retrieve first or last name for conversation for userID @uid.',
        array('@uid' => $uid));
      return FALSE;
    }
  }

}
