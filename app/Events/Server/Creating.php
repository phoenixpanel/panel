<?php

namespace Phoenixpanel\Events\Server;

use Phoenixpanel\Events\Event;
use Phoenixpanel\Models\Server;
use Illuminate\Queue\SerializesModels;

class Creating extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Server $server)
    {
    }
}
