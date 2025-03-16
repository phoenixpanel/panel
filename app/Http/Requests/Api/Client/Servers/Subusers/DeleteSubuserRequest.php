<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Subusers;

use Phoenixpanel\Models\Permission;

class DeleteSubuserRequest extends SubuserRequest
{
    public function permission(): string
    {
        return Permission::ACTION_USER_DELETE;
    }
}
