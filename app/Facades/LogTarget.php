<?php

namespace Phoenixpanel\Facades;

use Illuminate\Support\Facades\Facade;
use Phoenixpanel\Services\Activity\ActivityLogTargetableService;

class LogTarget extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogTargetableService::class;
    }
}
