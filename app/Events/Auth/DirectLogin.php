<?php

namespace PheonixPanel\Events\Auth;

use PheonixPanel\Models\User;
use PheonixPanel\Events\Event;

class DirectLogin extends Event
{
    public function __construct(public User $user, public bool $remember)
    {
    }
}
