<?php

namespace PheonixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PheonixPanel\Services\Activity\ActivityLogTargetableService;

class LogTarget extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogTargetableService::class;
    }
}
