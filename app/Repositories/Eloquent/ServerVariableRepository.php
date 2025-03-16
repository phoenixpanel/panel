<?php

namespace Phoenixpanel\Repositories\Eloquent;

use Phoenixpanel\Models\ServerVariable;
use Phoenixpanel\Contracts\Repository\ServerVariableRepositoryInterface;

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
