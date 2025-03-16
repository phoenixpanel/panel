<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Schedules;

use Phoenixpanel\Models\Permission;

class UpdateScheduleRequest extends StoreScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_UPDATE;
    }
}
