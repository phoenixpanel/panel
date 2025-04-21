<?php

namespace PhoenixPanel\Exceptions;

class ManifestDoesNotExistException extends \Exception
{
    public function getSolution()
    {
        if (class_exists('Spatie\Ignition\Contracts\Solution')) {
            return new Solutions\ManifestDoesNotExistSolution();
        }
        
        return null;
    }
}


