# Pterodactyl Panel Installation Guide (Ubuntu)

This guide documents the commands used to install the Pterodactyl panel on Ubuntu.

## Prerequisites

*   PHP (>= 8.2) and Composer installed.
*   Node.js (>= 14) and Yarn installed.
*   MySQL server running.
*   Database and user created (e.g., `panel` database, `phoenix` user).
*   Redis server running (optional, for queue/cache).
*   `curl` and `unzip` installed (`sudo apt update && sudo apt install curl unzip`).

## Installation Steps

```bash
# Navigate to the panel directory
cd /var/www/phoenixpanel

# 1. Install PHP Dependencies (Production)
composer install --no-dev --optimize-autoloader

# 2. Install Node.js Dependencies (Including Dev for build tools)
yarn install

# 3. Ensure .env file exists and is configured
# (Skipped copying .env.example as requested, assuming .env is pre-configured)

# 4. Generate Application Key
php artisan key:generate --force

# 5. Clear Configuration Cache
php artisan config:clear

# 6. Run Database Migrations
php artisan migrate --force

# 7. Download Official Egg Files
mkdir -p database/Seeders/eggs/minecraft database/Seeders/eggs/source-engine database/Seeders/eggs/voice-servers database/Seeders/eggs/rust
curl -L -o database/Seeders/eggs/minecraft/egg-bungeecord.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/minecraft/egg-bungeecord.json
curl -L -o database/Seeders/eggs/minecraft/egg-forge-minecraft.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/minecraft/egg-forge-minecraft.json
curl -L -o database/Seeders/eggs/minecraft/egg-paper.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/minecraft/egg-paper.json
curl -L -o database/Seeders/eggs/minecraft/egg-sponge--sponge-vanilla.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/minecraft/egg-sponge--sponge-vanilla.json
curl -L -o database/Seeders/eggs/minecraft/egg-vanilla-minecraft.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/minecraft/egg-vanilla-minecraft.json
curl -L -o database/Seeders/eggs/source-engine/egg-ark--survival-evolved.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-ark--survival-evolved.json
curl -L -o database/Seeders/eggs/source-engine/egg-counter--strike--global-offensive.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-counter--strike--global-offensive.json
curl -L -o database/Seeders/eggs/source-engine/egg-custom-source-engine-game.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-custom-source-engine-game.json
curl -L -o database/Seeders/eggs/source-engine/egg-garrys-mod.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-garrys-mod.json
curl -L -o database/Seeders/eggs/source-engine/egg-insurgency.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-insurgency.json
curl -L -o database/Seeders/eggs/source-engine/egg-team-fortress2.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/source-engine/egg-team-fortress2.json
curl -L -o database/Seeders/eggs/voice-servers/egg-mumble-server.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/voice-servers/egg-mumble-server.json
curl -L -o database/Seeders/eggs/voice-servers/egg-teamspeak3-server.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/voice-servers/egg-teamspeak3-server.json
curl -L -o database/Seeders/eggs/rust/egg-rust.json https://raw.githubusercontent.com/pterodactyl/panel/master/database/Seeders/eggs/rust/egg-rust.json

# 8. Seed Database Eggs
php artisan db:seed --class=EggSeeder --force

# 9. Create Initial Admin User (Replace credentials if needed)
# Note: Using previously generated credentials as requested.
php artisan p:user:make --email=admin@localhost --username=admin_nuGaZk --name-first=Admin --name-last=User --password='ATrFLoIeGdT/u8qumCTDvgnIJErIE2n5' --admin=1 --no-interaction

# 10. Build Frontend Assets
# (Ensure package.json scripts are compatible with Linux and Node version)
yarn run build:production

# 11. Set File Permissions (Adjust www-data if needed)
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache