@if(isset($adSettings) && $adSettings->enabled && !empty($adSettings->server_list_ad_code))
    <div class="ad-container ad-container-server-list" id="server-list-ad-container">
        {!! $adSettings->server_list_ad_code !!}
    </div>
@endif