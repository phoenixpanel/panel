<?php

namespace PheonixPanel\Http\Requests\Api\Application\Servers\Databases;

use PheonixPanel\Services\Acl\Api\AdminAcl;

class ServerDatabaseWriteRequest extends GetServerDatabasesRequest
{
    protected int $permission = AdminAcl::WRITE;
}
