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
        
        // Only update columns that exist in the database
        try {
            // Check if the table has the required columns
            $columns = \Schema::getColumnListing('ad_settings');
            $filteredData = array_intersect_key($validated, array_flip($columns));
            
            $adSettings->fill($filteredData);
            $adSettings->save();
        } catch (\Exception $e) {
            // Fallback to just updating the enabled status if other columns don't exist
            if (isset($validated['enabled'])) {
                $adSettings->enabled = $validated['enabled'];
                $adSettings->save();
            }
            
            $this->alert->warning('Some ad settings could not be saved. Please run the database migrations.')->flash();
        }

        $this->alert->success('Ad settings have been updated successfully.')->flash();

        return redirect()->route('admin.settings.ads');
    }
}