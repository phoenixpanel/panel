@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*') && !request()->is('login') && !request()->is('register') && !request()->is('password/*') && !request()->is('email/*') && !request()->is('auth/*'))
<style>
.ad-display {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    z-index: 1000;
    width: 160px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Hide ads on mobile devices */
@media (max-width: 768px) {
    .ad-display {
        display: none;
    }
}
</style>

    <div class="ad-display left">
        <div style="width: 100%; height: 100%; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
    <div class="ad-display right">
        <style>
            .ad-display.right {
                right: 0;
                left: auto;
            }
        </style>
        <div style="width: 100%; height: 100%; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
@endif