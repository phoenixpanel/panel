<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Files;

use PheonixPanel\Models\Permission;
use PheonixPanel\Http\Requests\Api\Client\ClientApiRequest;

class UploadFileRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_FILE_CREATE;
    }
}
