<?php

namespace PheonixPanel\Http\Requests\Admin\Settings;

use PheonixPanel\Http\Requests\Admin\AdminFormRequest;

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
            'pheonixpanel:guzzle:timeout' => 'required|integer|between:1,60',
            'pheonixpanel:guzzle:connect_timeout' => 'required|integer|between:1,60',
            'pheonixpanel:client_features:allocations:enabled' => 'required|in:true,false',
            'pheonixpanel:client_features:allocations:range_start' => [
                'nullable',
                'required_if:pheonixpanel:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
            ],
            'pheonixpanel:client_features:allocations:range_end' => [
                'nullable',
                'required_if:pheonixpanel:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
                'gt:pheonixpanel:client_features:allocations:range_start',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'recaptcha:enabled' => 'reCAPTCHA Enabled',
            'recaptcha:secret_key' => 'reCAPTCHA Secret Key',
            'recaptcha:website_key' => 'reCAPTCHA Website Key',
            'pheonixpanel:guzzle:timeout' => 'HTTP Request Timeout',
            'pheonixpanel:guzzle:connect_timeout' => 'HTTP Connection Timeout',
            'pheonixpanel:client_features:allocations:enabled' => 'Auto Create Allocations Enabled',
            'pheonixpanel:client_features:allocations:range_start' => 'Starting Port',
            'pheonixpanel:client_features:allocations:range_end' => 'Ending Port',
        ];
    }
}
