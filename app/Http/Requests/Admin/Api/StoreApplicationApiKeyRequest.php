<?php

namespace Phoenixpanel\Http\Requests\Admin\Api;

use Phoenixpanel\Models\ApiKey;
use Phoenixpanel\Services\Acl\Api\AdminAcl;
use Phoenixpanel\Http\Requests\Admin\AdminFormRequest;

class StoreApplicationApiKeyRequest extends AdminFormRequest
{
    /**
     * @throws \ReflectionException
     * @throws \ReflectionException
     */
    public function rules(): array
    {
        $modelRules = ApiKey::getRules();

        return collect(AdminAcl::getResourceList())->mapWithKeys(function ($resource) use ($modelRules) {
            return [AdminAcl::COLUMN_IDENTIFIER . $resource => $modelRules['r_' . $resource]];
        })->merge(['memo' => $modelRules['memo']])->toArray();
    }

    public function attributes(): array
    {
        return [
            'memo' => 'Description',
        ];
    }

    public function getKeyPermissions(): array
    {
        return collect($this->validated())->filter(function ($value, $key) {
            return substr($key, 0, strlen(AdminAcl::COLUMN_IDENTIFIER)) === AdminAcl::COLUMN_IDENTIFIER;
        })->toArray();
    }
}
