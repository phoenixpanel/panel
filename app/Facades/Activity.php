<?php

namespace PhoenixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PhoenixPanel\Services\Activity\ActivityLogService;

class Activity extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogService::class;
    }
}


