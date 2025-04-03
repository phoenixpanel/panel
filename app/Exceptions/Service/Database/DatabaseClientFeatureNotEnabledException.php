<?php

namespace PheonixPanel\Exceptions\Service\Database;

use PheonixPanel\Exceptions\PheonixPanelException;

class DatabaseClientFeatureNotEnabledException extends PheonixPanelException
{
    public function __construct()
    {
        parent::__construct('Client database creation is not enabled in this Panel.');
    }
}
