<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Locations;

use PhoenixPanel\Services\Acl\Api\AdminAcl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteLocationRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_LOCATIONS;

    protected int $permission = AdminAcl::WRITE;
}


