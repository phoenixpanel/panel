<?php

namespace PhoenixPanel\Http\Controllers\Api\Application\Servers;

use PhoenixPanel\Models\User;
use PhoenixPanel\Models\Server;
use PhoenixPanel\Services\Servers\StartupModificationService;
use PhoenixPanel\Transformers\Api\Application\ServerTransformer;
use PhoenixPanel\Http\Controllers\Api\Application\ApplicationApiController;
use PhoenixPanel\Http\Requests\Api\Application\Servers\UpdateServerStartupRequest;

class StartupController extends ApplicationApiController
{
    /**
     * StartupController constructor.
     */
    public function __construct(private StartupModificationService $modificationService)
    {
        parent::__construct();
    }

    /**
     * Update the startup and environment settings for a specific server.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @throws \PhoenixPanel\Exceptions\Http\Connection\DaemonConnectionException
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function index(UpdateServerStartupRequest $request, Server $server): array
    {
        $server = $this->modificationService
            ->setUserLevel(User::USER_LEVEL_ADMIN)
            ->handle($server, $request->validated());

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }
}


