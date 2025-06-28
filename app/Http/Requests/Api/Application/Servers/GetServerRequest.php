<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Servers;

use PhoenixPanel\Services\Acl\Api\AdminAcl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetServerRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_SERVERS;

    protected int $permission = AdminAcl::READ;
}


