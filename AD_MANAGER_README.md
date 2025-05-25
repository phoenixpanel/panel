# Ad Manager Module

## Overview
The Ad Manager module allows administrators to configure and manage advertisements displayed on the site. It provides options to enable/disable ads and set ad codes for different sections of the site.

## Database Schema
The Ad Manager uses the `ad_settings` table with the following structure:

- `id` - Primary key
- `enabled` - Boolean flag to enable/disable all ads
- `header_ad_code` - Text field for header advertisement code
- `sidebar_ad_code` - Text field for sidebar advertisement code
- `footer_ad_code` - Text field for footer advertisement code
- `content_ad_code` - Text field for in-content advertisement code
- `created_at` - Timestamp for record creation
- `updated_at` - Timestamp for record updates

## Issue Resolution
### Issue 1: Missing Database Columns
An error occurred because the database table was missing some of the required columns. The error message was:
```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'header_ad_code' in 'SET'
```

#### Solution
Two fixes were implemented:

1. **Migration Fix**: A new migration file was created to add the missing columns:
   - `database/migrations/2025_04_21_053000_add_missing_columns_to_ad_settings_table.php`

2. **Controller Fix**: The controller was updated to handle cases where columns might be missing:
   - It now checks which columns exist in the database before attempting to save data
   - It provides a fallback to save only the enabled status if other columns don't exist
   - It displays a warning message when some settings couldn't be saved

### Issue 2: InjectAdsMiddleware Header Method Error
An error occurred in the InjectAdsMiddleware when checking if a response is HTML:
```
Too few arguments to function Illuminate\Http\Response::header(), 1 passed in /var/www/pterodactyl/app/Http/Middleware/InjectAdsMiddleware.php on line 57 and at least 2 expected
```

#### Solution
The middleware was updated to use the correct method for accessing headers:
- Changed from using `$response->header('Content-Type')` to `$response->headers->get('Content-Type')`
- Added additional checks to prevent errors when the response doesn't have the expected methods

### Issue 3: Missing Spatie Ignition Interface
An error occurred because the application was trying to use interfaces from the Spatie Ignition package that weren't available:
```
Interface "Spatie\Ignition\Contracts\ProvidesSolution" not found
```

#### Solution
The exception and solution classes were updated to remove dependencies on the Spatie Ignition package:
1. Modified `ManifestDoesNotExistException` to not implement the Spatie interface
2. Updated `ManifestDoesNotExistSolution` to be a standard class without external dependencies
3. Maintained the same functionality but with native PHP implementations

### Issue 4: Asset Manifest File Error
An error occurred in the AssetHashService when the manifest file doesn't exist:
```
(View: /var/www/pterodactyl/resources/views/templates/wrapper.blade.php)
```

#### Solution
The AssetHashService was completely rewritten to match Pterodactyl's implementation:
1. Simplified the code structure to be more robust and maintainable
2. Removed all exception throwing in favor of graceful fallbacks
3. Implemented a more reliable manifest loading mechanism with multiple validation checks
4. Returns the original resource URL if the manifest is missing or invalid
5. Returns an empty integrity string if the manifest is missing or invalid
6. Simplified the ManifestDoesNotExistException and ManifestDoesNotExistSolution classes
7. This allows the application to continue functioning even when assets haven't been built

### Deployment Instructions
To fully resolve all issues:

1. Deploy the following updated files to your server:
   - `database/migrations/2025_04_21_053000_add_missing_columns_to_ad_settings_table.php` (new file)
   - `app/Http/Controllers/Admin/Settings/AdManagerController.php` (updated)
   - `app/Http/Middleware/InjectAdsMiddleware.php` (updated)
   - `app/Exceptions/ManifestDoesNotExistException.php` (updated)
   - `app/Exceptions/Solutions/ManifestDoesNotExistSolution.php` (updated)
   - `app/Services/Helpers/AssetHashService.php` (updated)

2. Run the migration command to add the missing columns:
   ```
   php artisan migrate
   ```

3. Clear the application cache:
   ```
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

4. Restart the web server (if needed):
   ```
   systemctl restart nginx  # or apache2, depending on your setup
   ```

## Usage
1. Navigate to Admin > Settings > Ad Manager
2. Enable/disable ads using the toggle button
3. Enter ad codes for different sections of the site
4. Save changes

## Notes
- Ads will not be displayed in the admin area regardless of settings
- All ad code fields accept HTML and JavaScript