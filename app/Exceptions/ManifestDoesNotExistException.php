<?php

namespace PhoenixPanel\Exceptions;

class ManifestDoesNotExistException extends \Exception
{
    /**
     * Get the solution for the exception.
     *
     * @return array
     */
    public function getSolution()
    {
        return [
            'title' => 'Asset manifest file not found',
            'description' => 'The asset manifest file does not exist. This usually happens when assets have not been compiled. Try running "yarn build" or "npm run build" to generate the required assets.',
            'links' => [
                'Documentation' => 'https://pterodactyl.io/panel/troubleshooting.html#assets-not-loading',
            ],
        ];
    }
}

