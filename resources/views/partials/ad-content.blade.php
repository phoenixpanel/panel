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
// Refresh ads every minute
function refreshAds() {
    fetch('/refresh-ad')
        .then(response => response.text())
        .then(html => {
            // Create a temporary container to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Update left ad
            const leftAd = temp.querySelector('#left-ad');
            if (leftAd && document.getElementById('left-ad')) {
                document.getElementById('left-ad').innerHTML = leftAd.innerHTML;
            }
            
            // Update right ad
            const rightAd = temp.querySelector('#right-ad');
            if (rightAd && document.getElementById('right-ad')) {
                document.getElementById('right-ad').innerHTML = rightAd.innerHTML;
            }
        })
        .catch(error => console.error('Ad refresh error:', error));
}

// Initial refresh and then every 60 seconds
refreshAds();
setInterval(refreshAds, 60000);
</script>