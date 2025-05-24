@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*'))
<style>
.ad-display {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 160px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
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

    <div class="ad-display">
        <div style="width: 100%; height: 100%; border: 1px solid #ccc;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
@endif