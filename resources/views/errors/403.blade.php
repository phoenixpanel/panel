<!DOCTYPE html>
<html>
    <head>
        <title>{{ config('app.name', 'PhoenixPanel') }} - Access Forbidden</title>
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
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #e5e5e5;
                line-height: 1.6;
            }
            
            .error-container {
                background: #2d2d2d;
                border: 1px solid #4b5563;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                padding: 40px;
                text-align: center;
                margin: 20px;
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                background: #f97316;
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
                color: #f97316;
                margin-bottom: 20px;
            }
            
            .error-message {
                font-size: 16px;
                color: #d1d5db;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            
            .retry-button {
                background: #f97316;
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
                margin: 10px;
            }
            
            .retry-button:hover {
                background: #ea580c;
                color: white;
                text-decoration: none;
            }
            
            .home-button {
                background: #4b5563;
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
                margin: 10px;
            }
            
            .home-button:hover {
                background: #374151;
                color: white;
                text-decoration: none;
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
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">
                🚫
            </div>
            
            <h1 class="error-title">Access Forbidden</h1>
            
            <p class="error-message">
                You don't have permission to access this resource. This could be due to security restrictions or insufficient privileges.
            </p>
            
            <a href="javascript:window.location.reload()" class="retry-button">
                Try Again
            </a>
            
            <a href="{{ route('index') }}" class="home-button">
                Go Home
            </a>
        </div>
    </body>
</html>