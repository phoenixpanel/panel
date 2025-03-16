<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Databases;

use Phoenixpanel\Models\Permission;
use Phoenixpanel\Contracts\Http\ClientPermissionsRequest;
use Phoenixpanel\Http\Requests\Api\Client\ClientApiRequest;

class GetDatabasesRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_DATABASE_READ;
    }
}
