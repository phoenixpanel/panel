<?php

namespace PhoenixPanel\Http\Requests\Api\Application\Users;

use PhoenixPanel\Models\User;

class UpdateUserRequest extends StoreUserRequest
{
    /**
     * Return the validation rules for this request.
     */
    public function rules(array $rules = null): array
    {
        $userId = $this->parameter('user', User::class)->id;

        return parent::rules(User::getRulesForUpdate($userId));
    }
}


