<?php

namespace PhoenixPanel\Providers;

use Illuminate\Support\ServiceProvider;
use PhoenixPanel\Services\Activity\ActivityLogBatchService;
use PhoenixPanel\Services\Activity\ActivityLogTargetableService;

class ActivityLogServiceProvider extends ServiceProvider
{
    /**
     * Registers the necessary activity logger singletons scoped to the individual
     * request instances.
     */
    public function register()
    {
        $this->app->scoped(ActivityLogBatchService::class);
        $this->app->scoped(ActivityLogTargetableService::class);
    }
}


