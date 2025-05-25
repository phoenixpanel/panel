<?php

namespace PhoenixPanel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PhoenixPanel\Services\ProtectCordApiService;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BlockVpnProxy
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
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if ProtectCord protection is enabled
        if (!config('phoenixpanel.protectcord.enabled', false)) {
            return $next($request);
        }

        // Check if API key is configured
        if (empty(config('phoenixpanel.protectcord.api_key'))) {
            Log::warning('BlockVpnProxy: ProtectCord API key not configured, allowing request', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]);
            return $next($request);
        }

        $ipAddress = $request->ip();

        // Skip check for local/private IP addresses
        if ($this->isLocalOrPrivateIp($ipAddress)) {
            Log::debug('BlockVpnProxy: Skipping check for local/private IP', [
                'ip' => $ipAddress
            ]);
            return $next($request);
        }

        try {
            // Check if the IP is a VPN or Proxy
            $isVpnOrProxy = $this->protectCordService->isVpnOrProxy($ipAddress);

            if ($isVpnOrProxy) {
                // Log the blocked attempt
                Log::warning('BlockVpnProxy: Blocked VPN/Proxy access attempt', [
                    'ip' => $ipAddress,
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'referer' => $request->header('referer')
                ]);

                // Return 403 Forbidden response
                throw new HttpException(
                    Response::HTTP_FORBIDDEN,
                    'Access denied. VPN and proxy connections are not allowed.'
                );
            }

            Log::debug('BlockVpnProxy: IP check passed', [
                'ip' => $ipAddress
            ]);

        } catch (HttpException $e) {
            // Re-throw HTTP exceptions (like our 403)
            throw $e;
        } catch (\Exception $e) {
            // Log the error but fail open (allow access) if service is unavailable
            Log::error('BlockVpnProxy: Error checking IP, allowing request', [
                'ip' => $ipAddress,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
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