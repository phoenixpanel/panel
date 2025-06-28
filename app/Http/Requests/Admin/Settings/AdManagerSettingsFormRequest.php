<?php

namespace PhoenixPanel\Http\Requests\Admin\Settings;

use Illuminate\Validation\Rule;
use PhoenixPanel\Traits\Helpers\AvailableLanguages;
use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class AdManagerSettingsFormRequest extends AdminFormRequest
{
    use AvailableLanguages;

    public function rules(): array
    {
        return [
            'phoenixpanel:ads:enabled' => 'sometimes|boolean',
            'phoenixpanel:ads:code' => 'required_if:phoenixpanel:ads:enabled,1|string|max:10000|nullable',
            'phoenixpanel:ads:api_key' => 'string|max:10000|nullable'
        ];
    }

    public function attributes(): array
    {
        return [
            'phoenixpanel:ads:enabled' => 'Adterra Functionality',
            'phoenixpanel:ads:code' => 'Adterra Code',
            'phoenixpanel:ads:api_key' => 'Adterra API Key'
        ];
    }

    public function normalize(?array $only = null): array
    {
        $data = parent::normalize($only);

        
        $data['phoenixpanel:ads:enabled'] = $this->input('phoenixpanel:ads:enabled') === '1' ? 1 : 0;
        $data['phoenixpanel:ads:code'] = $this->input('phoenixpanel:ads:code', '');
        $data['phoenixpanel:ads:api_key'] = $this->input('phoenixpanel:ads:api_key', '');

        return $data;
    }
}
