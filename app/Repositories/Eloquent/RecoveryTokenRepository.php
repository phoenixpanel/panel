<?php

namespace Phoenixpanel\Repositories\Eloquent;

use Phoenixpanel\Models\RecoveryToken;

class RecoveryTokenRepository extends EloquentRepository
{
    public function model(): string
    {
        return RecoveryToken::class;
    }
}
