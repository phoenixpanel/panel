<?php

namespace PhoenixPanel\Http\Requests\Admin\Settings;

use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class AdvancedSettingsFormRequest extends AdminFormRequest
{
    /**
     * Return all the rules to apply to this request's data.
     */
    public function rules(): array
    {
        return [
            'recaptcha:enabled' => 'required|in:true,false',
            'recaptcha:secret_key' => 'required|string|max:191',
            'recaptcha:website_key' => 'required|string|max:191',
            'phoenixpanel:guzzle:timeout' => 'required|integer|between:1,60',
            'phoenixpanel:guzzle:connect_timeout' => 'required|integer|between:1,60',
            'phoenixpanel:client_features:allocations:enabled' => 'required|in:true,false',
            'phoenixpanel:client_features:allocations:range_start' => [
                'nullable',
                'required_if:phoenixpanel:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
            ],
            'phoenixpanel:client_features:allocations:range_end' => [
                'nullable',
                'required_if:phoenixpanel:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
                'gt:phoenixpanel:client_features:allocations:range_start',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'recaptcha:enabled' => 'reCAPTCHA Enabled',
            'recaptcha:secret_key' => 'reCAPTCHA Secret Key',
            'recaptcha:website_key' => 'reCAPTCHA Website Key',
            'phoenixpanel:guzzle:timeout' => 'HTTP Request Timeout',
            'phoenixpanel:guzzle:connect_timeout' => 'HTTP Connection Timeout',
            'phoenixpanel:client_features:allocations:enabled' => 'Auto Create Allocations Enabled',
            'phoenixpanel:client_features:allocations:range_start' => 'Starting Port',
            'phoenixpanel:client_features:allocations:range_end' => 'Ending Port',
        ];
    }
}


