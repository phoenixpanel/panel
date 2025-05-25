<?php

namespace PhoenixPanel\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ProtectCordApiService
{
    private $apiKey;
    private $baseUrl = 'https://api.protectcord.com';
    private $cacheTime = 60; // Cache for 60 minutes
    
    public function __construct()
    {
        $this->apiKey = config('phoenixpanel.protectcord.api_key');
    }
    
    /**
     * Check IP address for VPN/Proxy detection
     *
     * @param string $ipAddress
     * @return array|null
     */
    public function checkIp($ipAddress)
    {
        if (empty($this->apiKey) || empty($ipAddress)) {
            Log::warning('ProtectCord API: Missing API key or IP address', [
                'has_api_key' => !empty($this->apiKey),
                'ip_address' => $ipAddress
            ]);
            return null;
        }
        
        // Validate IP address format
        if (!filter_var($ipAddress, FILTER_VALIDATE_IP)) {
            Log::warning('ProtectCord API: Invalid IP address format', ['ip_address' => $ipAddress]);
            return null;
        }
        
        // Generate a unique cache key based on IP address
        $cacheKey = "protectcord_ip_check_{$ipAddress}";
        
        // Return cached data if available
        if (Cache::has($cacheKey)) {
            Log::debug('ProtectCord API: Returning cached result for IP', ['ip_address' => $ipAddress]);
            return Cache::get($cacheKey);
        }
        
        try {
            $url = "{$this->baseUrl}/checkip/{$ipAddress}";
            
            Log::debug('ProtectCord API: Making request', [
                'url' => $url,
                'ip_address' => $ipAddress
            ]);
            
            $response = Http::timeout(30)->get($url, [
                'key' => $this->apiKey
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('ProtectCord API: Successful response', [
                    'ip_address' => $ipAddress,
                    'is_vpn' => $data['is_vpn'] ?? false,
                    'is_proxy' => $data['is_proxy'] ?? false,
                    'is_tor' => $data['is_tor'] ?? false,
                    'is_datacenter' => $data['is_datacenter'] ?? false
                ]);
                
                // Cache the results
                Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
                return $data;
            }
            
            Log::error('ProtectCord API: Request failed', [
                'ip_address' => $ipAddress,
                'status_code' => $response->status(),
                'response_body' => $response->body()
            ]);
            
            return null;
        } catch (\Exception $e) {
            Log::error('ProtectCord API: Exception occurred', [
                'ip_address' => $ipAddress,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return null;
        }
    }
    
    /**
     * Check if IP address is a VPN or Proxy
     *
     * @param string $ipAddress
     * @return bool
     */
    public function isVpnOrProxy($ipAddress)
    {
        $result = $this->checkIp($ipAddress);
        
        if ($result === null) {
            // If we can't check the IP, assume it's safe (fail open)
            Log::warning('ProtectCord API: Unable to check IP, assuming safe', ['ip_address' => $ipAddress]);
            return false;
        }
        
        $isVpn = $result['is_vpn'] ?? false;
        $isProxy = $result['is_proxy'] ?? false;
        
        Log::debug('ProtectCord API: VPN/Proxy check result', [
            'ip_address' => $ipAddress,
            'is_vpn' => $isVpn,
            'is_proxy' => $isProxy,
            'result' => $isVpn || $isProxy
        ]);
        
        return $isVpn || $isProxy;
    }
    
    /**
     * Check if IP address is from Tor network
     *
     * @param string $ipAddress
     * @return bool
     */
    public function isTor($ipAddress)
    {
        $result = $this->checkIp($ipAddress);
        
        if ($result === null) {
            return false;
        }
        
        return $result['is_tor'] ?? false;
    }
    
    /**
     * Check if IP address is from a datacenter
     *
     * @param string $ipAddress
     * @return bool
     */
    public function isDatacenter($ipAddress)
    {
        $result = $this->checkIp($ipAddress);
        
        if ($result === null) {
            return false;
        }
        
        return $result['is_datacenter'] ?? false;
    }
    
    /**
     * Get comprehensive threat analysis for an IP
     *
     * @param string $ipAddress
     * @return array
     */
    public function getThreatAnalysis($ipAddress)
    {
        $result = $this->checkIp($ipAddress);
        
        if ($result === null) {
            return [
                'ip' => $ipAddress,
                'is_threat' => false,
                'threat_types' => [],
                'confidence' => 0,
                'error' => 'Unable to analyze IP address'
            ];
        }
        
        $threatTypes = [];
        $isThreat = false;
        
        if ($result['is_vpn'] ?? false) {
            $threatTypes[] = 'VPN';
            $isThreat = true;
        }
        
        if ($result['is_proxy'] ?? false) {
            $threatTypes[] = 'Proxy';
            $isThreat = true;
        }
        
        if ($result['is_tor'] ?? false) {
            $threatTypes[] = 'Tor';
            $isThreat = true;
        }
        
        if ($result['is_datacenter'] ?? false) {
            $threatTypes[] = 'Datacenter';
            $isThreat = true;
        }
        
        return [
            'ip' => $ipAddress,
            'is_threat' => $isThreat,
            'threat_types' => $threatTypes,
            'confidence' => count($threatTypes) > 0 ? 85 : 0,
            'raw_data' => $result
        ];
    }
}