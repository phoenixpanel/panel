<?php

namespace PheonixPanel\Providers;

use PheonixPanel\Models\User;
use PheonixPanel\Models\Server;
use PheonixPanel\Models\Subuser;
use PheonixPanel\Models\EggVariable;
use PheonixPanel\Observers\UserObserver;
use PheonixPanel\Observers\ServerObserver;
use PheonixPanel\Observers\SubuserObserver;
use PheonixPanel\Observers\EggVariableObserver;
use PheonixPanel\Listeners\Auth\AuthenticationListener;
use PheonixPanel\Events\Server\Installed as ServerInstalledEvent;
use PheonixPanel\Notifications\ServerInstalled as ServerInstalledNotification;
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
