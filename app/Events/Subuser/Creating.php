<?php

namespace PhoenixPanel\Events\Subuser;

use PhoenixPanel\Events\Event;
use PhoenixPanel\Models\Subuser;
use Illuminate\Queue\SerializesModels;

class Creating extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Subuser $subuser)
    {
    }
}
