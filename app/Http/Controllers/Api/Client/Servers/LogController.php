<?php

namespace PhoenixPanel\Http\Controllers\Api\Client\Servers;

use PhoenixPanel\Models\Server;
use PhoenixPanel\Http\Controllers\Api\Client\ClientApiController;
use PhoenixPanel\Http\Requests\Api\Client\Servers\GetServerRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LogController extends ClientApiController
{
    public function sendToHastebin(Request $request)
    {           
        $hastebinPost = Http::withHeaders(['Content-Type' => 'text/plain'])->send('POST', 'https://logs.protectcord.com/documents', [
            'body' => $request['logs']
        ])->json();
        return $hastebinPost; 
    }
}