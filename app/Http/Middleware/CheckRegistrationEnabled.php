<?php
namespace PhoenixPanel\Http\Middleware;

use Illuminate\Support\Facades\Log;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRegistrationEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Temporary debug code to verify configuration access
        Log::info('Registration config check', [
            'dot_notation_value' => config('phoenixpanel.registration_enabled', 0),
            'config_type' => gettype(config('phoenixpanel.registration_enabled', 0))
        ]);
        
        if (config('phoenixpanel.registration_enabled', 0) == 0) {
            // Log the attempt to access registration routes
            Log::warning('Access attempt to registration route when registration is disabled.', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
            ]);

            // Registration is disabled, redirect to login or abort
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Registration is currently disabled.'], 403);
            }

            return redirect()->route('auth.login')->with('error', 'Registration is currently disabled.');
        }

        return $next($request);
    }
}