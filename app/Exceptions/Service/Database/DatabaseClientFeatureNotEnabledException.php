<?php

namespace PhoenixPanel\Exceptions\Service\Database;

use PhoenixPanel\Exceptions\PterodactylException;

class DatabaseClientFeatureNotEnabledException extends PterodactylException
{
    public function __construct()
    {
        parent::__construct('Client database creation is not enabled in this Panel.');
    }
}
