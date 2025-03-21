<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Schedules;

use PhoenixPanel\Models\Permission;

class UpdateScheduleRequest extends StoreScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_UPDATE;
    }
}
