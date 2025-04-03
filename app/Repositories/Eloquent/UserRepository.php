<?php

namespace PheonixPanel\Repositories\Eloquent;

use PheonixPanel\Models\User;
use PheonixPanel\Contracts\Repository\UserRepositoryInterface;

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
