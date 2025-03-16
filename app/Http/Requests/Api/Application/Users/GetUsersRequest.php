<?php

namespace Phoenixpanel\Http\Requests\Api\Application\Users;

use Phoenixpanel\Services\Acl\Api\AdminAcl as Acl;
use Phoenixpanel\Http\Requests\Api\Application\ApplicationApiRequest;

class GetUsersRequest extends ApplicationApiRequest
{
    protected ?string $resource = Acl::RESOURCE_USERS;

    protected int $permission = Acl::READ;
}
