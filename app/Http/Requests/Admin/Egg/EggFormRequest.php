<?php

namespace PhoenixPanel\Http\Requests\Admin\Egg;

use PhoenixPanel\Http\Requests\Admin\AdminFormRequest;

class EggFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:191',
            'description' => 'nullable|string',
            'docker_images' => ['required', 'string', 'regex:/^[\w#\.\/\- ]*\|*[\w\.\/\-:@ ]*$/im'],
            'force_outgoing_ip' => 'sometimes|boolean',
            'extra_allocations' => 'sometimes|integer',
            'file_denylist' => 'array',
            'startup' => 'required|string',
            'config_from' => 'sometimes|bail|nullable|numeric',
            'config_stop' => 'required_without:config_from|nullable|string|max:191',
            'config_startup' => 'required_without:config_from|nullable|json',
            'config_logs' => 'required_without:config_from|nullable|json',
            'config_files' => 'required_without:config_from|nullable|json',
            'image_data' => 'nullable|array',
            'image_data.image_enabled' => 'nullable|boolean',
            'image_data.image_type' => 'required_if:image_data.image_enabled,true|nullable|string|in:url',
            'image_data.image_value' => 'required_if:image_data.image_enabled,true|nullable|string|max:512',
        ];

        if ($this->method() === 'POST') {
            $rules['nest_id'] = 'required|numeric|exists:nests,id';
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->sometimes('config_from', 'exists:eggs,id', function () {
            return (int) $this->input('config_from') !== 0;
        });
    }

    public function validated($key = null, $default = null): array
    {
        $data = parent::validated();

        return array_merge($data, [
            'force_outgoing_ip' => array_get($data, 'force_outgoing_ip', false),
            'image_data' => $this->processImageData(array_get($data, 'image_data')),
        ]);
    }

    protected function processImageData($imageData): array
    {
        $enabled = filter_var(array_get($imageData, 'image_enabled'), FILTER_VALIDATE_BOOLEAN);

        if ($enabled) {
            return [
                'image_enabled' => true,
                'image_type' => 'url', // Only 'url' is supported for now
                'image_value' => array_get($imageData, 'image_value', ''),
            ];
        }

        return [
            'image_enabled' => false,
            'image_type' => '',
            'image_value' => '',
        ];
    }
}


