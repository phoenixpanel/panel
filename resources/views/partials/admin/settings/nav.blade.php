@include('partials/admin.settings.notice')

@section('settings::nav')
    @yield('settings::notice')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'basic')class="active"@endif><a href="{{ route('admin.settings') }}">General</a></li>
                    <li @if($activeTab === 'mail')class="active"@endif><a href="{{ route('admin.settings.mail') }}">Mail</a></li>
                    <li @if($activeTab === 'advanced')class="active"@endif><a href="{{ route('admin.settings.advanced') }}">Advanced</a></li>
<<<<<<< HEAD
<<<<<<< HEAD
                    <li @if($activeTab === 'ads')class="active"@endif><a href="{{ route('admin.settings.adsmanager') }}">Ad Management</a></li>
=======
                    <li @if($activeTab === 'ads')class="active"@endif><a href="{{ route('admin.settings.ads') }}">Ad Manager</a></li>
>>>>>>> c291c57c2451e9dff9d14b8ba6fbb199d37504d2
=======
                    <li @if($activeTab === 'ads')class="active"@endif><a href="{{ route('admin.settings.adsmanager') }}">Ad Management</a></li>
>>>>>>> d68d74ff8daa290fdaf5194b4622adbcaf129e8e
                </ul>
            </div>
        </div>
    </div>
@endsection
