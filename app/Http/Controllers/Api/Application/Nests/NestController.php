<?php

namespace Phoenixpanel\Http\Controllers\Api\Application\Nests;

use Phoenixpanel\Models\Nest;
use Phoenixpanel\Contracts\Repository\NestRepositoryInterface;
use Phoenixpanel\Transformers\Api\Application\NestTransformer;
use Phoenixpanel\Http\Requests\Api\Application\Nests\GetNestsRequest;
use Phoenixpanel\Http\Controllers\Api\Application\ApplicationApiController;

class NestController extends ApplicationApiController
{
    /**
     * NestController constructor.
     */
    public function __construct(private NestRepositoryInterface $repository)
    {
        parent::__construct();
    }

    /**
     * Return all Nests that exist on the Panel.
     */
    public function index(GetNestsRequest $request): array
    {
        $nests = $this->repository->paginated($request->query('per_page') ?? 50);

        return $this->fractal->collection($nests)
            ->transformWith($this->getTransformer(NestTransformer::class))
            ->toArray();
    }

    /**
     * Return information about a single Nest model.
     */
    public function view(GetNestsRequest $request, Nest $nest): array
    {
        return $this->fractal->item($nest)
            ->transformWith($this->getTransformer(NestTransformer::class))
            ->toArray();
    }
}
