<?php

namespace PheonixPanel\Events\Subuser;

use PheonixPanel\Events\Event;
use PheonixPanel\Models\Subuser;
use Illuminate\Queue\SerializesModels;

class Deleting extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Subuser $subuser)
    {
    }
}
