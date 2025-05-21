<?php

namespace PhoenixPanel\Http\Controllers\Admin\Settings;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Carbon;
use PhoenixPanel\Http\Controllers\Controller;
use Prologue\Alerts\AlertsMessageBag;
use PhoenixPanel\Models\AdPlacement;
use PhoenixPanel\Models\AdVariant;
use PhoenixPanel\Contracts\Repository\SettingsRepositoryInterface;
use PhoenixPanel\Services\AdsterraApiService;
use PhoenixPanel\Services\Helpers\SoftwareVersionService;

class AdsController extends Controller
{
    /**
     * @var \Prologue\Alerts\AlertsMessageBag
     */
    private $alert;

    /**
     * @var \PhoenixPanel\Contracts\Repository\SettingsRepositoryInterface
     */
    private $settings;

    /**
     * @var \PhoenixPanel\Services\Helpers\SoftwareVersionService
     */
    private $versionService;

    /**
     * @var \PhoenixPanel\Services\AdsterraApiService
     */
    private $adsterraService;

    /**
     * AdsController constructor.
     */
    public function __construct(
        AlertsMessageBag $alert,
        SettingsRepositoryInterface $settings,
        SoftwareVersionService $versionService,
        AdsterraApiService $adsterraService
    ) {
        $this->alert = $alert;
        $this->settings = $settings;
        $this->versionService = $versionService;
        $this->adsterraService = $adsterraService;
    }

    /**
     * Render the ads settings page.
     */
    public function index(): View
    {
        return view('admin.settings.ads');
    }

    /**
     * Handle settings update.
     *
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function update(Request $request): RedirectResponse
    {
        // Ad Settings
        $this->settings->set('phoenixpanel:ads:api_key', $request->input('phoenixpanel:ads:api_key'));
        $this->settings->set('phoenixpanel:ads:universal_code_enabled', $request->input('phoenixpanel:ads:universal_code_enabled'));
        $this->settings->set('phoenixpanel:ads:universal_code', $request->input('phoenixpanel:ads:universal_code'));

        $this->alert->success('Ad settings have been updated successfully.')->flash();

        return redirect()->route('admin.settings.ads');
    }

    /**
     * Generate a preview of ad placements.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function preview(Request $request): JsonResponse
    {
        // Get ad placement data from request
        $placements = $request->input('placements', []);
        
        // Generate HTML representation for each device view
        $previewHtml = [
            'desktop' => $this->generatePreviewHtml($placements, 'desktop'),
            'tablet' => $this->generatePreviewHtml($placements, 'tablet'),
            'mobile' => $this->generatePreviewHtml($placements, 'mobile')
        ];
        
        return response()->json([
            'success' => true,
            'preview' => $previewHtml
        ]);
    }
    
    /**
     * Generate HTML preview for a specific device view.
     *
     * @param array $placements
     * @param string $deviceType
     * @return string
     */
    private function generatePreviewHtml(array $placements, string $deviceType): string
    {
        // Device dimensions
        $dimensions = [
            'desktop' => ['width' => 1200, 'height' => 800],
            'tablet' => ['width' => 768, 'height' => 1024],
            'mobile' => ['width' => 375, 'height' => 667]
        ];
        
        $width = $dimensions[$deviceType]['width'];
        $height = $dimensions[$deviceType]['height'];
        
        // Start building the HTML
        $html = '<div class="preview-container" style="position: relative; width: ' . $width . 'px; height: ' . $height . 'px; overflow: hidden; background-color: #f8f9fa;">';
        
        // Add mock page layout
        $html .= '
            <div style="height: 60px; background-color: #343a40; margin-bottom: 20px;"></div>
            <div style="display: flex; gap: 20px;">
                <div style="flex: 0 0 ' . ($deviceType === 'mobile' ? '0' : '200') . 'px; height: 600px; background-color: #f8f9fa;"></div>
                <div style="flex: 1; height: 1200px; background-color: #f8f9fa;"></div>
                <div style="flex: 0 0 ' . ($deviceType === 'mobile' ? '0' : '250') . 'px; height: 400px; background-color: #f8f9fa;"></div>
            </div>
            <div style="height: 100px; background-color: #343a40; margin-top: 20px;"></div>
        ';
        
        // Add ad placements
        foreach ($placements as $placement) {
            // Skip if not targeted for this device type
            if (!in_array($deviceType, $placement['deviceTargeting'])) {
                continue;
            }
            
            // Skip if not active
            if (!$placement['isActive']) {
                continue;
            }
            
            // Add the ad placement
            $html .= '
                <div class="preview-ad-placement" style="
                    position: absolute;
                    left: ' . $placement['x'] . 'px;
                    top: ' . $placement['y'] . 'px;
                    width: ' . $placement['width'] . 'px;
                    height: ' . $placement['height'] . 'px;
                    background-color: rgba(0, 123, 255, 0.2);
                    border: 2px solid #007bff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    box-sizing: border-box;
                ">
                    <div style="font-size: 12px; color: #333; text-align: center;">
                        ' . htmlspecialchars($placement['name']) . '<br>
                        ' . $placement['width'] . '×' . $placement['height'] . '
                    </div>
                </div>
            ';
        }
        
        $html .= '</div>';
        
        return $html;
    }

    /**
     * Get ad performance metrics.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function metrics(Request $request): JsonResponse
    {
        try {
            $startDate = $request->input('start_date', date('Y-m-d', strtotime('-7 days')));
            $endDate = $request->input('end_date', date('Y-m-d'));
            $placementId = $request->input('placement_id');
            
            // Validate date range
            if (strtotime($endDate) < strtotime($startDate)) {
                return response()->json([
                    'success' => false,
                    'message' => 'End date cannot be before start date.',
                ], 400);
            }
            
            // Check if date range is too large (more than 90 days)
            $startDateTime = new \DateTime($startDate);
            $endDateTime = new \DateTime($endDate);
            $interval = $startDateTime->diff($endDateTime);
            if ($interval->days > 90) {
                return response()->json([
                    'success' => false,
                    'message' => 'Date range cannot exceed 90 days.',
                ], 400);
            }
            
            // Get metrics from Adsterra API
            $metrics = $placementId
                ? $this->adsterraService->getPlacementMetrics($placementId, $startDate, $endDate)
                : $this->adsterraService->getMetrics($startDate, $endDate);
            
            // Get placements for the dropdown
            $placements = $this->adsterraService->getPlacements();
            
            // Calculate totals
            $totals = [
                'impressions' => 0,
                'clicks' => 0,
                'revenue' => 0,
            ];
            
            foreach ($metrics as $metric) {
                $totals['impressions'] += $metric['impressions'] ?? 0;
                $totals['clicks'] += $metric['clicks'] ?? 0;
                $totals['revenue'] += $metric['revenue'] ?? 0;
            }
            
            // Calculate average CTR
            $totals['ctr'] = $totals['impressions'] > 0
                ? round(($totals['clicks'] / $totals['impressions']) * 100, 2)
                : 0;
            
            return response()->json([
                'success' => true,
                'metrics' => $metrics,
                'placements' => $placements,
                'totals' => $totals,
                'has_api_key' => $this->adsterraService->hasApiKey(),
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate,
                ],
            ]);
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Error fetching ad metrics: ' . $e->getMessage());
            
            // Return a user-friendly error response
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching metrics data. Please try again later.',
                'has_api_key' => $this->adsterraService->hasApiKey(),
            ], 500);
        }
    }

    /**
     * Create a new variant for an ad placement.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createVariant(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'placement_id' => 'required|exists:ad_placements,id',
                'name' => 'required|string|max:255',
                'ad_code' => 'required|string',
                'weight' => 'required|integer|min:1|max:100',
                'is_control' => 'boolean',
            ]);
    
            // If this is a control variant, update any existing control variants for this placement
            if ($request->input('is_control', false)) {
                AdVariant::where('placement_id', $request->input('placement_id'))
                    ->where('is_control', true)
                    ->update(['is_control' => false]);
            }
    
            // Create the new variant
            $variant = new AdVariant();
            $variant->placement_id = $request->input('placement_id');
            $variant->name = $request->input('name');
            $variant->ad_code = $request->input('ad_code');
            $variant->weight = $request->input('weight');
            $variant->is_control = $request->input('is_control', false);
            $variant->save();
    
            return response()->json([
                'success' => true,
                'message' => 'Variant created successfully',
                'variant' => $variant
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error creating ad variant: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the variant. Please try again.',
            ], 500);
        }
    }

    /**
     * Update an existing ad variant.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateVariant(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'string|max:255',
            'ad_code' => 'string',
            'weight' => 'integer|min:1|max:100',
            'is_control' => 'boolean',
        ]);

        $variant = AdVariant::findOrFail($id);

        // If this is being set as a control variant, update any existing control variants
        if ($request->has('is_control') && $request->input('is_control') && !$variant->is_control) {
            AdVariant::where('placement_id', $variant->placement_id)
                ->where('is_control', true)
                ->update(['is_control' => false]);
        }

        // Update the variant
        if ($request->has('name')) {
            $variant->name = $request->input('name');
        }
        
        if ($request->has('ad_code')) {
            $variant->ad_code = $request->input('ad_code');
        }
        
        if ($request->has('weight')) {
            $variant->weight = $request->input('weight');
        }
        
        if ($request->has('is_control')) {
            $variant->is_control = $request->input('is_control');
        }
        
        $variant->save();

        return response()->json([
            'success' => true,
            'message' => 'Variant updated successfully',
            'variant' => $variant
        ]);
    }

    /**
     * Delete an ad variant.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function deleteVariant(Request $request, $id): JsonResponse
    {
        $variant = AdVariant::findOrFail($id);
        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Variant deleted successfully'
        ]);
    }

    /**
     * Handle campaign scheduling.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function schedule(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'placement_id' => 'required|exists:ad_placements,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'recurring_schedule' => 'nullable|array',
                'recurring_schedule.*' => 'string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
                'time_of_day_targeting' => 'nullable|array',
                'time_of_day_targeting.*' => 'integer|min:0|max:23',
            ]);
    
            $placement = AdPlacement::findOrFail($request->input('placement_id'));
            
            // Update scheduling information
            $placement->start_date = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : null;
            $placement->end_date = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : null;
            $placement->recurring_schedule = $request->input('recurring_schedule');
            $placement->time_of_day_targeting = $request->input('time_of_day_targeting');
            $placement->save();
    
            // Calculate next activation time for display
            $nextActivation = $placement->getNextActivationTime();
            
            return response()->json([
                'success' => true,
                'message' => 'Campaign schedule updated successfully',
                'placement' => $placement,
                'next_activation' => $nextActivation ? $nextActivation->format('Y-m-d H:i:s') : null,
                'is_currently_active' => $placement->isScheduleActive(),
                'schedule_summary' => $this->generateScheduleSummary($placement),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating ad schedule: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the schedule. Please try again.',
            ], 500);
        }
    }
    
    /**
     * Generate a human-readable summary of the schedule.
     *
     * @param AdPlacement $placement
     * @return string
     */
    private function generateScheduleSummary(AdPlacement $placement): string
    {
        $summary = [];
        
        // Date range
        if ($placement->start_date && $placement->end_date) {
            $summary[] = 'From ' . $placement->start_date->format('M j, Y') . ' to ' . $placement->end_date->format('M j, Y');
        } elseif ($placement->start_date) {
            $summary[] = 'Starting ' . $placement->start_date->format('M j, Y');
        } elseif ($placement->end_date) {
            $summary[] = 'Until ' . $placement->end_date->format('M j, Y');
        }
        
        // Days of week
        if ($placement->recurring_schedule && count($placement->recurring_schedule) > 0) {
            if (count($placement->recurring_schedule) == 7) {
                $summary[] = 'Every day';
            } elseif (count($placement->recurring_schedule) == 5 &&
                      in_array('monday', $placement->recurring_schedule) &&
                      in_array('tuesday', $placement->recurring_schedule) &&
                      in_array('wednesday', $placement->recurring_schedule) &&
                      in_array('thursday', $placement->recurring_schedule) &&
                      in_array('friday', $placement->recurring_schedule)) {
                $summary[] = 'Weekdays only';
            } elseif (count($placement->recurring_schedule) == 2 &&
                      in_array('saturday', $placement->recurring_schedule) &&
                      in_array('sunday', $placement->recurring_schedule)) {
                $summary[] = 'Weekends only';
            } else {
                $days = array_map(function($day) {
                    return ucfirst($day);
                }, $placement->recurring_schedule);
                $summary[] = implode(', ', $days);
            }
        }
        
        // Hours
        if ($placement->time_of_day_targeting && count($placement->time_of_day_targeting) > 0) {
            if (count($placement->time_of_day_targeting) == 24) {
                $summary[] = 'All hours';
            } elseif (count($placement->time_of_day_targeting) > 0) {
                if (count($placement->time_of_day_targeting) <= 6) {
                    $hours = array_map(function($hour) {
                        return $hour . ':00';
                    }, $placement->time_of_day_targeting);
                    $summary[] = 'Hours: ' . implode(', ', $hours);
                } else {
                    $summary[] = count($placement->time_of_day_targeting) . ' hours per day';
                }
            }
        }
        
        return implode(' • ', $summary);
    }

    /**
     * Get schedule for a specific placement.
     *
     * @param int $placement
     * @return JsonResponse
     */
    public function getSchedule($placement): JsonResponse
    {
        $placement = AdPlacement::findOrFail($placement);
        
        return response()->json([
            'success' => true,
            'placement' => [
                'id' => $placement->id,
                'name' => $placement->name,
                'start_date' => $placement->start_date,
                'end_date' => $placement->end_date,
                'recurring_schedule' => $placement->recurring_schedule,
                'time_of_day_targeting' => $placement->time_of_day_targeting,
                'is_active' => $placement->is_active,
                'is_schedule_active' => $placement->isScheduleActive(),
                'next_activation' => $placement->getNextActivationTime() ? 
                    $placement->getNextActivationTime()->format('Y-m-d H:i:s') : null,
            ]
        ]);
    }

    /**
     * Get schedules for multiple placements.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getSchedules(Request $request): JsonResponse
    {
        $request->validate([
            'placement_ids' => 'nullable|array',
            'placement_ids.*' => 'integer|exists:ad_placements,id',
        ]);

        $placementIds = $request->input('placement_ids', []);
        
        $query = AdPlacement::query();
        
        if (!empty($placementIds)) {
            $query->whereIn('id', $placementIds);
        }
        
        $placements = $query->get();
        
        $schedules = $placements->map(function ($placement) {
            return [
                'id' => $placement->id,
                'name' => $placement->name,
                'start_date' => $placement->start_date,
                'end_date' => $placement->end_date,
                'recurring_schedule' => $placement->recurring_schedule,
                'time_of_day_targeting' => $placement->time_of_day_targeting,
                'is_active' => $placement->is_active,
                'is_schedule_active' => $placement->isScheduleActive(),
                'next_activation' => $placement->getNextActivationTime() ? 
                    $placement->getNextActivationTime()->format('Y-m-d H:i:s') : null,
            ];
        });
        
        return response()->json([
            'success' => true,
            'schedules' => $schedules
        ]);
    }
}