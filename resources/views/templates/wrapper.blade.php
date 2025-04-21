<!DOCTYPE html>
<html>
    <head>
        <title>{{ config('app.name', 'PhoenixPanel') }}</title>

        @section('meta')
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
            <meta name="csrf-token" content="{{ csrf_token() }}">
            <meta name="robots" content="noindex">
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
            <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
            <link rel="manifest" href="/favicons/manifest.json">
            <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
            <link rel="shortcut icon" href="/favicons/favicon.ico">
            <meta name="msapplication-config" content="/favicons/browserconfig.xml">
            <meta name="theme-color" content="#E25822"> <!-- Phoenix primary color -->
        @show

        @section('user-data')
            @if(!is_null(Auth::user()))
                <script>
                    window.PhoenixPanelUser = {!! json_encode(Auth::user()->toVueObject()) !!};
                </script>
            @endif
            @if(!empty($siteConfiguration))
                <script>
                    window.SiteConfiguration = {!! json_encode($siteConfiguration) !!};
                </script>
            @endif
        @show
        <style>
            @import url('//fonts.googleapis.com/css?family=Rubik:300,400,500&display=swap');
            @import url('//fonts.googleapis.com/css?family=IBM+Plex+Mono|IBM+Plex+Sans:500&display=swap');
        </style>

        @yield('assets')
        <link rel="stylesheet" href="/css/ads.css">

        @include('layouts.scripts')
    </head>
    <body class="{{ $css['body'] ?? 'bg-neutral-50' }}">
        @section('content')
            @yield('above-container')
            
            @if(isset($adSettings) && $adSettings->enabled && !empty($adSettings->top_ad_code))
                <div class="ad-container ad-container-top" id="top-ad-container">
                    {!! $adSettings->top_ad_code !!}
                </div>
            @endif
            
            @yield('container')
            
            @if(isset($adSettings) && $adSettings->enabled && !empty($adSettings->bottom_ad_code))
                <div class="ad-container ad-container-bottom" id="bottom-ad-container">
                    {!! $adSettings->bottom_ad_code !!}
                </div>
            @endif
            
            @yield('below-container')
        @show
        @section('scripts')
            @if(isset($asset))
                {!! $asset->js('main.js') !!}
            @endif
            <script src="/js/ads-helper.js" type="application/javascript"></script>
        @show
    </body>
</html>


