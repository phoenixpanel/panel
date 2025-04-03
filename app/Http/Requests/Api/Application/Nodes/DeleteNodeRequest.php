<?php

namespace PheonixPanel\Http\Requests\Api\Application\Nodes;

use PheonixPanel\Services\Acl\Api\AdminAcl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteNodeRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_NODES;

    protected int $permission = AdminAcl::WRITE;
}
