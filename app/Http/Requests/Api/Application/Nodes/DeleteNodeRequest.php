<?php

namespace Phoenixpanel\Http\Requests\Api\Application\Nodes;

use Phoenixpanel\Services\Acl\Api\AdminAcl;
use Phoenixpanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteNodeRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_NODES;

    protected int $permission = AdminAcl::WRITE;
}
