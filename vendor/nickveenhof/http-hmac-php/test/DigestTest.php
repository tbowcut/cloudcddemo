<?php

namespace NickVeenhof\Hmac\Test;

use NickVeenhof\Hmac\RequestSigner;
use NickVeenhof\Hmac\Digest\Digest;

/**
 * Tests the HTTP HMAC digest
 */
class DigestTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var string
     *   A sample secret key.
     */
    protected $authSecret;

    /**
     * @var string
     *   A sample message.
     */
    protected $message;

    /**
     * {@inheritDoc}
     */
    protected function setUp()
    {
        $this->authSecret = 'TXkgU2VjcmV0IEtleSBUaGF0IGlzIFZlcnkgU2VjdXJl';
        $this->message    = 'The quick brown fox jumps over the lazy dog.';
    }

    /**
     * Ensures a message is signed correctly with a secret key.
     */
    public function testSign()
    {
        $digest = new Digest();

        $hash = 'vcOqnVc4i0YB5ILPTt92mE4zsBHC0cMHq6YpM5Gw8rI=';

        $this->assertEquals($hash, $digest->sign($this->message, $this->authSecret));
    }

    /**
     * Ensures a message is hashed correctly.
     */
    public function testHash()
    {
        $digest = new Digest();

        $hash = '71N/JciVv6eCUmUpqbY9l6pjFWTV14nCt2VEjIY1+2w=';

        $this->assertEquals($hash, $digest->hash($this->message));
    }
}
