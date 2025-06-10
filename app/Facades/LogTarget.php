<?php

namespace PhoenixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PhoenixPanel\Services\Activity\ActivityLogTargetableService;

class LogTarget extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogTargetableService::class;
    }
}


