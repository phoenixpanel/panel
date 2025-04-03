<?php

namespace PhoenixPanel\Http\Resources\Wings;

use PhoenixPanel\Models\Server;
use Illuminate\Container\Container;
use Illuminate\Http\Resources\Json\ResourceCollection;
use PhoenixPanel\Services\Eggs\EggConfigurationService;
use PhoenixPanel\Services\Servers\ServerConfigurationStructureService;

class ServerConfigurationCollection extends ResourceCollection
{
    /**
     * Converts a collection of Server models into an array of configuration responses
     * that can be understood by Wings. Make sure you've properly loaded the required
     * relationships on the Server models before calling this function, otherwise you'll
     * have some serious performance issues from all the N+1 queries.
     */
    public function toArray($request): array
    {
        $egg = Container::getInstance()->make(EggConfigurationService::class);
        $configuration = Container::getInstance()->make(ServerConfigurationStructureService::class);

        return $this->collection->map(function (Server $server) use ($configuration, $egg) {
            return [
                'uuid' => $server->uuid,
                'settings' => $configuration->handle($server),
                'process_configuration' => $egg->handle($server),
            ];
        })->toArray();
    }
}
