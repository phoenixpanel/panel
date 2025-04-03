<?php

namespace PheonixPanel\Repositories\Eloquent;

use PheonixPanel\Models\ServerVariable;
use PheonixPanel\Contracts\Repository\ServerVariableRepositoryInterface;

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
