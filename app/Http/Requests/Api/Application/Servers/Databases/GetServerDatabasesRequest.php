<?php

namespace PheonixPanel\Http\Requests\Api\Application\Servers\Databases;

use PheonixPanel\Services\Acl\Api\AdminAcl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetServerDatabasesRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_SERVER_DATABASES;

    protected int $permission = AdminAcl::READ;
}
