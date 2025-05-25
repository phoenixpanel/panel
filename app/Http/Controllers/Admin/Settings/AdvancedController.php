<?php

namespace PhoenixPanel\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\View\Factory as ViewFactory;
use PhoenixPanel\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use PhoenixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PhoenixPanel\Http\Requests\Admin\Settings\AdvancedSettingsFormRequest;

class AdvancedController extends Controller
{
    /**
     * AdvancedController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private ConfigRepository $config,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private ViewFactory $view
    ) {
    }

    /**
     * Render advanced Panel settings UI.
     */
    public function index(): View
    {
        $showRecaptchaWarning = false;
        if (
            $this->config->get('recaptcha._shipped_secret_key') === $this->config->get('phoenixpanel.captcha.google.secret_key')
            || $this->config->get('recaptcha._shipped_website_key') === $this->config->get('phoenixpanel.captcha.google.website_key')
        ) {
            $showRecaptchaWarning = true;
        }

        return $this->view->make('admin.settings.advanced', [
            'showRecaptchaWarning' => $showRecaptchaWarning,
            'captchaProvider' => $this->settings->get('phoenixpanel:captcha:provider', config('phoenixpanel.captcha.provider')),
            'captchaEnabled' => $this->settings->get('phoenixpanel:captcha:enabled', config('phoenixpanel.captcha.enabled')),
            'cloudflaredSiteKey' => $this->settings->get('phoenixpanel:captcha:cloudflare:site_key', config('phoenixpanel.captcha.cloudflare.site_key')),
            'cloudflareSecretKey' => $this->settings->get('phoenixpanel:captcha:cloudflare:secret_key', config('phoenixpanel.captcha.cloudflare.secret_key')),
            'googleSiteKey' => $this->settings->get('phoenixpanel:captcha:google:site_key', config('phoenixpanel.captcha.google.site_key')),
            'googleSecretKey' => $this->settings->get('phoenixpanel:captcha:google:secret_key', config('phoenixpanel.captcha.google.secret_key')),

            'ProtectCordEnabled' => $this->settings->get('phoenixpanel:protectcord:enabled', config('phoenixpanel.protectcord.enabled')),
            'ProtectCordAPI Key' => $this->settings->get('phoenixpanel:protectcord:api_key', config('phoenixpanel.protectcord.api_key')),
        ]);
    }

    /**
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function update(AdvancedSettingsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('Advanced settings have been updated successfully and the queue worker was restarted to apply these changes.')->flash();

        return redirect()->route('admin.settings.advanced');
    }
}


