<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Restricted Environment
    |--------------------------------------------------------------------------
    |
    | Set this environment variable to true to enable a restricted configuration
    | setup on the panel. When set to true, configurations stored in the
    | database will not be applied.
    */

    'load_environment_only' => (bool) env('APP_ENVIRONMENT_ONLY', false),

    /*
    |--------------------------------------------------------------------------
    | Service Author
    |--------------------------------------------------------------------------
    |
    | Each panel installation is assigned a unique UUID to identify the
    | author of custom services, and make upgrades easier by identifying
    | standard PhoenixPanel shipped services.
    */

    'service' => [
        'author' => env('APP_SERVICE_AUTHOR', 'unknown@unknown.com'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    |
    | Should login success and failure events trigger an email to the user?
    */

    'auth' => [
        '2fa_required' => env('APP_2FA_REQUIRED', 0),
        '2fa' => [
            'bytes' => 32,
            'window' => env('APP_2FA_WINDOW', 4),
            'verify_newer' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Certain pagination result counts can be configured here and will take
    | effect globally.
    */

    'paginate' => [
        'frontend' => [
            'servers' => env('APP_PAGINATE_FRONT_SERVERS', 15),
        ],
        'admin' => [
            'servers' => env('APP_PAGINATE_ADMIN_SERVERS', 25),
            'users' => env('APP_PAGINATE_ADMIN_USERS', 25),
        ],
        'api' => [
            'nodes' => env('APP_PAGINATE_API_NODES', 25),
            'servers' => env('APP_PAGINATE_API_SERVERS', 25),
            'users' => env('APP_PAGINATE_API_USERS', 25),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Guzzle Connections
    |--------------------------------------------------------------------------
    |
    | Configure the timeout to be used for Guzzle connections here.
    */

    'guzzle' => [
        'timeout' => env('GUZZLE_TIMEOUT', 15),
        'connect_timeout' => env('GUZZLE_CONNECT_TIMEOUT', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | CDN
    |--------------------------------------------------------------------------
    |
    | Information for the panel to use when contacting the CDN to confirm
    | if panel is up to date.
    */

    'cdn' => [
        'cache_time' => 60,
        'url' => 'https://cdn.phoenixpanel.io/releases/latest.json',
    ],

    /*
    |--------------------------------------------------------------------------
    | Client Features
    |--------------------------------------------------------------------------
    |
    | Allow clients to create their own databases.
    */

    'client_features' => [
        'databases' => [
            'enabled' => env('PHOENIXPANEL_CLIENT_DATABASES_ENABLED', true),
            'allow_random' => env('PHOENIXPANEL_CLIENT_DATABASES_ALLOW_RANDOM', true),
        ],

        'schedules' => [
            // The total number of tasks that can exist for any given schedule at once.
            'per_schedule_task_limit' => env('PHOENIXPANEL_PER_SCHEDULE_TASK_LIMIT', 10),
        ],

        'allocations' => [
            'enabled' => env('PHOENIXPANEL_CLIENT_ALLOCATIONS_ENABLED', false),
            'range_start' => env('PHOENIXPANEL_CLIENT_ALLOCATIONS_RANGE_START'),
            'range_end' => env('PHOENIXPANEL_CLIENT_ALLOCATIONS_RANGE_END'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Editor
    |--------------------------------------------------------------------------
    |
    | This array includes the MIME filetypes that can be edited via the web.
    */

    'files' => [
        'max_edit_size' => env('PHOENIXPANEL_FILES_MAX_EDIT_SIZE', 1024 * 1024 * 4),
    ],

    /*
    |--------------------------------------------------------------------------
    | Dynamic Environment Variables
    |--------------------------------------------------------------------------
    |
    | Place dynamic environment variables here that should be auto-appended
    | to server environment fields when the server is created or updated.
    |
    | Items should be in 'key' => 'value' format, where key is the environment
    | variable name, and value is the server-object key. For example:
    |
    | 'P_SERVER_CREATED_AT' => 'created_at'
    */

    'environment_variables' => [
        'P_SERVER_ALLOCATION_LIMIT' => 'allocation_limit',
    ],

    /*
    |--------------------------------------------------------------------------
    | Asset Verification
    |--------------------------------------------------------------------------
    |
    | This section controls the output format for JS & CSS assets.
    */

    'assets' => [
        'use_hash' => env('PHOENIXPANEL_USE_ASSET_HASH', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Email Notification Settings
    |--------------------------------------------------------------------------
    |
    | This section controls what notifications are sent to users.
    */

    'email' => [
        // Should an email be sent to a server owner once their server has completed it's first install process?
        'send_install_notification' => env('PHOENIXPANEL_SEND_INSTALL_NOTIFICATION', true),
        // Should an email be sent to a server owner whenever their server is reinstalled?
        'send_reinstall_notification' => env('PHOENIXPANEL_SEND_REINSTALL_NOTIFICATION', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Telemetry Settings
    |--------------------------------------------------------------------------
    |
    | This section controls the telemetry sent by PhoenixPanel.
    */

    'telemetry' => [
        'enabled' => false, //env('PHOENIXPANEL_TELEMETRY_ENABLED', true),
    ],

    'captcha' => [
        /*
         * Enable or disable captchas
         */
        'enabled' => env('RECAPTCHA_ENABLED', false),

        /*
         * Use a custom secret key, we use our public one by default
         */
        'secret_key' => env('RECAPTCHA_SECRET_KEY', '6LcJcjwUAAAAALOcDJqAEYKTDhwELCkzUkNDQ0J5'),
        '_shipped_secret_key' => '6LcJcjwUAAAAALOcDJqAEYKTDhwELCkzUkNDQ0J5',

        /*
         * Use a custom website key, we use our public one by default
         */
        'website_key' => env('RECAPTCHA_WEBSITE_KEY', '6LcJcjwUAAAAAO_Xqjrtj9wWufUpYRnK6BW8lnfn'),
        '_shipped_website_key' => '6LcJcjwUAAAAAO_Xqjrtj9wWufUpYRnK6BW8lnfn',

        /*
         * Domain verification is enabled by default and compares the domain used when solving the captcha
         * as public keys can't have domain verification on google's side enabled (obviously).
         */
        'verify_domain' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | ProtectCord Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for ProtectCord VPN/Proxy detection service.
    */

    'protectcord' => [
        /*
         * Enable or disable ProtectCord VPN/Proxy blocking
         */
        'enabled' => env('PROTECTCORD_ENABLED', false),

        /*
         * ProtectCord API key for VPN/Proxy detection
         */
        'api_key' => env('PROTECTCORD_API_KEY'),
    ],
];


