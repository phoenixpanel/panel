<?php

namespace PhoenixPanel\Events\Auth;

use PhoenixPanel\Models\User;
use PhoenixPanel\Events\Event;

class ProvidedAuthenticationToken extends Event
{
    public function __construct(public User $user, public bool $recovery = false)
    {
    }
}


