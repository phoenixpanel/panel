<?php

namespace Phoenixpanel\Providers;

use Phoenixpanel\Models\User;
use Phoenixpanel\Models\Server;
use Phoenixpanel\Models\Subuser;
use Phoenixpanel\Models\EggVariable;
use Phoenixpanel\Observers\UserObserver;
use Phoenixpanel\Observers\ServerObserver;
use Phoenixpanel\Observers\SubuserObserver;
use Phoenixpanel\Observers\EggVariableObserver;
use Phoenixpanel\Listeners\Auth\AuthenticationListener;
use Phoenixpanel\Events\Server\Installed as ServerInstalledEvent;
use Phoenixpanel\Notifications\ServerInstalled as ServerInstalledNotification;
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
