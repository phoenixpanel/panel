<?php

namespace Phoenixpanel\Http\Controllers\Api\Application\Servers;

use Phoenixpanel\Models\Server;
use Phoenixpanel\Transformers\Api\Application\ServerTransformer;
use Phoenixpanel\Http\Controllers\Api\Application\ApplicationApiController;
use Phoenixpanel\Http\Requests\Api\Application\Servers\GetExternalServerRequest;

class ExternalServerController extends ApplicationApiController
{
    /**
     * Retrieve a specific server from the database using its external ID.
     */
    public function index(GetExternalServerRequest $request, string $external_id): array
    {
        $server = Server::query()->where('external_id', $external_id)->firstOrFail();

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }
}
