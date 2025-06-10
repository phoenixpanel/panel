<?php

namespace PhoenixPanel\Services;

use Illuminate\Support\Facades\Http;
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
            return null;
        }
        
        // Validate IP address format
        if (!filter_var($ipAddress, FILTER_VALIDATE_IP)) {
            return null;
        }
        
        // Generate a unique cache key based on IP address
        $cacheKey = "protectcord_ip_check_{$ipAddress}";
        
        // Return cached data if available
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            $url = "{$this->baseUrl}/checkip/{$ipAddress}";
            
            $response = Http::timeout(30)->get($url, [
                'key' => $this->apiKey
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                
                // Cache the results
                Cache::put($cacheKey, $data, now()->addMinutes($this->cacheTime));
                return $data;
            }
            
            return null;
        } catch (\Exception $e) {
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
            return false;
        }
        
        $isVpn = $result['is_vpn'] ?? false;
        $isProxy = $result['is_proxy'] ?? false;
        
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