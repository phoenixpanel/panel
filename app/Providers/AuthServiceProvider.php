<?php

namespace PheonixPanel\Providers;

use Laravel\Sanctum\Sanctum;
use PheonixPanel\Models\ApiKey;
use PheonixPanel\Models\Server;
use PheonixPanel\Policies\ServerPolicy;
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

    public function register(): void
    {
        Sanctum::ignoreMigrations();
    }
}
