<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Servers\Databases;

use PhoenixPanel\Services\Acl\Api\AdminAcl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetServerDatabaseRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_SERVER_DATABASES;

    protected int $permission = AdminAcl::READ;
}


