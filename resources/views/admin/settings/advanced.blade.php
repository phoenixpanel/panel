@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'advanced'])

@section('title')
    Advanced Settings
@endsection

@section('content-header')
    <h1>Advanced Settings<small>Configure advanced settings for PhoenixPanel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Settings</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <form action="" method="POST">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Captcha Configuration</h3>
                    </div>
                    <div class="box-body">
                        @php
                            $captchaProvider = old('phoenixpanel:captcha:provider', config('phoenixpanel.captcha.provider'));
                        @endphp
                        <div class="form-group">
                            <label class="control-label">Captcha Provider</label>
                            <div>
                                <label>
                                    <input type="radio" name="phoenixpanel:captcha:provider" value="cloudflare" @if($captchaProvider == 'cloudflare') checked @endif> Cloudflared Captcha
                                </label>
                                <br>
                                <label>
                                    <input type="radio" name="phoenixpanel:captcha:provider" value="google" @if($captchaProvider == 'google') checked @endif> Google reCaptcha
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Enable Captcha</label>
                            <div>
                                <input type="hidden" name="phoenixpanel:captcha:enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:captcha:enabled" value="1" @if(old('phoenixpanel:captcha:enabled', config('phoenixpanel.captcha.enabled')) == 1) checked @endif> Enable
                                </label>
                            </div>
                        </div>

                        <div class="form-group cloudflare-site-key">
                            <label class="control-label">Cloudflare Site Key</label>
                            <div>
                                <input type="text" class="form-control captcha-site-key cloudflare-site-key" name="phoenixpanel:captcha:cloudflare:site_key" value="{{ old('phoenixpanel:captcha:cloudflare:site_key', config('phoenixpanel.captcha.cloudflare.site_key')) }}">
                            </div>
                        </div>

                        <div class="form-group cloudflare-secret-key">
                            <label class="control-label">Cloudflare Secret Key</label>
                            <div>
                                <input type="password" class="form-control captcha-secret-key cloudflare-secret-key" name="phoenixpanel:captcha:cloudflare:secret_key" value="{{ old('phoenixpanel:captcha:cloudflare:secret_key', config('phoenixpanel.captcha.cloudflare.secret_key')) }}">
                            </div>
                        </div>

                        <div class="form-group google-site-key">
                            <label class="control-label">Google Site Key</label>
                            <div>
                                <input type="text" class="form-control captcha-site-key google-site-key" name="phoenixpanel:captcha:google:site_key" value="{{ old('phoenixpanel:captcha:google:site_key', config('phoenixpanel.captcha.google.site_key')) }}">
                            </div>
                        </div>

                        <div class="form-group google-secret-key">
                            <label class="control-label">Google Secret Key</label>
                            <div>
                                <input type="password" class="form-control captcha-secret-key google-secret-key" name="phoenixpanel:captcha:google:secret_key" value="{{ old('phoenixpanel:captcha:google:secret_key', config('phoenixpanel.captcha.google.secret_key')) }}">
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">ProtectCord Configuration</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group protectcord">
                            <p class="text-muted small"><a href="https://protectcord.com" target="_blank" rel="noopener noreferrer">ProtectCord</a> is a system that can be integrated into Login and Registration to secure your systems from VPNs and Proxies, with our new system you can easily block potentially malicious users from accessing your network. We forever offer 10RPM for free but feel free to add some more credits if you handle more customers. You can find ProtectCord's dashboard <a href="https://dash.protectcord.com" target="_blank" rel="noopener noreferrer">here!</a></p>
                            <label class="control-label">Enable ProtectCord</label>
                            <div>
                                <input type="hidden" name="phoenixpanel:protectcord:enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:protectcord:enabled" value="1" @if(old('phoenixpanel:protectcord:enabled', config('phoenixpanel.protectcord.enabled')) == 1) checked @endif> Enable
                                </label>
                            </div>
                        </div>

                        <div class="form-group protectcord-api-key">
                            <label class="control-label">ProtectCord API Key</label>
                            <div>
                                <input type="password" class="form-control protectcord-api-key" name="phoenixpanel:protectcord:api_key" value="{{ old('phoenixpanel:protectcord:api_key', config('phoenixpanel.protectcord.api_key')) }}">
                                <p class="text-muted small">Need a ProtectCord API Key? <a href="https://discord.gg/ZPtaJzjpmT" target="_blank" rel="noopener noreferrer">Join here</a> then run <span class="ant-typography" id="license-command" style="border-radius: 3px; background-color: #871f0e; padding: 0px 2px 0px 2px">/licenses create</span> to get a license key!</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">HTTP Connections</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="control-label">Connection Timeout</label>
                                <div>
                                    <input type="number" required class="form-control" name="phoenixpanel:guzzle:connect_timeout" value="{{ old('phoenixpanel:guzzle:connect_timeout', config('phoenixpanel.guzzle.connect_timeout')) }}">
                                    <p class="text-muted small">The amount of time in seconds to wait for a connection to be opened before throwing an error.</p>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="control-label">Request Timeout</label>
                                <div>
                                    <input type="number" required class="form-control" name="phoenixpanel:guzzle:timeout" value="{{ old('phoenixpanel:guzzle:timeout', config('phoenixpanel.guzzle.timeout')) }}">
                                    <p class="text-muted small">The amount of time in seconds to wait for a request to be completed before throwing an error.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Automatic Allocation Creation</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Status</label>
                                <div>
                                    <select class="form-control" name="phoenixpanel:client_features:allocations:enabled">
                                        <option value="false">Disabled</option>
                                        <option value="true" @if(old('phoenixpanel:client_features:allocations:enabled', config('phoenixpanel.client_features.allocations.enabled'))) selected @endif>Enabled</option>
                                    </select>
                                    <p class="text-muted small">If enabled users will have the option to automatically create new allocations for their server via the frontend.</p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Starting Port</label>
                                <div>
                                    <input type="number" class="form-control" name="phoenixpanel:client_features:allocations:range_start" value="{{ old('phoenixpanel:client_features:allocations:range_start', config('phoenixpanel.client_features.allocations.range_start')) }}">
                                    <p class="text-muted small">The starting port in the range that can be automatically allocated.</p>
                                </div>
                            </div>
                            <div class="form-group col-md-4">
                                <label class="control-label">Ending Port</label>
                                <div>
                                    <input type="number" class="form-control" name="phoenixpanel:client_features:allocations:range_end" value="{{ old('phoenixpanel:client_features:allocations:range_end', config('phoenixpanel.client_features.allocations.range_end')) }}">
                                    <p class="text-muted small">The ending port in the range that can be automatically allocated.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="box-footer">
                        {{ csrf_field() }}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('footer-scripts')
    <script>
        $(document).ready(function() {
            // Function to show/hide input fields based on selected radio button
            function toggleInputFields() {
                var selectedProvider = $('input[name="captcha_provider"]:checked').val();

                // Hide all input fields first
                $('.cloudflare-site-key').closest('.form-group').hide();
                $('.cloudflare-secret-key').closest('.form-group').hide();
                $('.google-site-key').closest('.form-group').hide();
                $('.google-secret-key').closest('.form-group').hide();

                // Show input fields based on selected provider
                if (selectedProvider === 'cloudflare') {
                    $('.cloudflare-site-key').closest('.form-group').fadeIn('slow');
                    $('.cloudflare-secret-key').closest('.form-group').fadeIn('slow');
                } else if (selectedProvider === 'google') {
                    $('.google-site-key').closest('.form-group').fadeIn('slow');
                    $('.google-secret-key').closest('.form-group').fadeIn('slow');
                }
            }

            // Initially hide the input fields
            $('.cloudflare-site-key').closest('.form-group').hide();
            $('.cloudflare-secret-key').closest('.form-group').hide();
            $('.google-site-key').closest('.form-group').hide();
            $('.google-secret-key').closest('.form-group').hide();

            // Call the function on radio button change
            $('input[name="captcha_provider"]').on('change', function() {
                toggleInputFields();
            });

            // Call the function on page load to set initial state
            toggleInputFields();

            // Add names to the radio buttons
            $('input[name="captcha_provider"][value="cloudflare"]').addClass('cloudflare-radio');
            $('input[name="captcha_provider"][value="google"]').addClass('google-radio');

            // Form validation
            $('form').on('submit', function(event) {
                var selectedProvider = $('input[name="captcha_provider"]:checked').val();

                if (!selectedProvider) {
                    return;
                }

                let siteKey = '';
                let secretKey = '';

                if (selectedProvider === 'cloudflare') {
                    siteKey = $('input[name="phoenixpanel:captcha:cloudflare:site_key"]').val();
                    secretKey = $('input[name="phoenixpanel:captcha:cloudflare:secret_key"]').val();
                } else if (selectedProvider === 'google') {
                    siteKey = $('input[name="phoenixpanel:captcha:google:site_key"]').val();
                    secretKey = $('input[name="phoenixpanel:captcha:google:secret_key"]').val();
                }

                if (!siteKey || !secretKey) {
                    alert('Please fill in both Site Key and Secret Key for the selected Captcha provider.');
                    event.preventDefault();
                }
            });
        });
    </script>