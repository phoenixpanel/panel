<?php

return [
    'sign_in' => 'Sign In',
    'go_to_login' => 'Go to Login',
    'failed' => 'No account matching those credentials could be found.',

    'forgot_password' => [
        'label' => 'Forgot Password?',
        'label_help' => 'Enter your account email address to receive instructions on resetting your password.',
        'button' => 'Recover Account',
    ],

    'reset_password' => [
        'button' => 'Reset and Sign In',
    ],

    'two_factor' => [
        'label' => '2-Factor Token',
        'label_help' => 'This account requires a second layer of authentication in order to continue. Please enter the code generated by your device to complete this login.',
        'checkpoint_failed' => 'The two-factor authentication token was invalid.',
    ],

    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
    'password_requirements' => 'Password must be at least 8 characters in length and should be unique to this site.',
    '2fa_must_be_enabled' => 'The administrator has required that 2-Factor Authentication be enabled for your account in order to use the Panel.',
    'vpn_proxy_blocked' => 'Access denied. For security reasons, login and registration are not allowed from VPN or proxy connections. Please disable your VPN/proxy and try again.',
    
    // Additional VPN/Proxy blocking messages for different contexts
    'vpn_proxy_general_blocked' => 'Access to this application is restricted from VPN, proxy, or anonymization services.',
    'vpn_detected' => 'VPN connection detected. Please disable your VPN to continue.',
    'proxy_detected' => 'Proxy connection detected. Please disable your proxy to continue.',
    'tor_detected' => 'Tor network access detected. Please use a standard internet connection.',
    'datacenter_detected' => 'Datacenter IP detected. Please use a residential internet connection.',
];
