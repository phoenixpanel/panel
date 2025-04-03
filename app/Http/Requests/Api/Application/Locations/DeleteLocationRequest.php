<?php

namespace PheonixPanel\Http\Requests\Api\Application\Locations;

use PheonixPanel\Services\Acl\Api\AdminAcl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteLocationRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_LOCATIONS;

    protected int $permission = AdminAcl::WRITE;
}
