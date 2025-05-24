@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*'))
    <div id="ad-left" class="ad-display" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
        <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>
    <div id="ad-right" class="ad-display" style="position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
        <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
            {!! config('phoenixpanel.ads.code') !!}
        </div>
    </div>

    <script>
        function refreshAds() {
            const leftAd = document.getElementById('ad-left');
            const rightAd = document.getElementById('ad-right');

            if (leftAd && rightAd) {
                // Store original content
                const originalContent = leftAd.innerHTML;

                // Re-inject content to simulate refresh
                leftAd.innerHTML = '';
                rightAd.innerHTML = '';
                leftAd.innerHTML = originalContent;
                rightAd.innerHTML = originalContent;
            }
        }

        // Refresh on page load
        window.addEventListener('load', refreshAds);

        // Optional: Refresh on URL hash changes (for SPA-like behavior)
        window.addEventListener('hashchange', refreshAds);
    </script>
@endif