<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Nodes;

use PhoenixPanel\Services\Acl\Api\AdminAcl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteNodeRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_NODES;

    protected int $permission = AdminAcl::WRITE;
}


