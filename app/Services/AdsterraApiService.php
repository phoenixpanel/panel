<?php

namespace PhoenixPanel\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AdsterraApiService
{
    private $apiUrl = 'https://api.adsterratools.com/publisher/stats';
    private $cacheTime = 60; // Cache for 60 minutes (1 hour)
    
    public function getMetrics($apiKey, $startDate = null, $endDate = null)
    {
        if (empty($apiKey)) {
            return null;
        }
        
        // Default to last 7 days if no dates provided
        if (!$startDate) {
            $startDate = now()->subDays(7)->format('Y-m-d');
        }
        if (!$endDate) {
            $endDate = now()->format('Y-m-d');
        }
        
        // Generate a unique cache key based on parameters
        $cacheKey = "adsterra_metrics_{$apiKey}_{$startDate}_{$endDate}";
        
        // Return cached data if available
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        // For demonstration and testing, use mock data
        // In a production environment, you would use the real API
        $data = $this->getMockData($startDate, $endDate);
        Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
        return $data;
        
        /* Uncomment for real API connection
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get($this->apiUrl, [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                // Cache the results for one hour
                Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
                return $data;
            }
            
            Log::error('Adsterra API error: ' . $response->status());
            return false;
        } catch (\Exception $e) {
            Log::error('Adsterra API exception: ' . $e->getMessage());
            return false;
        }
        */
    }
    
    /**
     * Generate mock metrics data for testing/demo
     */
    private function getMockData($startDate, $endDate)
    {
        $startDateTime = strtotime($startDate);
        $endDateTime = strtotime($endDate);
        $days = [];
        $currentDate = $startDateTime;
        
        // Generate data for each day in the range
        while ($currentDate <= $endDateTime) {
            $dateStr = date('Y-m-d', $currentDate);
            $baseImpressions = rand(5000, 15000);
            $baseClicks = rand(50, 500);
            $baseCtr = round(($baseClicks / $baseImpressions) * 100, 2);
            $baseRevenue = round($baseClicks * (rand(5, 20) / 100), 2);
            
            $days[] = [
                'date' => $dateStr,
                'impression' => $baseImpressions,
                'clicks' => $baseClicks,
                'ctr' => $baseCtr,
                'revenue' => $baseRevenue
            ];
            
            // Move to next day
            $currentDate = strtotime('+1 day', $currentDate);
        }
        
        return [
            'status' => 'success',
            'dbDateTime' => now()->format('Y-m-d H:i:s'),
            'items' => $days
        ];
    }
}