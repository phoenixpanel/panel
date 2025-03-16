<?php

namespace Phoenixpanel\Http\Requests\Api\Application\Servers;

use Phoenixpanel\Services\Acl\Api\AdminAcl;
use Phoenixpanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetExternalServerRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_SERVERS;

    protected int $permission = AdminAcl::READ;
}
