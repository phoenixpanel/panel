<?php

namespace Phoenixpanel\Http\Controllers\Api\Application\Users;

use Phoenixpanel\Models\User;
use Phoenixpanel\Transformers\Api\Application\UserTransformer;
use Phoenixpanel\Http\Controllers\Api\Application\ApplicationApiController;
use Phoenixpanel\Http\Requests\Api\Application\Users\GetExternalUserRequest;

class ExternalUserController extends ApplicationApiController
{
    /**
     * Retrieve a specific user from the database using their external ID.
     */
    public function index(GetExternalUserRequest $request, string $external_id): array
    {
        $user = User::query()->where('external_id', $external_id)->firstOrFail();

        return $this->fractal->item($user)
            ->transformWith($this->getTransformer(UserTransformer::class))
            ->toArray();
    }
}
