<?php

namespace PhoenixPanel\Http\Requests\Api\Client\Servers\Files;

use PhoenixPanel\Models\Permission;
use PhoenixPanel\Contracts\Http\ClientPermissionsRequest;
use PhoenixPanel\Http\Requests\Api\Client\ClientApiRequest;

class GetFileContentsRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    /**
     * Returns the permissions string indicating which permission should be used to
     * validate that the authenticated user has permission to perform this action aganist
     * the given resource (server).
     */
    public function permission(): string
    {
        return Permission::ACTION_FILE_READ_CONTENT;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|string',
        ];
    }
}


