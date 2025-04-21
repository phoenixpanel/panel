@if(isset($adSettings) && $adSettings->enabled)
    @if(!empty($adSettings->top_ad_code))
        <div class="ad-container ad-container-top">
            {!! $adSettings->top_ad_code !!}
        </div>
    @endif

    @if(!empty($adSettings->bottom_ad_code))
        <div class="ad-container ad-container-bottom">
            {!! $adSettings->bottom_ad_code !!}
        </div>
    @endif
@endif