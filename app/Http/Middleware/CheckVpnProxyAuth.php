<?php

namespace PhoenixPanel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhoenixPanel\Services\ProtectCordApiService;
use PhoenixPanel\Exceptions\DisplayException;

class CheckVpnProxyAuth
{
    /**
     * The ProtectCord API service instance.
     */
    private ProtectCordApiService $protectCordService;

    /**
     * Create a new middleware instance.
     */
    public function __construct(ProtectCordApiService $protectCordService)
    {
        $this->protectCordService = $protectCordService;
    }

    /**
     * Handle an incoming request for authentication routes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     * @throws \PhoenixPanel\Exceptions\DisplayException
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if ProtectCord protection is enabled
        if (!config('phoenixpanel.protectcord.enabled', false)) {
            return $next($request);
        }

        // Check if API key is configured
        if (empty(config('phoenixpanel.protectcord.api_key'))) {
            Log::warning('CheckVpnProxyAuth: ProtectCord API key not configured, allowing authentication request', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]);
            return $next($request);
        }

        $ipAddress = $request->ip();

        // Skip check for local/private IP addresses
        if ($this->isLocalOrPrivateIp($ipAddress)) {
            Log::debug('CheckVpnProxyAuth: Skipping check for local/private IP', [
                'ip' => $ipAddress
            ]);
            return $next($request);
        }

        try {
            // Check if the IP is a VPN or Proxy
            $isVpnOrProxy = $this->protectCordService->isVpnOrProxy($ipAddress);

            if ($isVpnOrProxy) {
                // Log the blocked authentication attempt
                Log::warning('CheckVpnProxyAuth: Blocked VPN/Proxy authentication attempt', [
                    'ip' => $ipAddress,
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'referer' => $request->header('referer'),
                    'route' => $request->route()->getName()
                ]);

                // Return JSON error response directly to prevent controller execution
                return response()->json([
                    'errors' => [
                        'user' => [trans('auth.vpn_proxy_blocked')]
                    ]
                ], 422);
            }

            Log::debug('CheckVpnProxyAuth: IP check passed for authentication', [
                'ip' => $ipAddress,
                'route' => $request->route()->getName()
            ]);

        } catch (DisplayException $e) {
            // Re-throw DisplayException (our VPN/proxy error)
            throw $e;
        } catch (\Exception $e) {
            // Log the error but fail open (allow access) if service is unavailable
            Log::error('CheckVpnProxyAuth: Error checking IP during authentication, allowing request', [
                'ip' => $ipAddress,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'route' => $request->route()->getName()
            ]);
        }

        return $next($request);
    }

    /**
     * Check if an IP address is local or private.
     *
     * @param string $ip
     * @return bool
     */
    private function isLocalOrPrivateIp(string $ip): bool
    {
        // Check for IPv4 private ranges
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return !filter_var(
                $ip,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
            );
        }

        // Check for IPv6 private ranges
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return !filter_var(
                $ip,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_IPV6 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
            );
        }

        return false;
    }
}