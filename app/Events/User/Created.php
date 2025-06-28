<?php

namespace PhoenixPanel\Events\User;

use PhoenixPanel\Models\User;
use PhoenixPanel\Events\Event;
use Illuminate\Queue\SerializesModels;

class Created extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public User $user)
    {
    }
}


