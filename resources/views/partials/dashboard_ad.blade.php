@if(isset($adSettings) && $adSettings->enabled && !empty($adSettings->dashboard_ad_code))
    <div class="ad-container ad-container-dashboard" id="dashboard-ad-container">
        {!! $adSettings->dashboard_ad_code !!}
    </div>
@endif