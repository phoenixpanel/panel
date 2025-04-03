<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Subusers;

use PheonixPanel\Models\Permission;

class DeleteSubuserRequest extends SubuserRequest
{
    public function permission(): string
    {
        return Permission::ACTION_USER_DELETE;
    }
}
