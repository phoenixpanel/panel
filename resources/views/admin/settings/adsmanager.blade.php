@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'ads'])

@section('title')
    Ad Management
@endsection

@section('content-header')
    <h1>Ad Management<small>Configure Ad Management settings for PhoenixPanel.</small></h1>
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
                        <h3 class="box-title">Ads Management</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">Enable Adsterra Functionality</label>
                            <div>
                                <input type="hidden" name="phoenixpanel:ads:enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:ads:enabled" value="1" @if(old('phoenixpanel:ads:enabled', config('phoenixpanel.ads.enabled')) == 1) checked @endif> Enable
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Adsterra Ad Code (160x600)</label>
                            <div>
                                <textarea name="phoenixpanel:ads:code" class="form-control" rows="5" placeholder="Paste your Adsterra ad code here">{{ old('phoenixpanel:ads:code', config('phoenixpanel.ads.code')) }}</textarea>
                                <p class="help-block">Enter the ad code provided by Adsterra for the 160x600 ad unit.</p>
                                <p class="help-block">Need an Adsterra account? <a href="https://beta.publishers.adsterra.com/referral/wJKNd3ApCE" target="_blank" rel="noopener noreferrer">Sign up here</a> using this referral link.</p>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Adsterra API Key <small>(optional)</small></label>
                            <div>
                                <input type="text" name="phoenixpanel:ads:api_key" class="form-control" value="{{ old('phoenixpanel:ads:api_key', config('phoenixpanel.ads.api_key')) }}" placeholder="Enter Adsterra API Key">
                                <p class="help-block">API key for Adsterra API integration (if using advanced features).</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box box-primary">
                    <div class="box-footer">
                        {{ csrf_field() }}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Ad Preview -->
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Preview</h3>
                </div>
                <div class="box-body">
                    <p>Left Margin Ad (160x600):</p>
                    <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                        @if(config('phoenixpanel.ads.enabled'))
                            {!! config('phoenixpanel.ads.code') !!}
                        @else
                            <div style="text-align: center; padding: 20px;">Ad Disabled</div>
                        @endif
                    </div>

                    <p>Right Margin Ad (160x600):</p>
                    <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                        @if(config('phoenixpanel.ads.enabled'))
                            {!! config('phoenixpanel.ads.code') !!}
                        @else
                            <div style="text-align: center; padding: 20px;">Ad Disabled</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Ad Metrics -->
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Metrics</h3>
                </div>
                <div class="box-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-aqua"><i class="fa fa-eye"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Total Impressions</span>
                                    <span class="info-box-number">0</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-box">
                                <span class="info-box-icon bg-green"><i class="fa fa-mouse-pointer"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">Total Clicks</span>
                                    <span class="info-box-number">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>