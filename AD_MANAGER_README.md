# Ad Manager for PhoenixPanel

This Ad Manager addon allows you to easily manage advertisements on your PhoenixPanel installation. You can enable or disable ads site-wide and configure different ad placements.

## Features

- Toggle to enable/disable all ads across the site
- Configurable ad placements:
  - Header ads (top of the page)
  - Sidebar ads (in the navigation area)
  - Content ads (within the main content area)
  - Footer ads (bottom of the page)
- Ads are automatically hidden in the admin area
- Responsive design that adapts to different screen sizes
- Easy to use admin interface

## Installation

The Ad Manager is already installed with your PhoenixPanel installation. To set it up:

1. Run the setup command:
   ```
   php artisan admanager:setup
   ```

2. Access the Ad Manager in the admin panel:
   - Go to the admin area
   - Navigate to Settings > Ad Manager

## Usage

### Enabling/Disabling Ads

In the Ad Manager settings, you can use the toggle switch to enable or disable all ads across the site. When disabled, no ads will be displayed regardless of the ad code settings.

### Configuring Ad Placements

For each ad placement (header, sidebar, content, footer), you can enter the appropriate ad code. This is typically JavaScript or HTML provided by your ad network.

Example ad code:
```html
<script type="text/javascript">
    atOptions = {
        'key' : 'c9cf21b40a2ca7a712838aa159302d54',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
    };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/c9cf21b40a2ca7a712838aa159302d54/invoke.js"></script>
```

### Ad Placement Locations

- **Header Ads**: Appear at the top of the page, below the navigation bar
- **Sidebar Ads**: Appear in the sidebar area of the page
- **Content Ads**: Appear within the main content area of the page
- **Footer Ads**: Appear at the bottom of the page, above the footer

## Customization

If you want to customize the appearance of the ad containers, you can modify the CSS in `public/css/ads.css`.

## Troubleshooting

If ads are not displaying correctly:

1. Make sure ads are enabled in the Ad Manager settings
2. Check that you've entered valid ad code for the placements
3. Verify that your ad network is functioning correctly
4. Check your browser's console for any JavaScript errors
5. Make sure your ad blocker is disabled for testing

## Support

If you need help with the Ad Manager, please contact the PhoenixPanel support team.