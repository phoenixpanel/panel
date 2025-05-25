<?php

namespace PhoenixPanel\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\View\Factory as ViewFactory;
use PhoenixPanel\Http\Controllers\Controller;
use PhoenixPanel\Services\AdsterraApiService;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use PhoenixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PhoenixPanel\Http\Requests\Admin\Settings\AdManagerSettingsFormRequest;

class AdManagerController extends Controller
{
    /**
     * AdManagerController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private ConfigRepository $config,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private ViewFactory $view,
        private AdsterraApiService $adsterraApiService
    ) {
    }

    /**
     * Render Ads Manager Panel settings UI.
     */
    public function index(): View
    {
        $apiKey = $this->settings->get('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key'));
        $metrics = null;
        
        // Default to last 7 days
        $startDate = now()->subDays(7)->format('Y-m-d');
        $endDate = now()->format('Y-m-d');
        
        if (!empty($apiKey)) {
            $metrics = $this->adsterraApiService->getMetrics($apiKey, $startDate, $endDate);
        }
        
        return $this->view->make('admin.settings.adsmanager', [
            'ads_enabled' => $this->settings->get('phoenixpanel:ads:enabled', config('phoenixpanel.ads.enabled')),
            'ads_code' => $this->settings->get('phoenixpanel:ads:code', config('phoenixpanel.ads.code')),
            'ads_api_key' => $apiKey,
            'metrics' => $metrics,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }
    
    /**
     * Handle AJAX requests for updated metrics with date range filters.
     */
    public function getMetrics(Request $request): JsonResponse
    {
        $apiKey = $this->settings->get('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key'));
        
        if (empty($apiKey)) {
            return response()->json([
                'error' => 'API key not configured',
                'debug_info' => [
                    'timestamp' => now()->toIso8601String(),
                    'has_api_key' => false
                ]
            ], 400);
        }
        
        $startDate = $request->input('start_date', now()->subDays(7)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        
        $metrics = $this->adsterraApiService->getMetrics($apiKey, $startDate, $endDate);
        
        if ($metrics === false) {
            
            return response()->json([
                'error' => 'Failed to fetch metrics',
                'debug_info' => [
                    'timestamp' => now()->toIso8601String(),
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'has_api_key' => true
                ]
            ], 500);
        }
        
        
        return response()->json($metrics);
    }

    /**
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function update(AdManagerSettingsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set($key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('Ad management settings have been updated successfully and the queue worker was restarted to apply these changes.')->flash();

        return redirect()->route('admin.settings.adsmanager');
    }
}


