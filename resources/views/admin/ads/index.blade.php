@extends('layouts.admin')
@section('title')
    Ad Settings
@endsection

@section('content-header')
    <h1>Ad Settings<small>Configure advertisement spaces for your panel.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Ad Settings</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Ad Configuration</h3>
            </div>
            <form action="{{ route('admin.ads.update') }}" method="POST">
                <div class="box-body">
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label class="control-label">Enable Ads</label>
                            <div>
                                <div class="btn-group btn-toggle" data-toggle="buttons">
                                    <label class="btn btn-lg btn-success @if($settings->enabled) active @endif" style="min-width: 100px;">
                                        <input type="radio" name="enabled" value="1" @if($settings->enabled) checked @endif>
                                        <i class="fa fa-check-circle"></i> Enabled
                                    </label>
                                    <label class="btn btn-lg btn-danger @if(!$settings->enabled) active @endif" style="min-width: 100px;">
                                        <input type="radio" name="enabled" value="0" @if(!$settings->enabled) checked @endif>
                                        <i class="fa fa-times-circle"></i> Disabled
                                    </label>
                                </div>
                                <p class="text-muted"><small>If enabled, ads will be displayed in the configured locations throughout the panel.</small></p>
                            </div>
                        </div>
                    </div>
                    
                    <h4 class="box-title" style="margin-top: 20px;">Primary Ad Locations</h4>
                    <hr>
                    
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="top_ad_code" class="control-label">Top Ad Code</label>
                            <textarea id="top_ad_code" name="top_ad_code" class="form-control" rows="6">{{ $settings->top_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed at the top of the panel, below the header but above the main content.</small></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="bottom_ad_code" class="control-label">Bottom Ad Code</label>
                            <textarea id="bottom_ad_code" name="bottom_ad_code" class="form-control" rows="6">{{ $settings->bottom_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed at the bottom of the panel, above the footer but below the main content.</small></p>
                        </div>
                    </div>
                    
                    <h4 class="box-title" style="margin-top: 20px;">Additional Ad Locations</h4>
                    <hr>
                    
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="sidebar_ad_code" class="control-label">Sidebar Ad Code</label>
                            <textarea id="sidebar_ad_code" name="sidebar_ad_code" class="form-control" rows="6">{{ $settings->sidebar_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed in the sidebar area of the panel.</small></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="server_list_ad_code" class="control-label">Server List Ad Code</label>
                            <textarea id="server_list_ad_code" name="server_list_ad_code" class="form-control" rows="6">{{ $settings->server_list_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed in the server list page, between server entries.</small></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="dashboard_ad_code" class="control-label">Dashboard Ad Code</label>
                            <textarea id="dashboard_ad_code" name="dashboard_ad_code" class="form-control" rows="6">{{ $settings->dashboard_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed on the user dashboard page.</small></p>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    {!! csrf_field() !!}
                    <button type="submit" class="btn btn-primary pull-right">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection