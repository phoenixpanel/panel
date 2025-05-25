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

/* Enhanced responsive design with better scaling */
@media (max-width: 1200px) {
    .ad-display {
        width: 140px;
        height: 525px;
    }
}

@media (max-width: 992px) {
    .ad-display {
        width: 120px;
        height: 450px;
    }
}

@media (max-width: 768px) {
    .ad-display {
        width: 100px;
        height: 375px;
        min-height: 200px;
    }
}

@media (max-width: 576px) {
    .ad-display {
        width: 80px;
        height: 300px;
        min-height: 150px;
        padding: 5px;
    }
}

@media (max-width: 480px) {
    .ad-display {
        width: 60px;
        height: 225px;
        min-height: 100px;
        padding: 3px;
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