<?php

namespace PhoenixPanel\Http\ViewComposers;

use Illuminate\View\View;
use PhoenixPanel\Services\Helpers\AssetHashService;

class AssetComposer
{
    /**
     * AssetComposer constructor.
     */
    public function __construct(private AssetHashService $assetHashService)
    {
    }

    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('asset', $this->assetHashService);
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'PhoenixPanel',
            'locale' => config('app.locale') ?? 'en',
            'captcha' => [
                'enabled' => config('phoenixpanel.captcha.enabled') ?? false,
                'provider' => config('phoenixpanel.captcha.provider') ?? '',
                'siteKey' => config('phoenixpanel.captcha.provider') === 'google' ? config('phoenixpanel.captcha.google.site_key') : (config('phoenixpanel.captcha.provider') === 'cloudflare' ? config('phoenixpanel.captcha.cloudflare.site_key') : ''),
            ],
        ]);
    }
}


