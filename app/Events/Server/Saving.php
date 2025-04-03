<?php

namespace PheonixPanel\Events\Server;

use PheonixPanel\Events\Event;
use PheonixPanel\Models\Server;
use Illuminate\Queue\SerializesModels;

class Saving extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Server $server)
    {
    }
}
