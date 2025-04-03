<?php

namespace PheonixPanel\Http\Requests\Api\Application\Nests\Eggs;

use PheonixPanel\Services\Acl\Api\AdminAcl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetEggsRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_EGGS;

    protected int $permission = AdminAcl::READ;
}
