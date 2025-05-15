<?php

namespace PhoenixPanel\Transformers\Api\Client;

use PhoenixPanel\Models\Egg;

class EggTransformer extends BaseClientTransformer
{
    /**
     * Return the resource name for the JSONAPI output.
     */
    public function getResourceName(): string
    {
        return Egg::RESOURCE_NAME;
    }

    public function transform(Egg $egg): array
    {
        return [
            'uuid' => $egg->uuid,
            'name' => $egg->name,
            'image_data' => $egg->image_data,
        ];
    }
}


