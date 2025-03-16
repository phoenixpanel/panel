<?php

namespace Phoenixpanel\Http\Requests\Api\Application\Servers\Databases;

use Phoenixpanel\Services\Acl\Api\AdminAcl;
use Phoenixpanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetServerDatabasesRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_SERVER_DATABASES;

    protected int $permission = AdminAcl::READ;
}
