<?php

namespace PhoenixPanel\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use PhoenixPanel\Models\AdSetting;

class AdServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Share ad settings with all views
        View::composer('*', function ($view) {
            $adSettings = AdSetting::getSettings();
            $view->with('adSettings', $adSettings);
        });
    }
}