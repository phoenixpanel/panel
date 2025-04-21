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
                                <div class="btn-group" data-toggle="buttons">
                                    <label class="btn btn-primary @if($settings->enabled) active @endif">
                                        <input type="radio" name="enabled" value="1" @if($settings->enabled) checked @endif> Enabled
                                    </label>
                                    <label class="btn btn-danger @if(!$settings->enabled) active @endif">
                                        <input type="radio" name="enabled" value="0" @if(!$settings->enabled) checked @endif> Disabled
                                    </label>
                                </div>
                                <p class="text-muted"><small>If enabled, ads will be displayed at the top and bottom of the panel.</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="top_ad_code" class="control-label">Top Ad Code</label>
                            <textarea id="top_ad_code" name="top_ad_code" class="form-control" rows="6">{{ $settings->top_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed at the top of the panel. You can use HTML, JavaScript, or any ad provider code.</small></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="bottom_ad_code" class="control-label">Bottom Ad Code</label>
                            <textarea id="bottom_ad_code" name="bottom_ad_code" class="form-control" rows="6">{{ $settings->bottom_ad_code }}</textarea>
                            <p class="text-muted"><small>This code will be displayed at the bottom of the panel. You can use HTML, JavaScript, or any ad provider code.</small></p>
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