<?php

namespace Phoenixpanel\Http\Requests\Api\Application\Servers\Databases;

use Phoenixpanel\Services\Acl\Api\AdminAcl;

class ServerDatabaseWriteRequest extends GetServerDatabasesRequest
{
    protected int $permission = AdminAcl::WRITE;
}
