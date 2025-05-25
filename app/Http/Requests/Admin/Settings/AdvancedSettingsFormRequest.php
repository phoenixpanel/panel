<?php

namespace PhoenixPanel\Http\Requests\Admin\Settings;

use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class AdvancedSettingsFormRequest extends AdminFormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Convert string values to integer (1/0) for allocations:enabled
        if ($this->has('phoenixpanel:client_features:allocations:enabled')) {
            $value = $this->input('phoenixpanel:client_features:allocations:enabled');            
            if (is_string($value)) {
                // Convert "true"/"false" strings and "Enabled"/"Disabled" strings to 1/0
                $intValue = in_array($value, ['true', 'Enabled', '1'], true) ? 1 : 0;
                $this->merge([
                    'phoenixpanel:client_features:allocations:enabled' => $intValue
                ]);
            }
        }
    }

    /**
     * Return all the rules to apply to this request's data.
     */
    public function rules(): array
    {
        $rules = [];
        
        $rules['phoenixpanel:captcha:provider'] = ['requiredif:phoenixpanel:captcha:enabled,1', 'string', 'in:google,cloudflare'];
        $rules['phoenixpanel:captcha:enabled'] = ['sometimes', 'integer', 'in:0,1'];

        $rules['phoenixpanel:captcha:cloudflare:site_key'][] = 'required_if:phoenixpanel:captcha:provider,cloudflare';
        $rules['phoenixpanel:captcha:cloudflare:secret_key'][] = 'required_if:phoenixpanel:captcha:provider,cloudflare';
        $rules['phoenixpanel:captcha:google:site_key'][] = 'required_if:phoenixpanel:captcha:provider,google';
        $rules['phoenixpanel:captcha:google:secret_key'][] = 'required_if:phoenixpanel:captcha:provider,google';
        $rules['phoenixpanel:guzzle:timeout'] = ['required', 'integer', 'min:0'];
        $rules['phoenixpanel:guzzle:connect_timeout'] = ['required', 'integer', 'min:0'];
        $rules['phoenixpanel:client_features:allocations:enabled'] = ['sometimes', 'integer', 'in:0,1'];
        $rules['phoenixpanel:client_features:allocations:range_start'] = ['required_if:phoenixpanel:client_features:allocations:enabled,1', 'integer', 'min:1024', 'max:65535'];
        $rules['phoenixpanel:client_features:allocations:range_end'] = ['required_if:phoenixpanel:client_features:allocations:enabled,1', 'integer', 'min:1024', 'max:65535', 'gte:phoenixpanel:client_features:allocations:range_start'];

        $rules['phoenixpanel:protectcord:enabled'] = ['sometimes', 'integer', 'in:0,1'];
        $rules['phoenixpanel:protectcord:api_key'] = ['required_if:phoenixpanel:protectcord:enabled,1', 'string', 'min:0', 'max:255'];


        return $rules;
    }

    /**
     * Return only the fields that we are interested in from the request.
     * This will include empty fields as a null value.
     */
    public function normalize(array $only = null): array
    {
        // Get the processed data (after prepareForValidation)
        $data = $this->validated();
        
        // If specific fields are requested, filter to those
        if ($only !== null) {
            return array_intersect_key($data, array_flip($only));
        }
        
        return $data;
    }

    public function attributes(): array
    {
        return [
            'phoenixpanel:guzzle:timeout' => 'HTTP Request Timeout',
            'phoenixpanel:guzzle:connect_timeout' => 'HTTP Connection Timeout',
            'phoenixpanel:client_features:allocations:enabled' => 'Auto Create Allocations Enabled',
            'phoenixpanel:client_features:allocations:range_start' => 'Starting Port',
            'phoenixpanel:client_features:allocations:range_end' => 'Ending Port',

            'phoenixpanel:captcha:provider' => 'Captcha Provider',
            'phoenixpanel:captcha:enabled' => 'Captcha Toggle',
            'phoenixpanel:captcha:cloudflare:site_key' => 'Cloudflare Site Key',
            'phoenixpanel:captcha:cloudflare:secret_key' => 'Cloudflare Secret Key',
            'phoenixpanel:captcha:google:site_key' => 'Google Site Key',
            'phoenixpanel:captcha:google:secret_key' => 'Google Secret Key',

            'phoenixpanel:protectcord:enabled' => 'PhoenixPanel Enabled',
            'phoenixpanel:protectcord:api_key' => 'PhoenixPanel API Key'
        ];
    }
}
