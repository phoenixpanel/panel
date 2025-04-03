<?php

namespace PheonixPanel\Facades;

use Illuminate\Support\Facades\Facade;
use PheonixPanel\Services\Activity\ActivityLogBatchService;

class LogBatch extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogBatchService::class;
    }
}
