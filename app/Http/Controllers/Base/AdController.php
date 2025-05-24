<?php

namespace PhoenixPanel\Http\Controllers\Base;

use Illuminate\Http\Request;
use PhoenixPanel\Http\Controllers\Controller;

class AdController extends Controller
{
    public function getAd(Request $request)
    {
        // Ensure this is an AJAX request
        if (!$request->ajax()) {
            abort(403, 'Direct access forbidden');
        }

        // Return only the ad content without the container and script
        return view('partials.ad-content');
    }
}