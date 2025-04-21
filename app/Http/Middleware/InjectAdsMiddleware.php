<?php

namespace PhoenixPanel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use PhoenixPanel\Models\AdSetting;

class InjectAdsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Don't inject ads in admin area or for non-HTML responses
        if ($request->is('admin*') || !$this->isHtmlResponse($response)) {
            return $response;
        }

        $adSettings = AdSetting::first();

        // If ads are not enabled or no settings exist, return the original response
        if (!$adSettings || !$adSettings->enabled) {
            return $response;
        }

        // Get the content of the response
        $content = $response->getContent();

        // Inject ad scripts into the head section
        $adScripts = $this->generateAdScripts($adSettings);
        $content = str_replace('</head>', $adScripts . '</head>', $content);

        // Update the response content
        $response->setContent($content);

        return $response;
    }

    /**
     * Check if the response is HTML.
     *
     * @param  mixed  $response
     * @return bool
     */
    private function isHtmlResponse($response)
    {
        return $response && method_exists($response, 'getContent') && 
               method_exists($response, 'header') && 
               strpos($response->header('Content-Type'), 'text/html') !== false;
    }

    /**
     * Generate ad scripts to inject into the page.
     *
     * @param  \PhoenixPanel\Models\AdSetting  $adSettings
     * @return string
     */
    private function generateAdScripts($adSettings)
    {
        $scripts = '<script>';
        
        if ($adSettings->header_ad_code) {
            $scripts .= 'window.headerAdHtml = `<div class="ad-container header-ad-container">' . $this->escapeJs($adSettings->header_ad_code) . '</div>`;';
        }
        
        if ($adSettings->sidebar_ad_code) {
            $scripts .= 'window.sidebarAdHtml = `<div class="ad-container sidebar-ad-container">' . $this->escapeJs($adSettings->sidebar_ad_code) . '</div>`;';
        }
        
        if ($adSettings->content_ad_code) {
            $scripts .= 'window.contentAdHtml = `<div class="ad-container content-ad-container">' . $this->escapeJs($adSettings->content_ad_code) . '</div>`;';
        }
        
        if ($adSettings->footer_ad_code) {
            $scripts .= 'window.footerAdHtml = `<div class="ad-container footer-ad-container">' . $this->escapeJs($adSettings->footer_ad_code) . '</div>`;';
        }
        
        $scripts .= '</script>';
        $scripts .= '<link rel="stylesheet" href="/css/ads.css">';
        
        return $scripts;
    }

    /**
     * Escape JavaScript code for insertion into a string.
     *
     * @param  string  $js
     * @return string
     */
    private function escapeJs($js)
    {
        return str_replace(['`', '\\'], ['\\`', '\\\\'], $js);
    }
}