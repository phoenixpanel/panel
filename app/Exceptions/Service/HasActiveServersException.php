<?php

namespace PhoenixPanel\Exceptions\Service;

use Illuminate\Http\Response;
use PhoenixPanel\Exceptions\DisplayException;

class HasActiveServersException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}


