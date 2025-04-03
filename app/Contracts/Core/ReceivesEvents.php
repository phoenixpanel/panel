<?php

namespace PhoenixPanel\Contracts\Core;

use PhoenixPanel\Events\Event;

interface ReceivesEvents
{
    /**
     * Handles receiving an event from the application.
     */
    public function handle(Event $notification): void;
}
