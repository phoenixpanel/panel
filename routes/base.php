<?php

use Illuminate\Support\Facades\Route;
use PhoenixPanel\Http\Controllers\Base;
use PhoenixPanel\Http\Middleware\RequireTwoFactorAuthentication;

Route::get('/', [Base\IndexController::class, 'index'])->name('index')->fallback();
Route::get('/account', [Base\IndexController::class, 'index'])
    ->withoutMiddleware(RequireTwoFactorAuthentication::class)
    ->name('account');

Route::get('/locales/locale.json', Base\LocaleController::class)
    ->withoutMiddleware(['auth', RequireTwoFactorAuthentication::class])
    ->where('namespace', '.*');

// Route for ad refresh
Route::get('/refresh-ad', [\PhoenixPanel\Http\Controllers\Base\AdRefreshController::class, 'refresh']);

Route::get('/{react}', [Base\IndexController::class, 'index'])
    ->where('react', '^(?!(\/)?(api|auth|admin|daemon)).+');


