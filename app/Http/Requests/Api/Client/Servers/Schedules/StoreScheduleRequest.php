<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Schedules;

use Phoenixpanel\Models\Schedule;
use Phoenixpanel\Models\Permission;

class StoreScheduleRequest extends ViewScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_CREATE;
    }

    public function rules(): array
    {
        $rules = Schedule::getRules();

        return [
            'name' => $rules['name'],
            'is_active' => array_merge(['filled'], $rules['is_active']),
            'minute' => $rules['cron_minute'],
            'hour' => $rules['cron_hour'],
            'day_of_month' => $rules['cron_day_of_month'],
            'day_of_week' => $rules['cron_day_of_week'],
        ];
    }
}
