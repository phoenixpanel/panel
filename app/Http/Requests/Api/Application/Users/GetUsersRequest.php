<?php

namespace PheonixPanel\Http\Requests\Api\Application\Users;

use PheonixPanel\Services\Acl\Api\AdminAcl as Acl;
use PheonixPanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetUsersRequest extends ApplicationApiRequest
{
    protected ?string $resource = Acl::RESOURCE_USERS;

    protected int $permission = Acl::READ;
}
