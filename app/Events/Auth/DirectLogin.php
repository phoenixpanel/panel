<?php

namespace Phoenixpanel\Events\Auth;

use Phoenixpanel\Models\User;
use Phoenixpanel\Events\Event;

class DirectLogin extends Event
{
    public function __construct(public User $user, public bool $remember)
    {
    }
}
