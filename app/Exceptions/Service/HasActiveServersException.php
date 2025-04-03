<?php

namespace PheonixPanel\Exceptions\Service;

use Illuminate\Http\Response;
use PheonixPanel\Exceptions\DisplayException;

class HasActiveServersException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}
