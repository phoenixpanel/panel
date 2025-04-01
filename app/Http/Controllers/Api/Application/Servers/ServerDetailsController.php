<?php

namespace PhoenixPanel\Http\Controllers\Api\Application\Servers;

use PhoenixPanel\Models\Server;
use PhoenixPanel\Services\Servers\BuildModificationService;
use PhoenixPanel\Services\Servers\DetailsModificationService;
use PhoenixPanel\Transformers\Api\Application\ServerTransformer;
use PhoenixPanel\Http\Controllers\Api\Application\ApplicationApiController;
use PhoenixPanel\Http\Requests\Api\Application\Servers\UpdateServerDetailsRequest;
use PhoenixPanel\Http\Requests\Api\Application\Servers\UpdateServerBuildConfigurationRequest;

class ServerDetailsController extends ApplicationApiController
{
    /**
     * ServerDetailsController constructor.
     */
    public function __construct(
        private BuildModificationService $buildModificationService,
        private DetailsModificationService $detailsModificationService
    ) {
        parent::__construct();
    }

    /**
     * Update the details for a specific server.
     *
     * @throws \PhoenixPanel\Exceptions\DisplayException
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function details(UpdateServerDetailsRequest $request, Server $server): array
    {
        $updated = $this->detailsModificationService->returnUpdatedModel()->handle(
            $server,
            $request->validated()
        );

        return $this->fractal->item($updated)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }

    /**
     * Update the build details for a specific server.
     *
     * @throws \PhoenixPanel\Exceptions\DisplayException
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function build(UpdateServerBuildConfigurationRequest $request, Server $server): array
    {
        $server = $this->buildModificationService->handle($server, $request->validated());

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }
}
