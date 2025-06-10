<?php

return [
    'vpn_proxy_blocked' => [
        'title' => 'Access Denied - VPN/Proxy Detected',
        'message' => 'For security reasons, access to this application is not permitted from VPN, proxy, or anonymization services. Please disable any VPN or proxy connections and try again.',
        'detected_threats' => 'Detected Connection Types:',
        'threat_types' => [
            'vpn' => 'VPN',
            'proxy' => 'Proxy',
            'tor' => 'Tor Network',
            'datacenter' => 'Datacenter IP',
        ],
        'steps_title' => 'How to Resolve This Issue:',
        'steps' => [
            'disable_vpn' => 'Disable any VPN, proxy, or Tor browser connections',
            'clear_browser' => 'Clear your browser cache and cookies',
            'wait_moment' => 'Wait a few moments for your connection to update',
            'try_again' => 'Refresh this page or try accessing the application again',
        ],
        'need_help' => [
            'title' => 'Still Having Issues?',
            'message' => 'If you believe this is an error or you need assistance, please contact our support team with the reference information below.',
        ],
        'retry_button' => 'Try Again',
        'technical_details' => [
            'reference_id' => 'Reference ID',
            'timestamp' => 'Timestamp',
            'ip_address' => 'IP Address',
        ],
    ],
];