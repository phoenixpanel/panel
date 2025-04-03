<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Schedules;

use PheonixPanel\Models\Permission;

class UpdateScheduleRequest extends StoreScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_UPDATE;
    }
}
