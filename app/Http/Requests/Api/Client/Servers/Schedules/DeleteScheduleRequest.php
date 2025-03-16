<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Schedules;

use Phoenixpanel\Models\Permission;

class DeleteScheduleRequest extends ViewScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_DELETE;
    }
}
