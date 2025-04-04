<?php

namespace PhoenixPanel\Repositories\Eloquent;

use PhoenixPanel\Models\ServerVariable;
use PhoenixPanel\Contracts\Repository\ServerVariableRepositoryInterface;

class ServerVariableRepository extends EloquentRepository implements ServerVariableRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return ServerVariable::class;
    }
}


