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
        
        // Comment out mock data for production use
        /*
        $data = $this->getMockData($startDate, $endDate);
        Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
        return $data;
        */
        
        // Real API connection
        try {
            Log::debug('Initiating Adsterra API request', [
                'api_url' => $this->apiUrl,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'api_key_length' => strlen($apiKey),  // Log length but not the actual key for security
            ]);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get($this->apiUrl, [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                Log::debug('Adsterra API response successful', [
                    'status' => $response->status(),
                    'data_structure' => array_keys($data ?? []),
                    'items_count' => isset($data['items']) ? count($data['items']) : 0
                ]);
                
                // Cache the results for one hour
                Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
                return $data;
            }
            
            Log::error('Adsterra API error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'headers' => $response->headers()
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Adsterra API exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
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