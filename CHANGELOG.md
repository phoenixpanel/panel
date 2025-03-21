# Changelog
This file is a running track of new features and fixes to each version of the panel released starting with `v0.4.0`.

This project follows [Semantic Versioning](http://semver.org) guidelines.

## v1.11.10

### BREAKING

* Minimum PHP verion is now 8.2 due to Laravel upgrade!

### Fixed

* Update Laravel to address [CVE-2024-52301](https://github.com/advisories/GHSA-gv7v-rgg6-548h)

## v1.11.9

### Fixed

* Fixed issue with CI not pushing Docker image

## v1.11.8

### Fixed

* Fixed an issue where a `DELETE` request was used instead of a `POST`, potentially logging user passwords in plain text if they disable 2FA.

## v1.11.7

### Added

* Java 21 to Minecraft eggs

### Changed

* Updated Minecraft EULA link

### Fixed

* Fixed backups not ever being marked as completed (#5088)
* Fixed `.7z` files not being detected as a compressed file (#5016)

## v1.11.6

### Changed
* Better node ownership checks for internal backup endpoints
* Improved validation rules on `docker_image` fields to prevent invalid inputs

### Fixed

* Multiple XSS vulnerabilities in the admin area ([GHSA-384w-wffr-x63q](https://github.com/phoenixpanel/panel/security/advisories/GHSA-384w-wffr-x63q))

## v1.11.5
### Fixed
* Rust egg using the wrong Docker image, breaking Rust modding frameworks.

## v1.11.4
### Added
* Added support for the `server.queryport` option on the Rust egg.
* Added support for the Carbon modding framework to the Rust egg.

### Changed
* Upgraded to Laravel 10.
* Sensitive data is no longer shown in the CopyOnClick toast notification.

### Fixed
* Allow SVGs to be edited in the server's file manager.
* Properly validate the request body when creating a backup.
* Fixed issue with schedules running at the wrong time when the panel utilized a timezone with non-hour offsets (such as `Australia/Darwin`).
* Fixes the log directory when running the Panel in a container.
* Fixes the permission name used to check if a user has permission to read files/folders.
* Fixes the ability to unset a server's description through the client API.
* Fixed the MassActionBar on the server's file manager blocking elements below it, preventing them from being interacted with.

## v1.11.3
### Changed
* When updating a server's description through the client API, if no value is specified, the description will now remain unchanged.
* When installing the Panel for the first time, the queue driver will now all default to `redis` instead of `sync`.

### Fixed
* `php artisan p:environment:mail` not correctly setting the right variable for `MAIL_FROM_ADDRESS`.
* Fixed the conflict state rendering on the UI for a server showing `reinstall_failed` as `restoring_backup`.
* Fixed the unknown column `uuid` error when jobs fail, causing them not to get stored correctly.
* Fixed the server task endpoints in the client API not allowing `sequence_id` and `continue_on_failure` to be set.

## v1.11.2
### Changed
* Telemetry no longer sends a map of Egg and Nest UUIDs to the number of servers using them.
* Increased the timeout for the decompress files endpoint in the client API from 15 seconds to 15 minutes.

### Fixed
* Fixed Panel Docker image having a `v` prefix in the version displayed in the admin area.
* Fixed emails using the wrong queue name, causing them to not be sent.
* Fixed the settings keys used for configuring SMTP settings, causing settings to not save properly.
* Fixed the `MAIL_EHLO_DOMAIN` environment variable not being properly backwards compatible with the old `SERVER_NAME` variable.

## v1.11.1
### Fixed
* Fixed Panel Docker image showing `canary` as it's version.

## v1.11.0
### Changed (since 1.10.4)
* Changed minimum PHP version requirement from `7.4` to `8.0`.
* Upgraded from Laravel 8 to Laravel 9.
* This release requires Wings v1.11.x in order for Server Transfers to work.
* `MB` byte suffixes are now displayed as `MiB` to more accurately reflect the actual value.
* Server re-installation failures are tracked independently of the initial installation process.

### Fixed (since 1.10.4)
* Node maintenance mode now properly blocks access to servers.
* Fixed the length validation on the Minecraft Forge egg.
* Fixed the password in the JDBC string not being properly URL encoded.
* Fixed an issue where Wings would throw a validation error while attempting to upload activity logs.
* Properly handle a missing `Content-Length` header in the response from the daemon.
* Ensure activity log properties are always returned as an object instead of an empty array.

### Added (since 1.10.4)
* Added the `server:settings.description` activity log event for when a server description is changed.
* Added the ability to cancel file uploads in the file manager for a server.
* Added a telemetry service to collect anonymous metrics from the panel, this feature is *enabled* by default and can be toggled using the `PTERODACTYL_TELEMETRY_ENABLED` environment variable.

## v1.11.0-rc.2
### Changed
* `MB` byte suffixes are now displayed as `MiB` to more accurately reflect the actual value.
* Server re-installation failures are tracked independently of the initial installation process.

### Fixed
* Properly handle a missing `Content-Length` header in the response from the daemon.
* Ensure activity log properties are always returned as an object instead of an empty array.

### Added
* Added the `server:settings.description` activity log event for when a server description is changed.
* Added the ability to cancel file uploads in the file manager for a server.
* Added a telemetry service to collect anonymous metrics from the panel, this feature is disabled by default and can be toggled using the `PTERODACTYL_TELEMETRY_ENABLED` environment variable.

## v1.11.0-rc.1
### Changed
* Changed minimum PHP version requirement from `7.4` to `8.0`.
* Upgraded from Laravel 8 to Laravel 9.
* This release requires Wings v1.11.x in order for Server Transfers to work.

### Fixed
* Node maintenance mode now properly blocks access to servers.
* Fixed the length validation on the Minecraft Forge egg.
* Fixed the password in the JDBC string not being properly URL encoded.
* Fixed an issue where Wings would throw a validation error while attempting to upload activity logs.

## v1.10.4
### Fixed
* Fixed an issue where subusers could be given permissions that are not actually registered or used.
* Fixed an issue where node FQDNs could not just be IP addresses.

### Changed
* Change maximum number of API keys per user from `10` to `25`.
* Change byte unit prefix from `B` to `iB` to better reflect our usage of base 2 (multiples of 1024).

## v1.10.3
### Fixed
* S3 Backup driver now supports Cloudflare R2.
* Node FQDNs can now be used with AAAA records with no A records present.
* Server transfers can no longer be initiated if the server is being installed, transferred, or restoring a backup.
* Fixed an issue relating to the use of arrays in the `config_files` field with eggs.
* Fixed `oom_disabled` not being mapped in the Application API when creating a new server.

### Added
* File manager now supports selecting multiple files for upload (when using the upload button).
* Added a configuration option for specifying the S3 storage class for backups.

### Changed
* Servers will now show the current uptime when the server is starting rather than only showing when the server is marked as online.

## v1.10.2
### Fixed
* Fixes a rendering issue with egg descriptions in the admin area
* Fixes the page title on the SSH Keys page

### Changed
* Additional validation rules will now show a toggle switch rather than an input when editing server variables
* The eggs endpoint will now always return an empty JSON object for the `config_files` field, even if the field is completely empty

### Added
* Adds a `Force Outgoing IP` option for eggs that can be used to ensure servers making outgoing connections use their allocation IP rather than the node's primary ip
* Adds options to configure sending of email (re)install notifications
* Add an option to configure the part size for backups uploaded to S3

## v1.10.1
### Fixed
* Fixes a surprise `clock()` function that was used for debugging and should not have made it into the release. This was causing activity events to not properly sync between the Panel and Wings.

## v1.10.0
### Fixed
* Fixes improper cache key naming on the frontend causing server activity logs to be duplicated across server page views.
* Fixes overflow issues on dialogs when the internal content is too long.
* Fixes spinner overlay on console improperly taking up the entire page making it impossible to use navigation controls.
* Fixes 2FA QR code background being too dark for some phones to properly scan.
* File manager now properly displays an error message if a user attempts to upload a folder rather than files.
* Fixes the "Create Directory" dialog persisting the previously entered value when it is re-opened.

### Changed
* IP addresses in activity logs are now always displayed to administrators, regardless of if they own the server or not.
* Scroll down indicator on the console has been changed to a down arrow to be clearer.
* Docker builds have been updated to use `PHP 8.1`.
* Recaptcha validation domain is now configurable using the `RECAPTCHA_DOMAIN` environment variable.
* Drag and drop overlay on the file manager has been tweaked to be slightly more consistent with the frontend style and be a little easier to read.

### Added
* Adds support for the `user_uuid` claim on all generated JWTs which allows Wings to properly identify the user performing each action.
* Adds support for recieving external activity log events from Wings instances (power state, commands, SFTP, and uploads).
* Adds support for tracking failed password-based SFTP logins.
* Server name and description are now passed along to Wings making them available in egg variables for parsing and including.
* Adds support for displaying all active file uploads in the file manager.

## v1.9.2
### Fixed
* Fixes rouding in sidebar of CPU usage graph that was causing an excessive number of zeros to be rendered.
* Fixes the Java Version selector modal having the wrong default value selected initially.
* Fixes console rendering in Safari that was causing the console to resize excessively and graphs to overlay content.
* Fixes missing "Starting"/"Stopping" status display in the server uptime block.
* Fixes incorrect formatting of activity log when viewing certain file actions.

### Changed
* Updated the UI for the two-step authorization setup on accounts to use new Dialog UI and provide better clarity to new users.

### Added
* Added missing `<DOCTYPE html>` tag to template output to avoid entering quirks mode in browsers.
* Added password requirement when enabling TOTP on an account.

## v1.9.1
### Fixed
* Fixes missing "Click to Copy" for server address on the console data blocks.
* Fixes data points on the graphs not being properly rounded to two decimal places.
* Returns byte formatting logic to use `1024` as the base value, rather than `1000`.
* Fixes permission error occurring when a server is marked as installing and an admin navigates to the console screen.
* Fixes improper display of install/transfer warning on the server console page.
* Fixes permission matching for the server settings page to correctly allow access when a user has _any_ of the needed permissions.

### Changed
* Moves the server data blocks to the right-hand side of the console, rather than the left.
* Rather than defaulting graph values at `0` when resetting or refreshing the page, their values are now hidden entirely.
* **[security]** Hides IP addresses from all activity log entries that are not directly associated with the currently signed in user.

### Added
* Adds the current resource limits for a server next to each data block on the console screen.

## v1.9.0
### Added
* Added support for using Tailwind classes inside components using `className={}` rather than having to use `twin.macro` with the `css={}` prop.
* Added HeadlessUI and Heroicons packages.
* Added new `Tooltip.tsx` component to support displaying tooltips within the Panel.
* Adds a new activity log view for both user accounts and individual servers. This builds upon data collected in previous releases.
* Added a new column `api_key_id` to the `activity_logs` table to indicate if the user performed the action while using an API key.
* Adds initial support for language translations on the front-end. The underlying implementation details are working, however work has not yet begun on actually translating all of the strings yet. Expect this to continue in future releases.
* Improved accessibility for navigation icons by adding a tooltip on hover to indicate what each one does.
* Adds logging for API keys that are blocked from performing an API action due to IP address limiting.
* Adds support for `?filter[description]=foo` when querying servers on both the client and application API.

### Changed
* Updated how release assets are generated to perform more logical bundle splitting. This should help reduce the amount of data users have to download at once in order to render the UI.
* Upgraded From TailwindCSS 2 to 3 — for most people this should have minimal if any impact.
* Chart.js updated from v2 to v3.
* Reduced the number of custom colors in use — by default we now use Tailwind's default color pallet, with the exception of a custom gray scheme.
* **[deprecated]** The use of `neutral` and `primary` have been deprecated in class names, prefer `gray` and `blue` respectively.
* Begins the process of dropping the use of Gravatars for user avatars and replaces them with dynamically generated SVG images.
* Improved front-end route definitions to make it easier for external modifications to inject their routes and components into the codebase without having to modify as many core files.
* Redesigned the server console screen to better display data users might be looking for, and increase the height of the console itself.
* Merged the two network data graphs into a single dual-line graph to better display incoming and outgoing data volumes.
* Updated all byte formatting logic to use `1000` as the divisor rather than `1024` to be more consistent with what users most likely expect.
* Changed the underlying `eslint` rules applied to the front-end codebase to simplify them dramatically. We now utilize `prettier` in combination with some basic default rulesets to make it easier to understand the expected formatting.

### Fixed
* Fixes a bug causing a 404 error when attempting to delete a database from a server in the admin control panel.
* Fixes console input auto-capitalizing and auto-correcting when entering text on some mobile devices.
* Fixes SES service configuration using a hard-coded `us-east-1` region.
* Fixes a bug causing a 404 error when attempting to delete an SSH key from your account when the SHA256 hash includes a slash.
* Fixes mobile keyboards automatically attempting to capitalize and spellcheck typing on the server console.
* Fixes improper support for IP address CIDR ranges when creating API keys for the client area.
* Fixes a bug preventing additional included details from being returned from the application API when utilizing a client API key as an administrator.

## v1.8.1
### Fixed
* Fixes a bug causing mounts to return a 404 error when adding them to a server.
* Fixes a bug causing the Egg Image dropdown to not display properly when creating a new server.
* Fixes a bug causing an error when attemping to create a new server via the API.

## v1.8.0
**Important:** this version updates the `version` field on generated Eggs to be `PTDL_v2` due to formatting changes. This
should be completely seamless for most installations as the Panel is able to convert between the two. Custom solutions
using these eggs should be updated to account for the new format.

This release also changes API key behavior — "client" keys belonging to admin users can now be used to access
the `/api/application` endpoints in their entirety. Existing "application" keys generated in the admin area should
be considered deprecated, but will continue to work. Application keys _will not_ work with the client API.

### Fixed
* Schedules are no longer run when a server is suspended or marked as installing.
* The remote field when creating a database is no longer limited to an IP address and `%` wildcard — all expected MySQL remote host values are allowed.
* Allocations cannot be deleted from a server by a user if the server is configured with an `allocation_limit` set to `0`.
* The Java Version modal no longer shows a dropdown and update option to users that do not have permission to make those changes.
* The Java Version modal now correctly returns only the images available to the server's selected Egg.
* Fixes leading and trailing spaces being removed from variable values on file manager endpoints, causing errors when trying to perform actions against certain files and folders.

### Changed
* Forces HTTPS on URLs when the `APP_URL` value is set and includes `https://` within the URL. This addresses proxy misconfiguration issues that would cause URLs to be generated incorrectly.
* Lowers the default timeout values for requests to Wings instances from 10 seconds to 5 seconds.
* Additional permissions (`CREATE TEMPORARY TABLES`, `CREATE VIEW`, `SHOW VIEW`, `EVENT`, and `TRIGGER`) are granted to users when creating new databases for servers.
* development: removed Laravel Debugbar in favor of Clockwork for debugging.
* The 2FA input field when logging in is now correctly identified as `one-time-password` to help browser autofill capabilities.
* Changed API authentication mechanisms to make use of Laravel Sanctum to significantly clean up our internal handling of sessions.
* API keys generated by the system now set a prefix to identify them as PhoenixPanel API keys, and if they are client or application keys. This prefix looks like `ptlc_` for client keys, and `ptla_` for application keys. Existing API keys are unaffected by this change.

### Added
* Added support for PHP 8.1 in addition to PHP 8.0 and 7.4.
* Adds more support for catching potential PID exhaustion errors in different games.
* It is now possible to create a new node on the Panel using an artisan command.
* A new cron cheatsheet has been added which appears when creating a schedule.
* Adds support for filtering the `/api/application/nodes/:id/allocations` endpoint using `?filter[server_id]=0` to only return allocations that are not currently assigned to a server on that node.
* Adds support for naming docker image values in an Egg to improve front-end display capabilities.
* Adds command to return the configuration for a specific node in both YAML and JSON format (`php artisan p:node:configuration`).
* Adds command to return a list of all nodes available on the Panel in both table and JSON format (`php artisan p:node:list`).
* Adds server network (inbound/outbound) usage graphs to the console screen.
* Adds support for configuring CORS on the API by setting the `APP_CORS_ALLOWED_ORIGINS=example.com,dashboard.example.com` environment variable. By default all instances are configured with this set to `*` which allows any origin.
* Adds proper activity logging for the following areas of the Panel: authentication, user account modifications, server modification. This is an initial test implementation before further roll-out in the software. Events are logged into the database but are not currently exposed in the UI — they will be displayed in a future update.

### Removed
* Removes Google Analytics from the front end code.
* Removes multiple middleware that were previously used for configuring API access and controlling model fetching. This has all been replaced with Laravel Sanctum and standard Laravel API tooling. This should make codebase discovery significantly more simple.
* **DEPRECATED**: The use of `PhoenixPanel\Models\AuditLog` is deprecated and all references to this model have been removed from the codebase. In the next major release this model and table will be fully dropped.

## v1.7.0
### Fixed
* Fixes typo in message shown to user when deleting a database.
* Fixes formatting of IPv6 addresses when displaying allocations to users.
* Fixes an exception thrown while trying to return error messages from API endpoints that inproperly masked the true underlying error.
* Fixes SSL certificate path generation for Let's Encrypt by ensuring they are always transformed to lowercase.
* Removes duplicate entries when creating a nested folder in the file manager.
* Fixes missing validation of Egg Author email addresses during the setup process that could cause unexpected failures later on.
* Fixes font rendering issues of the console on Firefox due to an outdated version of xterm.js being used.
* Fixes display overlap issues of the two-factor configuration form in a user's settings.
* **[security]** When authenticating using an API key a user session is now only persisted for the duration of the request before being destroyed.

### Changed
* CPU graph changed to show the maximum amount of CPU available to a server to better match how the memory graph is displayed.

### Added
* Adds support for `DB_PORT` environment variable in the Docker enterpoint for the Panel image.
* Adds suport for ARM environments in the Docker image.
* Adds a new warning modal for Steam servers shown when an invalid Game Server Login Token (GSL Token) is detected.
* Adds a new warning modal for Steam servers shown when the installation process runs out of available disk space.
* Adds a new warning modal for Minecraft servers shown when a server exceeds the maximum number of child processes.
* Adds support for displaying certain server variable fields as a checkbox when they're detected as using `boolean` or `in:0,1` validation rules.
* Adds support for Pug and Jade in the file editor.
* Adds an entry to the `robots.txt` file to correctly disallow all bot indexing.


## v1.6.6
### Fixed
* **[security]** Fixes a CSRF vulnerability for both the administrative test email endpoint and node auto-deployment token generation endpoint. [GHSA-wwgq-9jhf-qgw6](https://github.com/pterodactyl/panel/security/advisories/GHSA-wwgq-9jhf-qgw6)

### Changed
* Updates Minecraft eggs to include latest Java 17 yolk by default.

## v1.6.5
### Fixed
* Fixes broken application API endpoints due to changes introduced with session management in 1.6.4.

## v1.6.4
_This release should not be used, please use `1.6.5`. It has been pulled from our releases._

### Fixed
* Fixes a session management bug that would cause a user who signs out of one browser to be unintentionally logged out of other browser sessions when using the client API.

## v1.6.3
### Fixed
* **[Security]** Changes logout endpoint to be a POST request with CSRF-token validation to prevent a malicious actor from triggering a user logout.
* Fixes Wings receiving the wrong server suspension state when syncing servers.

### Added
* Adds additional throttling to login and password reset endpoints.
* Adds server uptime display when viewing a server console.

## v1.6.2
### Fixed
* **[Security]** Fixes an authentication bypass vulerability that could allow a malicious actor to login as another user in the Panel without knowing that user's email or password.

## v1.6.1
### Fixed
* Fixes server build modifications not being properly persisted to the database when edited.
* Correctly exposes the `oom_disabled` field in the `build` limits block for a server build so that Wings can pick it up.
* 
## v1.6.0
### Fixed
* Fixes array merging logic for server transfers that would cause a 500 error to occur in some scenarios.
* Fixes user password updates not correctly logging the user out and returning a failure message even upon successful update.
* Fixes the count of used backups when browsing a paginated backup list for a server.
* Fixes an error being triggered when API endpoints are called with no `User-Agent` header and an audit log is generated for the action.
* Fixes state management on the frontend not properly resetting the loading indicator when adding subusers to a server.
* Fixes extraneous API calls being made to Wings for the server file listing when not on a file manager screen.

### Added
* Adds foreign key relationship on the `mount_node`, `mount_server` and `egg_mount` tables.
* Adds environment variable `PER_SCHEDULE_TASK_LIMIT` to allow manual overrides for the number of tasks that can exist on a single schedule. This is currently defaulted to `10`.
* OOM killer can now be configured at the time of server creation.

### Changed
* Server updates are not dependent on a successful call to Wings occurring — if the API call fails internally the error will be logged but the server update will still be persisted.

### Removed
* Removed `WingsServerRepository::update()` function — if you were previously using this to modify server elements on Wings please replace calls to it with `::sync()` after updating Wings.

## v1.5.1
### Fixed
* Fixes Docker image 404ing instead of being able to access the Panel.
* Fixes Java version feature being only loaded when the `eula` feature is specified.
* Fixes `php artisan p:upgrade` not forcing and seeding while running migrations.
* Fixes spinner overlays overlapping on the server console page.
* Fixes Wings being unable to update backup statuses.

## v1.5.0
### Fixed
* Fixes deleting a locked backup that has also been marked as failed to allow deletion rather than returning an error about being locked.
* Fixes server creation process not correctly sending `start_on_completion` to Wings instance.
* Fixes `z-index` on file mass delete modal so it is displayed on top of all elements, rather than hidden under some.
* Supports re-sending requests to the Panel API for backups that are currently marked as failed, allowing a previously failed backup to be marked as successful.
* Minor updates to multiple default eggs for improved error handling and more accurate field-level validation.

### Updated
* Updates help text for CPU limiting when creating a new server to properly indicate virtual threads are included, rather than only physical threads.
* Updates all of the default eggs shipped with the Panel to reference new [`ghcr.io` yolks repository](https://github.com/phoenixpanel/yolks).
* When adding 2FA to an account the key used to generate the token is now displayed to the user allowing them to manually input into their app if necessary.

### Added
* Adds SSL/TLS options for MySQL and Redis in line with most recent Laravel updates.
* New users created for server MySQL instances will now have the correct permissions for creating foreign keys on tables.
* Adds new automatic popup feature to allow users to quickly update their Minecraft servers to the latest Java® eggs as necessary if unsupported versions are detected.

### Removed
* Removes legacy `userInteraction` key from eggs which was unused.

## v1.4.2
### Fixed
* Fixes logic to disallow creating a backup schedule if the server's backup limit is set to 0.
* Fixes bug preventing a database host from being updated if the linked node is set to "none".
* Fixes files and menus under the "Mass Actions Bar" being unclickable when it is visible.
* Fixes issues with the Teamspeak and Mumble eggs causing installs to fail.
* Fixes automated query to avoid pruning backups that are still running unintentionally.
* Fixes "Delete Server" confirmation modal on the admin screen to actually show up when deleting rather than immediately deleting the server.

### Added
* Adds support for locking individual server backups to prevent deletion by users or automated backup processes.
* List of files to be deleted is now shown on the delete file confirmation modal.
* Adds support for using `IF` statements in database queries when a database user is created through the Panel.
* Adds support for using a custom mailgun API endpoint rather than only the US based endpoint.
* Adds CPU limit display next to the current CPU usage to match disk and memory usage reporting.
* Adds a "Scroll to Bottom" helper element to the server console when not scrolled to the bottom currently.
* Adds support for querying the API for servers by using the `uuidShort` field rather than only the `uuid` field.

### Changed
* Updates codebase to use TypeScript 4.
* **[security]**: removes the external dependency for loading QRCode images. They're now generated directly on the frontend using JavaScript.

## v1.4.1
### Added
* Adds support for only running a schedule if the server is currently in an online state.
* Adds support for ignoring errors during task execution and continuing on to the next item in the sequence. For example, continuing to a server restart even if sending a command beforehand failed.
* Adds the ability to specify the group to use for file permissions when using the `p:upgrade` command.
* Adds the ability to manually run a schedule even if it is currently disabled.

## v1.4.0
### Fixed
* Removes the use of tagging when storing server resource usage in the cache. This addresses errors encountered when using the `file` driver.
* Fixes Wings response handling if Wings returns an error response with a 200-level status code that would improperly be passed back to the client as a successful request.
* Fixes use of JSON specific functions in SQL queries to better support MariaDB users.
* Fixes a migration that could fail on some MySQL/MariaDB setups when trying to encrypt node token values.

### Changed
* Increases the maximum length allowed for a server name using the Rust egg.
* Updated server resource utilization API call to Wings to use new API response format used by `Wings@1.4.0`.

## v1.3.2
### Fixed
* Fixes self-upgrade incorrectly executing the command to un-tar downloaded archives.
* Fixes the checkbox to delete all files when restoring a backup not actually passing that along in the API call. Files will now properly be deleted when restoring if selected.
* Fixes some keybindings not working correctly in the server console on Windows machines.
* Fixes mobile UI incorrectly squishing the Docker image selector on the server settings page.
* Fixes recovery tokens not having a `created_at` value set on them properly when they are created.
* Fixes flawed migration that would not correctly set the month value into schedule crons.
* Fixes incorrect mounting for Docker compose file that would cause error logs to be missing.

### Changed
* Server resource lookups are now cached on the Panel for 20 seconds at a time to reduce the load from multiple clients requesting the same server's stats.
* Bungeecord egg no longer force-enables the query listener.
* Adds page to the dashboard URL to allow easy loading of a specific pagination page rather than resetting back to the first page when refreshing.
* All application API endpoints now correctly support the `?per_page=N` query parameter to specify how many resources to return at once.

## v1.3.1
### Fixed
* Fixes the Rust egg not properly seeding during the upgrade & installation process.
* Fixes backups not being downloadable via the frontend.
* Fixes backup listing showing the wrong number of existing backups based on the current page you're on.

## v1.3.0
### Fixed
* Fixes administrator "Other Servers" toggle being persisted wrongly when signing out and signing into a non-administrator account on the server dashboard.
* Fixes composer failing to run properly in local environments where there is no database connection available once configured.
* Fixes SQL exception caused by the Panel attempting to store null values in the database.
* Fixes validation errors caused by improper defaults when trying to edit system settings in the admin area.
* Fixes console overflow when using smaller-than-default font sizes in Firefox.
* Fixes console text input field having a white background when manually building new assets from the release build due to a missing `babel-macros` definition file.
* Fixes database improperly using a signed `smallint` field rather than an unsigned field which restricted SFTP ports to 32767 or less.
* Fixes server console resize handler to no longer encounter an exception at random that breaks the entire UI.
* Fixes unhandled error caused by entering an invalid IP address or FQDN when creating a new node allocation.
* Fixes unhandled error when Wings would fetch a server configuration from the Panel that uses an Egg with invalid JSON data for the configuration fields.
* Fixes email not being sent to a user when their server is done installing.

### Added
* Adds support for automatically copying SFTP connection details when clicking into the text field.
* Messaging about a node not having any allocations available for deployment has been adjusted to be more understandable by users.
* Adds automated self-upgrade process for PhoenixPanel Panel once this version is installed on servers. This allows users to update by using a single command.
* Adds support for specifying a month when creating or modifying a server schedule.
* Adds support for restoring backups (including those in S3 buckets) to a server and optionally deleting all existing files when doing so.
* Adds underlying support for audit logging on servers. Currently this is only used by some internal functionality but will be slowly expanded as time permits to allow more robust logging.
* Adds logic to automatically reset failed server states when Wings is rebooted. This will kick servers out of "installing" and "restoring from backup" states automatically.

### Changed
* Updated to `Laravel 8` and bumped minimum PHP version from `7.3` to `7.4` with PHP `8.0` being the recommended.
* Server state is now stored in a single `status` column within the database rather than multiple different `tinyint` columns.

## v1.2.2
### Fixed
* **[security]** Fixes authentication bypass allowing a user to take control of specific server actions such as executing schedules, rotating database passwords, and viewing or deleting a backup.

## v1.2.1
### Fixed
* Fixes URL-encoding of filenames when working in the filemanager to fix issues when moving, renaming, or deleting files.
* Fixes URL-encoding of email addresses when requesting a password reset.

### Added
* Adds the ability for users to select a base Java Docker image for most Minecraft specific eggs shipped as defaults.

## v1.2.0
### Fixed
* Fixes newest backup being deleted when creating a new one using the schedule tasks, rather than the oldest backup.
* Fixes multiple encoding issues when handling file names in the manager.
* Fixes database password not properly being copied to the clipboard when clicked.
* Fixes failed transfers unintentionally locking a server into a failed state and not properly releasing allocations that were reserved.
* Fixes error box on server pages having an oval refresh button rather than a perfect circle.
* Fixes a bunch of errors and usage issues relating to backups especially when uploading to S3-based systems.
* Fixes HMR breaking navigation in development modes on the frontend.

### Changed
* Updated Paper egg to default to Java 11 as the base docker image.
* Removes the file mode display from the File Manager row listing.
* Updated input UI elements to have thicker borders and more consistent highlighting when
