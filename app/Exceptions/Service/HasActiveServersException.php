<?php

namespace Phoenixpanel\Exceptions\Service;

use Illuminate\Http\Response;
use Phoenixpanel\Exceptions\DisplayException;

class HasActiveServersException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}
