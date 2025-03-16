<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Startup;

use Phoenixpanel\Models\Permission;
use Phoenixpanel\Http\Requests\Api\Client\ClientApiRequest;

class UpdateStartupVariableRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_STARTUP_UPDATE;
    }

    /**
     * The actual validation of the variable's value will happen inside the controller.
     */
    public function rules(): array
    {
        return [
            'key' => 'required|string',
            'value' => 'present',
        ];
    }
}
