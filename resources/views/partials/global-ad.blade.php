@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*'))
<style>
.ad-display {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    width: 160px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ad-display.left {
    left: 25%;
}

.ad-display.right {
    right: 25%;
}

@media (max-width: 768px) {
    .ad-display {
        width: 100px;
        height: auto;
        min-height: 50px;
        padding: 10px;
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