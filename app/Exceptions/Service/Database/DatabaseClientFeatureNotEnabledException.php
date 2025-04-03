<?php

namespace PhoenixPanel\Exceptions\Service\Database;

use PhoenixPanel\Exceptions\PhoenixPanelException;

class DatabaseClientFeatureNotEnabledException extends PhoenixPanelException
{
    public function __construct()
    {
        parent::__construct('Client database creation is not enabled in this Panel.');
    }
}


