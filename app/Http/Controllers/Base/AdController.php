<?php

namespace PhoenixPanel\Http\Controllers\Base;

use Illuminate\Http\Request;
use PhoenixPanel\Http\Controllers\Controller;

class AdController extends Controller
{
    public function getAd(Request $request)
    {
        // Check for AJAX request using header
        if ($request->header('X-Requested-With') !== 'XMLHttpRequest') {
            abort(403, 'Direct access forbidden');
        }

        // Return only the ad content without the container and script
        return view('partials.ad-content');
    }
}