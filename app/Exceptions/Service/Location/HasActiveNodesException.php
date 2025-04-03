<?php

namespace PhoenixPanel\Exceptions\Service\Location;

use Illuminate\Http\Response;
use PhoenixPanel\Exceptions\DisplayException;

class HasActiveNodesException extends DisplayException
{
    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}


