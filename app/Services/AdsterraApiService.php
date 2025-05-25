<?php

namespace PhoenixPanel\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AdsterraApiService
{
    private $apiUrl = 'https://api3.adsterratools.com/publisher/stats.json';
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
        
        try {
            $response = Http::withHeaders([
                'X-API-Key' => $apiKey,
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
    }
}