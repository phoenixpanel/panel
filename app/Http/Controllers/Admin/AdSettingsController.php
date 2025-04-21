<?php

namespace PhoenixPanel\Http\Controllers\Admin;

use Illuminate\Http\Request;
use PhoenixPanel\Http\Controllers\Controller;
use PhoenixPanel\Models\AdSetting;
use Prologue\Alerts\AlertsMessageBag;

class AdSettingsController extends Controller
{
    /**
     * @var \Prologue\Alerts\AlertsMessageBag
     */
    protected $alert;

    /**
     * AdSettingsController constructor.
     */
    public function __construct(AlertsMessageBag $alert)
    {
        $this->alert = $alert;
    }

    /**
     * Display the ad settings page.
     */
    public function index()
    {
        $settings = AdSetting::getSettings();

        return view('admin.ads.index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the ad settings.
     */
    public function update(Request $request)
    {
        $settings = AdSetting::getSettings();

        $data = $request->validate([
            'enabled' => 'boolean',
            'top_ad_code' => 'nullable|string',
            'bottom_ad_code' => 'nullable|string',
            'sidebar_ad_code' => 'nullable|string',
            'server_list_ad_code' => 'nullable|string',
            'dashboard_ad_code' => 'nullable|string',
        ]);

        $settings->update($data);

        $this->alert->success('Ad settings have been updated successfully.')->flash();

        return redirect()->route('admin.ads');
    }
}