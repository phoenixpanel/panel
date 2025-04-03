<?php

namespace PhoenixPanel\Providers;

use PhoenixPanel\Models\User;
use PhoenixPanel\Models\Server;
use PhoenixPanel\Models\Subuser;
use PhoenixPanel\Models\EggVariable;
use PhoenixPanel\Observers\UserObserver;
use PhoenixPanel\Observers\ServerObserver;
use PhoenixPanel\Observers\SubuserObserver;
use PhoenixPanel\Observers\EggVariableObserver;
use PhoenixPanel\Listeners\Auth\AuthenticationListener;
use PhoenixPanel\Events\Server\Installed as ServerInstalledEvent;
use PhoenixPanel\Notifications\ServerInstalled as ServerInstalledNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     */
    protected $listen = [
        ServerInstalledEvent::class => [ServerInstalledNotification::class],
    ];

    protected $subscribe = [
        AuthenticationListener::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();

        User::observe(UserObserver::class);
        Server::observe(ServerObserver::class);
        Subuser::observe(SubuserObserver::class);
        EggVariable::observe(EggVariableObserver::class);
    }
}
