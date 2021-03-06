# HTTP HMAC Signer for PHP

[![Build Status](https://travis-ci.org/acquia/http-hmac-php.svg)](https://travis-ci.org/acquia/http-hmac-php)
[![Code Coverage](https://scrutinizer-ci.com/g/acquia/http-hmac-php/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/acquia/http-hmac-php/?branch=master)
[![HHVM Status](http://hhvm.h4cc.de/badge/acquia/http-hmac-php.svg?style=flat)](http://hhvm.h4cc.de/package/acquia/http-hmac-php)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/acquia/http-hmac-php/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/acquia/http-hmac-php/?branch=master)
[![Total Downloads](https://poser.pugx.org/acquia/http-hmac-php/downloads)](https://packagist.org/packages/acquia/http-hmac-php)
[![Latest Stable Version](https://poser.pugx.org/acquia/http-hmac-php/v/stable.svg)](https://packagist.org/packages/acquia/http-hmac-php)
[![License](https://poser.pugx.org/acquia/http-hmac-php/license.svg)](https://packagist.org/packages/acquia/http-hmac-php)

HMAC Request Signer is a PHP library that implements the version 2.0 of the [HTTP HMAC Spec](https://github.com/acquia/http-hmac-spec/tree/2.0)
to sign and verify RESTful Web API requests. It integrates with popular libraries such as
Symfony and Guzzle and can be used on both the server and client.

## Installation

HMAC Request Signer can be installed with [Composer](http://getcomposer.org)
by adding it as a dependency to your project's composer.json file.

```json
{
    "require": {
        "acquia/http-hmac-php": "~3.1.0"
    }
}
```

Please refer to [Composer's documentation](https://github.com/composer/composer/blob/master/doc/00-intro.md#introduction)
for more detailed installation and usage instructions.

## Usage

### Sign an API request sent via Guzzle

```php

use NickVeenhof\Hmac\Guzzle\HmacAuthMiddleware;
use NickVeenhof\Hmac\Key;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;

// Optionally, you can provide signed headers to generate the digest. The header keys need to be provided to the middleware below.
$options = [
  'headers' => [
    'X-Custom-1' => 'value1',
    'X-Custom-2' => 'value2',
  ],
];

// A key consists of your UUID and a MIME base64 encoded shared secret.
$key = new Key('e7fe97fa-a0c8-4a42-ab8e-2c26d52df059', base64_encode('secret'));

// Provide your key, realm and optional signed headers.
$middleware = new HmacAuthMiddleware($key, 'CIStore', array_keys($options['headers']));

// Register the middleware.
$stack = HandlerStack::create();
$stack->push($middleware);

// Create a client.
$client = new Client([
    'handler' => $stack,
]);

// Request.
$result = $client->get('https://service.acquia.io/api/v1/widget', $options);
var_dump($result);
```

### Authenticate the request using PSR-7-compatible requests

```php
use NickVeenhof\Hmac\RequestAuthenticator;
use NickVeenhof\Hmac\ResponseSigner;

// $keyLoader implements \NickVeenhof\Hmac\KeyLoaderInterface
$authenticator = new RequestAuthenticator($keyLoader);

// $request implements PSR-7's \Psr\Http\Message\RequestInterface
// An exception will be thrown if it cannot authenticate.
$key = $authenticator->authenticate($request);

$signer = new ResponseSigner($key, $request)
$signedResponse = $signer->signResponse($response);
```

### Authenticate using Silex's [SecurityServiceProvider](http://silex.sensiolabs.org/doc/providers/security.html)

In order to use the provided Silex security provider, you will need to include the following optional libraries in your project's `composer.json`:

```json
{
    "require": {
        "symfony/psr-http-message-bridge": "~0.1",
        "symfony/security": "~3.0",
        "zendframework/zend-diactoros": "~1.3.5"
    }
}
```

Sample implementation:

```php
use NickVeenhof\Hmac\HmacSecurityProvider;
use Silex\Application;
use Silex\Provider\SecurityServiceProvider;

$app = new Application();

// $keyLoader implements \NickVeenhof\Hmac\KeyLoaderInterface
$app->register(new SecurityServiceProvider());
$app->register(new HmacSecurityProvider($keyLoader));

$app['security.firewalls'] = [
    'hmac-auth' => array(
        'pattern' => '^/api/',
        'hmac' => true,
    ),
];

$app->boot();
```

### Authenticate using Symfony's Security component

In order to use the provided Symfony integration, you will need to include the following optional libraries in your project's `composer.json`

```json
{
    "require": {
        "symfony/psr-http-message-bridge": "~0.1",
        "symfony/security": "~3.0",
        "zendframework/zend-diactoros": "~1.3.5"
    }
}
```

Sammple implementation:

```yaml
# app/config/services.yml
services:
    hmac.security.authentication.provider:
        class: NickVeenhof\Hmac\Symfony\HmacAuthenticationProvider
        arguments:
            - '@hmac.request.authenticator' # Service should implement \NickVeenhof\Hmac\RequstAuthenticatorInterface
        public: false

    hmac.security.authentication.listener:
        class: NickVeenhof\Hmac\Symfony\HmacAuthenticationListener
        arguments: ['@security.token_storage', '@security.authentication.manager']
        public: false

# app/config/security.yml
security:
    # ...

    firewalls:
        hmac_auth:
            pattern:   ^/api/
            stateless: true
            wsse:      true
```

```php
// src/AppBundle/AppBundle.php
namespace AppBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class AppBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        // $hmacFactory should implement \Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\SecurityFactoryInterface
        // @see http://symfony.com/doc/current/cookbook/security/custom_authentication_provider.html#the-factory
        $extension = $container->getExtension('security');
        $extension->addSecurityListenerFactory($hmacFactory);
    }
}
```

## Contributing and Development

Submit changes using GitHub's standard [pull request](https://help.github.com/articles/using-pull-requests) workflow.

All code should adhere to the following standards:

* [PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
* [PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
* [PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md)
* [PSR-7](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-7-http-message.md)

Use [PHP_CodeSniffer](https://github.com/squizlabs/php_codesniffer) to validate coding style and automatically fix problems according to the PSR-2 standard:
```
$ vendor/bin/phpcs --standard=PSR2 --runtime-set ignore_warnings_on_exit true --colors src/.
$ vendor/bin/phpcs --standard=PSR2 --runtime-set ignore_warnings_on_exit true --colors test/.
$ vendor/bin/phpcbf --standard=PSR2 src/.
$ vendor/bin/phpcbf --standard=PSR2 test/.
```

Refer to [PHP Project Starter's documentation](https://github.com/cpliakas/php-project-starter#using-apache-ant)
for the Apache Ant targets supported by this project.
