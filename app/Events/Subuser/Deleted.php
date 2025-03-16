<?php

namespace Phoenixpanel\Events\Subuser;

use Phoenixpanel\Events\Event;
use Phoenixpanel\Models\Subuser;
use Illuminate\Queue\SerializesModels;

class Deleted extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Subuser $subuser)
    {
    }
}
