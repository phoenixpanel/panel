<?php

namespace PhoenixPanel\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\View\Factory as ViewFactory;
use PhoenixPanel\Http\Controllers\Controller;
use PhoenixPanel\Models\AdSetting;
use Illuminate\Http\Request;

class AdManagerController extends Controller
{
    /**
     * AdManagerController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private ViewFactory $view
    ) {
    }

    /**
     * Render the UI for Ad Manager settings.
     */
    public function index(): View
    {
        $adSettings = AdSetting::first() ?? new AdSetting(['enabled' => false]);
        
        return $this->view->make('admin.settings.ads', [
            'adSettings' => $adSettings,
        ]);
    }

    /**
     * Handle ad settings update.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'boolean',
            'header_ad_code' => 'nullable|string',
            'sidebar_ad_code' => 'nullable|string',
            'footer_ad_code' => 'nullable|string',
            'content_ad_code' => 'nullable|string',
        ]);

        $adSettings = AdSetting::first();
        
        if (!$adSettings) {
            $adSettings = new AdSetting();
        }
        
        $adSettings->fill($validated);
        $adSettings->save();

        $this->alert->success('Ad settings have been updated successfully.')->flash();

        return redirect()->route('admin.settings.ads');
    }
}