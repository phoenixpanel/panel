@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*'))
<style>
.ad-display {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    width: 160px;
    height: 600px;
}

.ad-display.left {
    left: 0;
}

.ad-display.right {
    right: 0;
}

@media (max-width: 768px) {
    .ad-display {
        width: 100px;
        height: auto;
        min-height: 50px;
    }
}
</style>

    <div class="ad-display left">
        <div style="width: 100%; height: 100%; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
    <div class="ad-display right">
        <div style="width: 100%; height: 100%; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
@endif