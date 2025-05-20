<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Logs;

use PhoenixPanel\Models\Server;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;

class ExportLogsRequest extends ClientApiRequest
{
    /**
     * Rules to validate this request against.
     */
    public function rules(): array
    {
        // No validation rules needed for raw content
        return [];
    }

    /**
     * Determine if the user has permission to view logs for this server.
     */
    public function authorize(): bool
    {
        return $this->user()->can('view-logs', $this->parameter('server', Server::class));
    }
}