<!DOCTYPE html>
<html>
    <head>
        <title>{{ config('app.name', 'PhoenixPanel') }} - Access Denied</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="robots" content="noindex">
        
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#E25822">
        
        <style>
            @import url('//fonts.googleapis.com/css?family=Rubik:300,400,500&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Rubik', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
                line-height: 1.6;
            }
            
            .error-container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                width: 90%;
                padding: 40px;
                text-align: center;
                margin: 20px;
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                background: #E25822;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 30px;
                color: white;
                font-size: 36px;
            }
            
            .error-title {
                font-size: 28px;
                font-weight: 500;
                color: #E25822;
                margin-bottom: 20px;
            }
            
            .error-message {
                font-size: 16px;
                color: #666;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            
            .threat-info {
                background: #f8f9fa;
                border-left: 4px solid #E25822;
                padding: 20px;
                margin: 25px 0;
                text-align: left;
                border-radius: 0 8px 8px 0;
            }
            
            .threat-info h4 {
                color: #E25822;
                margin-bottom: 10px;
                font-size: 16px;
                font-weight: 500;
            }
            
            .threat-types {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 15px 0;
                justify-content: center;
            }
            
            .threat-badge {
                background: #E25822;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
            }
            
            .steps-container {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                text-align: left;
            }
            
            .steps-title {
                color: #E25822;
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .steps-list {
                list-style: none;
                counter-reset: step-counter;
            }
            
            .steps-list li {
                counter-increment: step-counter;
                margin-bottom: 15px;
                padding-left: 40px;
                position: relative;
                font-size: 14px;
                line-height: 1.6;
            }
            
            .steps-list li::before {
                content: counter(step-counter);
                position: absolute;
                left: 0;
                top: 0;
                background: #E25822;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 500;
            }
            
            .contact-info {
                background: #e8f4fd;
                border: 1px solid #bee5eb;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
            }
            
            .contact-info h4 {
                color: #0c5460;
                margin-bottom: 10px;
                font-size: 16px;
            }
            
            .contact-info p {
                color: #0c5460;
                font-size: 14px;
                margin: 0;
            }
            
            .retry-button {
                background: #E25822;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.3s ease;
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
            }
            
            .retry-button:hover {
                background: #c44a1c;
                color: white;
                text-decoration: none;
            }
            
            .technical-details {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
            }
            
            .technical-details strong {
                color: #666;
            }
            
            @media (max-width: 768px) {
                .error-container {
                    padding: 30px 20px;
                }
                
                .error-title {
                    font-size: 24px;
                }
                
                .error-message {
                    font-size: 15px;
                }
                
                .threat-types {
                    justify-content: center;
                }
                
                .steps-list li {
                    padding-left: 35px;
                    font-size: 13px;
                }
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">
                🛡️
            </div>
            
            <h1 class="error-title">{{ __('errors.vpn_proxy_blocked.title') }}</h1>
            
            <p class="error-message">
                {{ __('errors.vpn_proxy_blocked.message') }}
            </p>
            
            @if(!empty($threatTypes) && count($threatTypes) > 0)
                <div class="threat-info">
                    <h4>{{ __('errors.vpn_proxy_blocked.detected_threats') }}</h4>
                    <div class="threat-types">
                        @foreach($threatTypes as $type)
                            <span class="threat-badge">{{ __('errors.vpn_proxy_blocked.threat_types.' . strtolower($type)) }}</span>
                        @endforeach
                    </div>
                </div>
            @endif
            
            <div class="steps-container">
                <h3 class="steps-title">{{ __('errors.vpn_proxy_blocked.steps_title') }}</h3>
                <ol class="steps-list">
                    <li>{{ __('errors.vpn_proxy_blocked.steps.disable_vpn') }}</li>
                    <li>{{ __('errors.vpn_proxy_blocked.steps.clear_browser') }}</li>
                    <li>{{ __('errors.vpn_proxy_blocked.steps.wait_moment') }}</li>
                    <li>{{ __('errors.vpn_proxy_blocked.steps.try_again') }}</li>
                </ol>
            </div>
            
            <div class="contact-info">
                <h4>{{ __('errors.vpn_proxy_blocked.need_help.title') }}</h4>
                <p>{{ __('errors.vpn_proxy_blocked.need_help.message') }}</p>
            </div>
            
            <a href="javascript:window.location.reload()" class="retry-button">
                {{ __('errors.vpn_proxy_blocked.retry_button') }}
            </a>
            
            <div class="technical-details">
                <strong>{{ __('errors.vpn_proxy_blocked.technical_details.reference_id') }}:</strong> {{ $requestId ?? 'N/A' }}<br>
                <strong>{{ __('errors.vpn_proxy_blocked.technical_details.timestamp') }}:</strong> {{ now()->format('Y-m-d H:i:s T') }}<br>
                @if(!empty($ipAddress))
                    <strong>{{ __('errors.vpn_proxy_blocked.technical_details.ip_address') }}:</strong> {{ $ipAddress }}
                @endif
            </div>
        </div>
    </body>
</html>