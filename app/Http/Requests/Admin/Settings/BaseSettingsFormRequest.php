<?php

namespace PhoenixPanel\Http\Requests\Admin\Settings;

use Illuminate\Validation\Rule;
use PhoenixPanel\Traits\Helpers\AvailableLanguages;
use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class BaseSettingsFormRequest extends AdminFormRequest
{
    use AvailableLanguages;

    public function rules(): array
    {
        return [
            'app:name' => 'required|string|max:191',
            'phoenixpanel:auth:2fa_required' => 'required|integer|in:0,1,2',
            'app:locale' => ['required', 'string', Rule::in(array_keys($this->getAvailableLanguages()))],
            'phoenixpanel:registration_enabled' => 'sometimes|boolean',
        ];
    }

    public function attributes(): array
    {
        return [
            'app:name' => 'Company Name',
            'phoenixpanel:auth:2fa_required' => 'Require 2-Factor Authentication',
            'app:locale' => 'Default Language',
            'phoenixpanel:registration_enabled' => 'Registration System Enabled',
        ];
    }

    public function normalize(?array $only = null): array
    {
        $data = parent::normalize($only);

        $data['phoenixpanel:registration_enabled'] = $this->has('phoenixpanel:registration_enabled') ? 1 : 0;

        return $data;
    }
}
