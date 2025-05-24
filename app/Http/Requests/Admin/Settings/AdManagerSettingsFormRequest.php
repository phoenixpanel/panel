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
        ];
    }

    public function attributes(): array
    {
        return [
            'phoenixpanel:ads:enabled' => 'Adterra Functionality',
        ];
    }

    public function normalize(?array $only = null): array
    {
        $data = parent::normalize($only);

        $data['phoenixpanel:ads:enabled'] = $this->has('phoenixpanel:ads:enabled') ? 1 : 0;

        return $data;
    }
}
