<?php

namespace PheonixPanel\Events\Auth;

use PheonixPanel\Events\Event;
use Illuminate\Queue\SerializesModels;

class FailedCaptcha extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public string $ip, public string $domain)
    {
    }
}
