<?php

namespace Phoenixpanel\Http\Requests\Api\Client\Servers\Files;

use Phoenixpanel\Models\Permission;
use Phoenixpanel\Contracts\Http\ClientPermissionsRequest;
use Phoenixpanel\Http\Requests\Api\Client\ClientApiRequest;

class CopyFileRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_FILE_CREATE;
    }

    public function rules(): array
    {
        return [
            'location' => 'required|string',
        ];
    }
}
