<?php

namespace PhoenixPanel\Events\Auth;

use PhoenixPanel\Models\User;
use PhoenixPanel\Events\Event;

class DirectLogin extends Event
{
    public function __construct(public User $user, public bool $remember)
    {
    }
}


