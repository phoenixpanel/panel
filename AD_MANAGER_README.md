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

### Deployment Instructions
To fully resolve this issue:

1. Deploy the new migration file to your server
2. Run the migration command:
   ```
   php artisan migrate
   ```
3. Deploy the updated controller

After these steps, the Ad Manager should function correctly with all features available.

## Usage
1. Navigate to Admin > Settings > Ad Manager
2. Enable/disable ads using the toggle button
3. Enter ad codes for different sections of the site
4. Save changes

## Notes
- Ads will not be displayed in the admin area regardless of settings
- All ad code fields accept HTML and JavaScript