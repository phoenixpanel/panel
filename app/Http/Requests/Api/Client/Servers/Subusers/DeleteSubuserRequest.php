<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Subusers;

use PhoenixPanel\Models\Permission;

class DeleteSubuserRequest extends SubuserRequest
{
    public function permission(): string
    {
        return Permission::ACTION_USER_DELETE;
    }
}
