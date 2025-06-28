<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Users;

use PhoenixPanel\Services\Acl\Api\AdminAcl as Acl;
use PhoenixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetUsersRequest extends ApplicationApiRequest
{
    protected ?string $resource = Acl::RESOURCE_USERS;

    protected int $permission = Acl::READ;
}


