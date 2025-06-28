<?php

namespace PhoenixPanel\Events\Server;

use PhoenixPanel\Events\Event;
use PhoenixPanel\Models\Server;
use Illuminate\Queue\SerializesModels;

class Deleting extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Server $server)
    {
    }
}


