<?php

namespace PhoenixPanel\Repositories\Eloquent;

use PhoenixPanel\Models\RecoveryToken;

class RecoveryTokenRepository extends EloquentRepository
{
    public function model(): string
    {
        return RecoveryToken::class;
    }
}
