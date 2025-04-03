<?php

namespace PheonixPanel\Events\User;

use PheonixPanel\Models\User;
use PheonixPanel\Events\Event;
use Illuminate\Queue\SerializesModels;

class Deleted extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public User $user)
    {
    }
}
