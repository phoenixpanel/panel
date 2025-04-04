<?php

namespace PhoenixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PhoenixPanel\Services\Activity\ActivityLogBatchService;

class LogBatch extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogBatchService::class;
    }
}


