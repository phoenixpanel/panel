<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Schedules;

use PhoenixPanel\Models\Task;
use PhoenixPanel\Models\Server;
use PhoenixPanel\Models\Schedule;
use PhoenixPanel\Models\Permission;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ViewScheduleRequest extends ClientApiRequest
{
    /**
     * Determine if this resource can be viewed.
     */
    public function authorize(): bool
    {
        if (!parent::authorize()) {
            return false;
        }

        $server = $this->route()->parameter('server');
        $schedule = $this->route()->parameter('schedule');

        // If the schedule does not belong to this server throw a 404 error. Also throw an
        // error if the task being requested does not belong to the associated schedule.
        if ($server instanceof Server && $schedule instanceof Schedule) {
            $task = $this->route()->parameter('task');

            if ($schedule->server_id !== $server->id || ($task instanceof Task && $task->schedule_id !== $schedule->id)) {
                throw new NotFoundHttpException('The requested resource does not exist on the system.');
            }
        }

        return true;
    }

    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_READ;
    }
}
