<?php

namespace PhoenixPanel\Repositories\Eloquent;

use PhoenixPanel\Models\Schedule;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use PhoenixPanel\Exceptions\Repository\RecordNotFoundException;
use PhoenixPanel\Contracts\Repository\ScheduleRepositoryInterface;

class ScheduleRepository extends EloquentRepository implements ScheduleRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return Schedule::class;
    }

    /**
     * Return all the schedules for a given server.
     */
    public function findServerSchedules(int $server): Collection
    {
        return $this->getBuilder()->withCount('tasks')->where('server_id', '=', $server)->get($this->getColumns());
    }

    /**
     * Return a schedule model with all the associated tasks as a relationship.
     *
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function getScheduleWithTasks(int $schedule): Schedule
    {
        try {
            return $this->getBuilder()->with('tasks')->findOrFail($schedule, $this->getColumns());
        } catch (ModelNotFoundException) {
            throw new RecordNotFoundException();
        }
    }
}
