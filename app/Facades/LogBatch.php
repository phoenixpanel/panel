<?php

namespace Phoenixpanel\Facades;

use Illuminate\Support\Facades\Facade;
use Phoenixpanel\Services\Activity\ActivityLogBatchService;

class LogBatch extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogBatchService::class;
    }
}
