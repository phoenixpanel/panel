<?php

namespace PhoenixPanel\Listeners\Auth;

use PhoenixPanel\Facades\Activity;
use PhoenixPanel\Events\Auth\ProvidedAuthenticationToken;

class TwoFactorListener
{
    public function handle(ProvidedAuthenticationToken $event): void
    {
        Activity::event($event->recovery ? 'auth:recovery-token' : 'auth:token')
            ->withRequestMetadata()
            ->subject($event->user)
            ->log();
    }
}


