<?php

namespace PhoenixPanel\Providers;

use Illuminate\Support\ServiceProvider;
use PhoenixPanel\Models\AdSetting;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;

class AdServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Register Blade directives for ads
        Blade::directive('headerAd', function () {
            return '<?php echo $this->renderAdIfEnabled("header_ad_code", "header-ad-container"); ?>';
        });

        Blade::directive('sidebarAd', function () {
            return '<?php echo $this->renderAdIfEnabled("sidebar_ad_code", "sidebar-ad-container"); ?>';
        });

        Blade::directive('contentAd', function () {
            return '<?php echo $this->renderAdIfEnabled("content_ad_code", "content-ad-container"); ?>';
        });

        Blade::directive('footerAd', function () {
            return '<?php echo $this->renderAdIfEnabled("footer_ad_code", "footer-ad-container"); ?>';
        });

        // Share ad settings with all views
        View::composer('*', function ($view) {
            // Don't show ads in admin area
            if (request()->is('admin*')) {
                $view->with('showAds', false);
            } else {
                $adSettings = AdSetting::first();
                $view->with('showAds', $adSettings ? $adSettings->enabled : false);
                $view->with('adSettings', $adSettings ?: new AdSetting());
            }
        });
    }

    /**
     * Render ad code if ads are enabled.
     *
     * @param string $adType
     * @param string $containerClass
     * @return string
     */
    private function renderAdIfEnabled($adType, $containerClass = '')
    {
        if (request()->is('admin*')) {
            return '';
        }

        $adSettings = AdSetting::first();
        
        if (!$adSettings || !$adSettings->enabled) {
            return '';
        }

        if (!$adSettings->$adType) {
            return '';
        }

        $cssLink = '<link rel="stylesheet" href="/css/ads.css">';
        $adContainer = '<div class="ad-container ' . $containerClass . '">' . $adSettings->$adType . '</div>';

        // Pass ad code to frontend via global variables
        $jsCode = '<script>window.' . str_replace('_ad_code', 'AdHtml', $adType) . ' = \'' . $adContainer . '\';</script>';
        
        return $cssLink . $adContainer . $jsCode;
    }
}