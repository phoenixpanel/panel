<?php

namespace App\Providers;

use Illuminate\Encryption\EncryptionServiceProvider as BaseEncryptionServiceProvider;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

class CustomEncryptionServiceProvider extends BaseEncryptionServiceProvider
{
    /**
     * The command that is allowed to run without an APP_KEY.
     */
    protected const ALLOWED_COMMAND = 'key:generate';

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        // Check if running in console, the command is 'key:generate', and the app key is empty.
        if (App::runningInConsole() && $this->isCommandAllowed() && $this->isAppKeyEmpty()) {
            // If all conditions are met, do not register the encrypter,
            // allowing the 'key:generate' command to run without an APP_KEY.
            return;
        }

        // Otherwise, proceed with the default registration logic.
        parent::register();
    }

    /**
     * Check if the current Artisan command is the allowed one.
     *
     * @return bool
     */
    protected function isCommandAllowed(): bool
    {
        // Check if the 'argv' input exists and contains at least two arguments.
        if (isset($_SERVER['argv']) && count($_SERVER['argv']) >= 2) {
            // The command name is typically the second argument.
            return $_SERVER['argv'][1] === self::ALLOWED_COMMAND;
        }

        return false;
    }

    /**
     * Check if the application key is empty or null in the configuration.
     *
     * @return bool
     */
    protected function isAppKeyEmpty(): bool
    {
        $key = $this->app['config']['app.key'];

        return empty($key) || (Str::startsWith($key, 'base64:') && empty(base64_decode(substr($key, 7))));
    }
}
