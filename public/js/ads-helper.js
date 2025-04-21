/**
 * PhoenixPanel Ad Helper
 * This script helps ensure ads load properly by providing additional support for ad scripts
 */
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Function to ensure ad containers have proper height and visibility
        function ensureAdContainersHeight() {
            const adContainers = document.querySelectorAll('.ad-container');
            
            adContainers.forEach(function(container) {
                // If the container has no height but contains content, give it minimum height
                if (container.offsetHeight < 90 && container.innerHTML.trim() !== '') {
                    container.style.minHeight = '90px';
                }
                
                // Make sure iframes within the container are visible
                const iframes = container.querySelectorAll('iframe');
                iframes.forEach(function(iframe) {
                    iframe.style.display = 'block';
                    iframe.style.margin = '0 auto';
                    iframe.style.maxWidth = '100%';
                    
                    // If iframe has no height, set a default
                    if (iframe.height === 0 || iframe.height === '') {
                        iframe.height = 90;
                    }
                });
                
                // Check for ad content that might be hidden
                const adContent = container.querySelector('div[id^="ad_"]');
                if (adContent && window.getComputedStyle(adContent).display === 'none') {
                    adContent.style.display = 'block';
                }
            });
        }
        
        // Run initially
        ensureAdContainersHeight();
        
        // Run again after delays to catch dynamically loaded ads
        setTimeout(ensureAdContainersHeight, 500);
        setTimeout(ensureAdContainersHeight, 1000);
        setTimeout(ensureAdContainersHeight, 2000);
        setTimeout(ensureAdContainersHeight, 3000);
        
        // Also run when window is resized
        window.addEventListener('resize', ensureAdContainersHeight);
    });
})();