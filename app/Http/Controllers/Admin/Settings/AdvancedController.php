<?php

namespace PheonixPanel\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\View\Factory as ViewFactory;
use PheonixPanel\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use PheonixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PheonixPanel\Http\Requests\Admin\Settings\AdvancedSettingsFormRequest;

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
            $this->config->get('recaptcha._shipped_secret_key') === $this->config->get('recaptcha.secret_key')
            || $this->config->get('recaptcha._shipped_website_key') === $this->config->get('recaptcha.website_key')
        ) {
            $showRecaptchaWarning = true;
        }

        return $this->view->make('admin.settings.advanced', [
            'showRecaptchaWarning' => $showRecaptchaWarning,
        ]);
    }

    /**
     * @throws \PheonixPanel\Exceptions\Model\DataValidationException
     * @throws \PheonixPanel\Exceptions\Repository\RecordNotFoundException
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
