<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Users;

use PhoenixPanel\Services\Acl\Api\AdminAcl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class DeleteUserRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_USERS;

    protected int $permission = AdminAcl::WRITE;
}


