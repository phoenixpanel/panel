<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Schedules;

use PheonixPanel\Models\Permission;

class DeleteScheduleRequest extends ViewScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_DELETE;
    }
}
