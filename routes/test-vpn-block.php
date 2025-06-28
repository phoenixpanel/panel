<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;

/*
|--------------------------------------------------------------------------
| VPN/Proxy Block Testing Routes
|--------------------------------------------------------------------------
|
| These routes are for testing the VPN/proxy blocking error pages.
| Remove or comment out these routes in production.
|
*/

// Test route to simulate VPN/proxy blocking
Route::get('/test/vpn-block', function () {
    return response()->view('errors.vpn-proxy-blocked', [
        'ipAddress' => request()->ip(),
        'threatTypes' => ['VPN', 'Proxy'],
        'requestId' => \Illuminate\Support\Str::uuid()->toString(),
        'timestamp' => now(),
        'userAgent' => request()->userAgent(),
    ], Response::HTTP_FORBIDDEN);
})->name('test.vpn-block');

// Test route to simulate 403 error
Route::get('/test/403', function () {
    return response()->view('errors.403', [], Response::HTTP_FORBIDDEN);
})->name('test.403');

// Test route to simulate 404 error
Route::get('/test/404', function () {
    return response()->view('errors.404', [], Response::HTTP_NOT_FOUND);
})->name('test.404');

// Test route to simulate 500 error
Route::get('/test/500', function () {
    return response()->view('errors.500', [], Response::HTTP_INTERNAL_SERVER_ERROR);
})->name('test.500');