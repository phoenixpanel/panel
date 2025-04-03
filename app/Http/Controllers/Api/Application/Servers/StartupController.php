<?php

namespace PheonixPanel\Http\Controllers\Api\Application\Servers;

use PheonixPanel\Models\User;
use PheonixPanel\Models\Server;
use PheonixPanel\Services\Servers\StartupModificationService;
use PheonixPanel\Transformers\Api\Application\ServerTransformer;
use PheonixPanel\Http\Controllers\Api\Application\ApplicationApiController;
use PheonixPanel\Http\Requests\Api\Application\Servers\UpdateServerStartupRequest;

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
     * @throws \PheonixPanel\Exceptions\Http\Connection\DaemonConnectionException
     * @throws \PheonixPanel\Exceptions\Model\DataValidationException
     * @throws \PheonixPanel\Exceptions\Repository\RecordNotFoundException
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
