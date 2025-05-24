@if(config('phoenixpanel.ads.enabled') && !request()->is('admin/*'))
    <div id="ad-container">
        <div class="ad-content" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
            <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                {!! config('phoenixpanel.ads.code') !!}
            </div>
        </div>
        <div class="ad-content" style="position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 1000;">
            <div style="width: 160px; height: 600px; border: 1px solid #ccc; margin: 10px 0;">
                {!! config('phoenixpanel.ads.code') !!}
            </div>
        </div>
    </div>
    <script>
        (function() {
            function loadAds() {
                fetch('/get-ad')
                    .then(response => response.text())
                    .then(html => {
                        document.getElementById('ad-container').innerHTML = html;
                    });
            }
            
            // Store original pushState
            const originalPushState = window.history.pushState;
            
            // Wrap pushState to detect route changes
            window.history.pushState = function() {
                originalPushState.apply(window.history, arguments);
                loadAds();
            };
            
            // Initial load
            document.addEventListener('DOMContentLoaded', loadAds);
        })();
    </script>
@endif