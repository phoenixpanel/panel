<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Servers\Databases;

use PhoenixPanel\Services\Acl\Api\AdminAcl;

class ServerDatabaseWriteRequest extends GetServerDatabasesRequest
{
    protected int $permission = AdminAcl::WRITE;
}
