<?php

namespace PheonixPanel\Http\Controllers\Api\Application\Servers;

use PheonixPanel\Models\Server;
use PheonixPanel\Services\Servers\BuildModificationService;
use PheonixPanel\Services\Servers\DetailsModificationService;
use PheonixPanel\Transformers\Api\Application\ServerTransformer;
use PheonixPanel\Http\Controllers\Api\Application\ApplicationApiController;
use PheonixPanel\Http\Requests\Api\Application\Servers\UpdateServerDetailsRequest;
use PheonixPanel\Http\Requests\Api\Application\Servers\UpdateServerBuildConfigurationRequest;

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
     * @throws \PheonixPanel\Exceptions\DisplayException
     * @throws \PheonixPanel\Exceptions\Model\DataValidationException
     * @throws \PheonixPanel\Exceptions\Repository\RecordNotFoundException
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
     * @throws \PheonixPanel\Exceptions\DisplayException
     * @throws \PheonixPanel\Exceptions\Model\DataValidationException
     * @throws \PheonixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function build(UpdateServerBuildConfigurationRequest $request, Server $server): array
    {
        $server = $this->buildModificationService->handle($server, $request->validated());

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }
}
