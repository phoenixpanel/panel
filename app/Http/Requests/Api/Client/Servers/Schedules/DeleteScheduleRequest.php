<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Schedules;

use PhoenixPanel\Models\Permission;

class DeleteScheduleRequest extends ViewScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_DELETE;
    }
}


