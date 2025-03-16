<?php

namespace Phoenixpanel\Providers;

use Laravel\Sanctum\Sanctum;
use Phoenixpanel\Models\ApiKey;
use Phoenixpanel\Models\Server;
use Phoenixpanel\Policies\ServerPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     */
    protected $policies = [
        Server::class => ServerPolicy::class,
    ];

    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(ApiKey::class);
    }
}
