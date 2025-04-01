<?php

namespace PhoenixPanel\Providers;

use Illuminate\Encryption\EncryptionServiceProvider as BaseEncryptionServiceProvider;

class ConditionalEncryptionServiceProvider extends BaseEncryptionServiceProvider
{
    /**
     * Register the service provider.
     *
     * Conditionally registers the encrypter service only if an APP_KEY is set,
     * or if the command being run is one of the allowed commands that don't require it.
     *
     * @return void
     */
    public function register()
    {
        $allowedCommandsWithoutKey = [
            'key:generate',
            'package:discover',
            // Add any other essential setup commands here if needed
        ];

        $shouldSkipRegistration = false;

        if ($this->app->runningInConsole()) {
            // Get command line arguments. Using $_SERVER['argv'] as $this->app->request might not be available yet.
            $argv = $_SERVER['argv'] ?? [];
            $command = $argv[1] ?? null;

            if ($command && in_array($command, $allowedCommandsWithoutKey) && empty(config('app.key'))) {
                $shouldSkipRegistration = true;
            }
        }

        // Only register the encrypter if we are not skipping it.
        if (!$shouldSkipRegistration) {
            parent::register();
        }
    }
}
