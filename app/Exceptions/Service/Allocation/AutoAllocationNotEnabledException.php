<?php

namespace PhoenixPanel\Exceptions\Service\Allocation;

use PhoenixPanel\Exceptions\DisplayException;

class AutoAllocationNotEnabledException extends DisplayException
{
    /**
     * AutoAllocationNotEnabledException constructor.
     */
    public function __construct()
    {
        parent::__construct(
            'Server auto-allocation is not enabled for this instance.'
        );
    }
}


