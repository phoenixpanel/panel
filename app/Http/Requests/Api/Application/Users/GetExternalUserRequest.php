<?php

namespace PheonixPanel\Http\Requests\Api\Application\Users;

use PheonixPanel\Services\Acl\Api\AdminAcl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetExternalUserRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_USERS;

    protected int $permission = AdminAcl::READ;
}
