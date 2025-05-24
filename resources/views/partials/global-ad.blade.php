@if(config('phoenixpanel.ads.enabled'))
    <div class="ad-display" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
        <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
    <div class="ad-display" style="position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
        <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
@endif