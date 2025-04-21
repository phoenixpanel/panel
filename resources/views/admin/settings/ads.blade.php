@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'ads'])

@section('title')
    Ad Manager
@endsection

@section('content-header')
    <h1>Ad Manager<small>Configure and manage advertisements on your site.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li><a href="{{ route('admin.settings') }}">Settings</a></li>
        <li class="active">Ad Manager</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Ad Settings</h3>
                </div>
                <form action="{{ route('admin.settings.ads') }}" method="POST">
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">Enable Advertisements</label>
                                <div>
                                    <div class="btn-group" data-toggle="buttons">
                                        <label class="btn btn-primary @if ($adSettings->enabled) active @endif" style="@if ($adSettings->enabled) background-color: #4CAF50; border-color: #4CAF50; @endif">
                                            <input type="radio" name="enabled" autocomplete="off" value="1" @if ($adSettings->enabled) checked @endif> Enabled
                                        </label>
                                        <label class="btn btn-primary @if (!$adSettings->enabled) active @endif" style="@if (!$adSettings->enabled) background-color: #F44336; border-color: #F44336; @endif">
                                            <input type="radio" name="enabled" autocomplete="off" value="0" @if (!$adSettings->enabled) checked @endif> Disabled
                                        </label>
                                    </div>
                                    <p class="text-muted"><small>Enable or disable all advertisements across the site. When disabled, no ads will be displayed regardless of the settings below.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="control-label">Header Ad Code</label>
                                <div>
                                    <textarea class="form-control" name="header_ad_code" rows="4">{{ $adSettings->header_ad_code }}</textarea>
                                    <p class="text-muted"><small>This ad will appear at the top of the page, below the navigation bar.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="control-label">Sidebar Ad Code</label>
                                <div>
                                    <textarea class="form-control" name="sidebar_ad_code" rows="4">{{ $adSettings->sidebar_ad_code }}</textarea>
                                    <p class="text-muted"><small>This ad will appear in the sidebar of the page.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="control-label">Content Ad Code</label>
                                <div>
                                    <textarea class="form-control" name="content_ad_code" rows="4">{{ $adSettings->content_ad_code }}</textarea>
                                    <p class="text-muted"><small>This ad will appear within the content area of the page.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-12">
                                <label class="control-label">Footer Ad Code</label>
                                <div>
                                    <textarea class="form-control" name="footer_ad_code" rows="4">{{ $adSettings->footer_ad_code }}</textarea>
                                    <p class="text-muted"><small>This ad will appear at the bottom of the page, above the footer.</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="alert alert-info">
                                    <strong>Note:</strong> Ads will not be displayed in the admin area, regardless of the settings above.
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="callout callout-info">
                                    <h4>Example Ad Code</h4>
                                    <p>Here's an example of ad code that you can use:</p>
                                    <pre>&lt;script type="text/javascript"&gt;
    atOptions = {
        'key' : 'c9cf21b40a2ca7a712838aa159302d54',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
    };
&lt;/script&gt;
&lt;script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"&gt;&lt;/script&gt;</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        $(function() {
            $('input[name="enabled"]').change(function() {
                if ($(this).val() === '1') {
                    $(this).closest('label').css({
                        'background-color': '#4CAF50',
                        'border-color': '#4CAF50'
                    });
                    $(this).closest('.btn-group').find('label').not($(this).closest('label')).css({
                        'background-color': '',
                        'border-color': ''
                    });
                } else {
                    $(this).closest('label').css({
                        'background-color': '#F44336',
                        'border-color': '#F44336'
                    });
                    $(this).closest('.btn-group').find('label').not($(this).closest('label')).css({
                        'background-color': '',
                        'border-color': ''
                    });
                }
            });
        });
    </script>
@endsection