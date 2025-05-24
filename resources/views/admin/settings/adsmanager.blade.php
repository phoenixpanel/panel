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
                            <label class="control-label">Enable Adterra Functionality</label>
                            <div>
                                <input type="hidden" name="phoenixpanel:ads:enabled" value="0">
                                <label>
                                    <input type="checkbox" name="phoenixpanel:ads:enabled" value="1" @if(old('phoenixpanel:ads:enabled', config('phoenixpanel.ads.enabled')) == 1) checked @endif> Enable
                                </label>
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
@endsection