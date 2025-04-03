<?php

namespace PheonixPanel\Http\Requests\Api\Client\Servers\Settings;

use Webmozart\Assert\Assert;
use PheonixPanel\Models\Server;
use Illuminate\Validation\Rule;
use PheonixPanel\Models\Permission;
use PheonixPanel\Contracts\Http\ClientPermissionsRequest;
use PheonixPanel\Http\Requests\Api\Client\ClientApiRequest;

class SetDockerImageRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_STARTUP_DOCKER_IMAGE;
    }

    public function rules(): array
    {
        /** @var \PheonixPanel\Models\Server $server */
        $server = $this->route()->parameter('server');

        Assert::isInstanceOf($server, Server::class);

        return [
            'docker_image' => ['required', 'string', 'max:191', 'regex:/^[\w#\.\/\- ]*\|*[\w\.\/\-:@ ]*$/', Rule::in(array_values($server->egg->docker_images))],
        ];
    }
}
