<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Databases;

use PheonixPanel\Models\Permission;
use PheonixPanel\Contracts\Http\ClientPermissionsRequest;
use PheonixPanel\Http\Requests\Api\Client\ClientApiRequest;

class GetDatabasesRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_DATABASE_READ;
    }
}
