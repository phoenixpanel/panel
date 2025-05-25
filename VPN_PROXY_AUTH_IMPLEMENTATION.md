# VPN/Proxy Authentication Blocking Implementation

## Overview
This implementation adds user-friendly VPN/proxy blocking specifically for authentication flows (login, registration, and password reset) in PhoenixPanel.

## Files Created/Modified

### 1. New Middleware: `app/Http/Middleware/CheckVpnProxyAuth.php`
- Specialized middleware for authentication routes
- Uses `DisplayException` for user-friendly error messages instead of generic 403 responses
- Integrates with existing ProtectCord API service
- Fails gracefully when ProtectCord is unavailable
- Skips checks for local/private IP addresses

### 2. Updated HTTP Kernel: `app/Http/Kernel.php`
- Added import for `CheckVpnProxyAuth` middleware
- Registered middleware alias: `'check.vpn.proxy.auth' => CheckVpnProxyAuth::class`

### 3. Updated Authentication Routes: `routes/auth.php`
- Applied `check.vpn.proxy.auth` middleware to:
  - `POST /auth/login` (login endpoint)
  - `POST /auth/register` (registration endpoint)
  - `POST /auth/password/reset` (password reset endpoint)

### 4. Updated Language File: `resources/lang/en/auth.php`
- Added new translation key: `'vpn_proxy_blocked'`
- Message: "Access denied. For security reasons, login and registration are not allowed from VPN or proxy connections. Please disable your VPN/proxy and try again."

## How It Works

1. **Middleware Integration**: The `CheckVpnProxyAuth` middleware is applied only to authentication POST endpoints
2. **VPN/Proxy Detection**: Uses the existing ProtectCord API service to check if the user's IP is a VPN or proxy
3. **Error Handling**: When VPN/proxy is detected, throws a `DisplayException` with a user-friendly message
4. **Graceful Degradation**: If ProtectCord is disabled, not configured, or unavailable, the middleware allows the request to proceed
5. **Local IP Handling**: Skips VPN/proxy checks for local and private IP addresses

## Configuration Requirements

The middleware respects the existing ProtectCord configuration:
- `config('phoenixpanel.protectcord.enabled')` - Must be `true` to enable checking
- `config('phoenixpanel.protectcord.api_key')` - Must be configured with a valid API key

## Error Message Display

The authentication system uses React for the frontend, and errors are handled through:
- Laravel's `DisplayException` which gets converted to JSON responses
- The error message is localized using Laravel's translation system
- Frontend displays the error message to the user in a user-friendly format

## Security Benefits

1. **Targeted Protection**: Only blocks VPN/proxy access during authentication, not general browsing
2. **User-Friendly**: Provides clear instructions on how to resolve the issue
3. **Maintains Functionality**: Existing authentication flows remain unchanged
4. **Fail-Safe**: System continues to work even if VPN/proxy detection is unavailable

## Testing

To test the implementation:

1. **Enable ProtectCord**: Ensure `phoenixpanel.protectcord.enabled` is `true` and API key is configured
2. **Test with VPN**: Try to login/register while connected to a VPN
3. **Expected Result**: Should receive the user-friendly error message instead of a generic 403
4. **Test without VPN**: Normal authentication should work as expected
5. **Test with ProtectCord disabled**: Authentication should work normally

## Routes Protected

- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/password/reset` - Password reset (can auto-login users)

## Routes NOT Protected

- `GET /auth/login` - Login page display
- `GET /auth/register` - Registration page display
- `POST /auth/password` - Forgot password email sending
- `POST /auth/login/checkpoint` - 2FA verification
- `POST /auth/logout` - User logout

This selective protection ensures users can still access the authentication pages and request password resets, but prevents actual authentication from VPN/proxy connections.