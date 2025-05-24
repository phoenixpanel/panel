<?php

namespace PhoenixPanel\Http\Controllers\Base;

use Illuminate\Http\Request;
use PhoenixPanel\Http\Controllers\Controller;

class AdRefreshController extends Controller
{
    public function refresh()
    {
        return view('partials.ad-content');
    }
}