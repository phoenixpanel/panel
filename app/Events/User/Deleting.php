<?php

namespace Phoenixpanel\Events\User;

use Phoenixpanel\Models\User;
use Phoenixpanel\Events\Event;
use Illuminate\Queue\SerializesModels;

class Deleting extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public User $user)
    {
    }
}
