<?php

namespace PheonixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PheonixPanel\Services\Activity\ActivityLogService;

class Activity extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogService::class;
    }
}
