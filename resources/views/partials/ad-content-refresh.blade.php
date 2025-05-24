<!-- Ad containers with positioning -->
<div class="ad-content" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
    <div id="left-ad" style="width: 160px; height: 600px; background: #fff; border: 1px solid #ddd;">
        {!! config('phoenixpanel.ads.code') !!}
    </div>
</div>
<div class="ad-content" style="position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
    <div id="right-ad" style="width: 160px; height: 600px; background: #fff; border: 1px solid #ddd;">
        {!! config('phoenixpanel.ads.code') !!}
    </div>
</div>