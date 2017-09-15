<?php

namespace NickVeenhof\Hmac\Test;

use NickVeenhof\Hmac\AuthorizationHeader;
use NickVeenhof\Hmac\AuthorizationHeaderBuilder;
use NickVeenhof\Hmac\Digest\Digest;
use NickVeenhof\Hmac\Key;
use NickVeenhof\Hmac\ResponseSigner;
use NickVeenhof\Hmac\Test\Mocks\MockRequestSigner;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;

/**
 * Tests the response signer.
 */
class ResponseSignerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * Ensures the correct headers are added when the response is signed.
     */
    public function testSignResponse()
    {
        $authId = 'efdde334-fe7b-11e4-a322-1697f925ec7b';
        $authSecret = 'W5PeGMxSItNerkNFqQMfYiJvH14WzVJMy54CPoTAYoI=';
        $realm = 'Pipet service';
        $nonce = 'd1954337-5319-4821-8427-115542e08d10';
        $timestamp = 1432075982;
        $signature = 'LusIUHmqt9NOALrQ4N4MtXZEFE03MjcDjziK+vVqhvQ=';

        $authKey = new Key($authId, $authSecret);

        $headers = [
            'X-Authorization-Timestamp' => $timestamp,
        ];

        $request = new Request('GET', 'http://example.com', $headers);
        $authHeaderBuilder = new AuthorizationHeaderBuilder($request, $authKey);
        $authHeaderBuilder->setRealm($realm);
        $authHeaderBuilder->setId($authKey->getId());
        $authHeaderBuilder->setNonce($nonce);
        $authHeader = $authHeaderBuilder->getAuthorizationHeader();

        $requestSigner = new MockRequestSigner($authKey, $realm, new Digest(), $authHeader);
        $signedRequest = $requestSigner->signRequest($request);

        $response = new Response();
        
        $responseSigner = new ResponseSigner($authKey, $signedRequest);
        $signedResponse = $responseSigner->signResponse($response);

        $this->assertTrue($signedResponse->hasHeader('X-Server-Authorization-HMAC-SHA256'));
        $this->assertEquals($signature, $signedResponse->getHeaderLine('X-Server-Authorization-HMAC-SHA256'));
    }
}
