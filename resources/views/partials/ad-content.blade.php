<!-- Ad container with valid z-index and simplified structure -->
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

<script>
// Refresh ads every minute with cache-busting
function refreshAds() {
    // Add cache-buster parameter to prevent browser caching
    const cacheBuster = '?t=' + new Date().getTime();
    fetch('/refresh-ad' + cacheBuster)
        .then(response => response.text())
        .then(html => {
            // Create a temporary container to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Update left ad container including styles
            const leftAdContainer = temp.querySelector('.ad-content:nth-of-type(1)');
            if (leftAdContainer && document.querySelector('.ad-content:nth-of-type(1)')) {
                document.querySelector('.ad-content:nth-of-type(1)').innerHTML =
                    leftAdContainer.innerHTML;
            }
            
            // Update right ad container including styles
            const rightAdContainer = temp.querySelector('.ad-content:nth-of-type(2)');
            if (rightAdContainer && document.querySelector('.ad-content:nth-of-type(2)')) {
                document.querySelector('.ad-content:nth-of-type(2)').innerHTML =
                    rightAdContainer.innerHTML;
            }
        })
        .catch(error => console.error('Ad refresh error:', error));
}

// Initial refresh and then every 60 seconds
refreshAds();
setInterval(refreshAds, 60000);
</script>