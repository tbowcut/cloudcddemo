<?php

namespace NickVeenhof\Hmac\Exception;

/**
 * Exception thrown for requests that are properly formed but are not
 * authenticated due to an invalid signature.
 */
class InvalidSignatureException extends InvalidRequestException
{
}
