<?php

namespace PhoenixPanel\Transformers\Api\Application;

use League\Fractal\Resource\Item;
use PhoenixPanel\Models\EggVariable;
use League\Fractal\Resource\NullResource;
use PhoenixPanel\Services\Acl\Api\AdminAcl;

class ServerVariableTransformer extends BaseTransformer
{
    /**
     * List of resources that can be included.
     */
    protected array $availableIncludes = ['parent'];

    /**
     * Return the resource name for the JSONAPI output.
     */
    public function getResourceName(): string
    {
        return ServerVariable::RESOURCE_NAME;
    }

    /**
     * Return a generic transformed server variable array.
     */
    public function transform(EggVariable $variable): array
    {
        return $variable->toArray();
    }

    /**
     * Return the parent service variable data.
     *
     * @throws \PhoenixPanel\Exceptions\Transformer\InvalidTransformerLevelException
     */
    public function includeParent(EggVariable $variable): Item|NullResource
    {
        if (!$this->authorize(AdminAcl::RESOURCE_EGGS)) {
            return $this->null();
        }

        $variable->loadMissing('variable');

        return $this->item($variable->getRelation('variable'), $this->makeTransformer(EggVariableTransformer::class), 'variable');
    }
}
