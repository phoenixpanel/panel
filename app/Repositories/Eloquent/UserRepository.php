<?php

namespace Phoenixpanel\Repositories\Eloquent;

use Phoenixpanel\Models\User;
use Phoenixpanel\Contracts\Repository\UserRepositoryInterface;

class UserRepository extends EloquentRepository implements UserRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return User::class;
    }
}
