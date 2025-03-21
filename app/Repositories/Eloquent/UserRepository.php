<?php

namespace PhoenixPanel\Repositories\Eloquent;

use PhoenixPanel\Models\User;
use PhoenixPanel\Contracts\Repository\UserRepositoryInterface;

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
