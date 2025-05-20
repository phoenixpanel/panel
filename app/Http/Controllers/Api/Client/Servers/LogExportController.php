<?php

namespace PhoenixPanel\Http\Controllers\Api\Client\Servers;

use Illuminate\Http\Response;
use PhoenixPanel\Models\Server;
use Illuminate\Http\JsonResponse;
use PhoenixPanel\Facades\Activity;
use Illuminate\Support\Facades\Http;
use PhoenixPanel\Http\Controllers\Api\Client\ClientApiController;
use PhoenixPanel\Http\Requests\Api\Client\Servers\Logs\ExportLogsRequest;

class LogExportController extends ClientApiController
{
    /**
     * LogExportController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Exports the server logs to logs.phoenixpanel.io and returns the key.
     *
     * @throws \Exception
     */
    public function __invoke(ExportLogsRequest $request, Server $server): JsonResponse
    {
        // Get the raw logs content from the request
        $content = $request->getContent();

        try {
            // Send the logs to logs.phoenixpanel.io as raw data
            $response = Http::withBody($content, 'text/plain')
                ->post('https://logs.phoenixpanel.io/documents');
            
            // Check if the request was successful
            if (!$response->successful()) {
                return new JsonResponse([
                    'error' => 'Failed to export logs: ' . $response->status(),
                ], Response::HTTP_BAD_GATEWAY);
            }
            
            // Get the key from the response
            $key = $response->json('key');
            
            if (empty($key)) {
                return new JsonResponse([
                    'error' => 'Invalid response from logs service',
                ], Response::HTTP_BAD_GATEWAY);
            }
            
            // Log the activity
            Activity::event('server:console.export-logs')
                ->property('server', $server->name)
                ->log();
            
            // Return the key
            return new JsonResponse([
                'key' => $key,
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Failed to export logs: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}