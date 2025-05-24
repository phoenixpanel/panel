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
                fetch('/get-ad', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    document.getElementById('ad-container').innerHTML = html;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
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