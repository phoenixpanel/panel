#!/bin/bash

# PhoenixPanel Update Script (Git Version)
# This script will backup your .env file, delete the panel directory,
# clone the latest version, and set up the new installation.

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display messages
function display() {
    echo -e "${GREEN}[PhoenixPanel]${NC} $1"
}

function warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

function error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   error "This script must be run as root" 
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    error "Git is not installed. Please install git and try again."
fi

# Determine panel directory
if [ -d "/var/www/pterodactyl" ]; then
    PANEL_DIR="/var/www/pterodactyl"
    PANEL_NAME="phoenixpanel"
    REPO_URL="https://github.com/phoenixpanel/panel.git"
elif [ -d "/var/www/phoenixpanel" ]; then
    PANEL_DIR="/var/www/phoenixpanel"
    PANEL_NAME="phoenixpanel"
    REPO_URL="https://github.com/phoenixpanel/panel.git"
else
    error "Could not find panel directory at /var/www/pterodactyl or /var/www/phoenixpanel"
fi

display "Found panel installation at $PANEL_DIR"
display "Will use repository: $REPO_URL"

# Check if .env exists
if [ ! -f "$PANEL_DIR/.env" ]; then
    error ".env file not found in $PANEL_DIR. Cannot proceed without backing up configuration."
fi

# Create backup directory
BACKUP_DIR="/root/panel_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
display "Created backup directory at $BACKUP_DIR"

# Backup .env file
cp $PANEL_DIR/.env $BACKUP_DIR/.env
if [ $? -ne 0 ]; then
    error "Failed to backup .env file"
fi
display "Backed up .env file to $BACKUP_DIR/.env"

# Backup storage directory if it exists
if [ -d "$PANEL_DIR/storage" ]; then
    display "Backing up storage directory..."
    cp -r $PANEL_DIR/storage $BACKUP_DIR/storage
    display "Storage directory backed up to $BACKUP_DIR/storage"
fi

# Ask for confirmation
warning "This script will delete the entire $PANEL_DIR directory and install the latest version."
warning "Your .env file has been backed up to $BACKUP_DIR/.env"
read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    display "Operation cancelled by user"
    exit 0
fi

# Delete panel directory
display "Deleting panel directory..."
rm -rf $PANEL_DIR
if [ $? -ne 0 ]; then
    error "Failed to delete panel directory"
fi
display "Panel directory deleted"

# Create new panel directory
mkdir -p $PANEL_DIR
cd $PANEL_DIR || error "Failed to create panel directory"

# Clone the repository
display "Cloning the latest version from GitHub..."
git clone $REPO_URL .
if [ $? -ne 0 ]; then
    error "Failed to clone the repository"
fi
display "Repository cloned successfully"

# Restore .env file from backup
display "Restoring .env file from backup..."
cp $BACKUP_DIR/.env $PANEL_DIR/.env
if [ $? -ne 0 ]; then
    error "Failed to restore .env file"
fi
display "Successfully restored .env file with your original database and application settings"

# Restore storage directory if it was backed up
if [ -d "$BACKUP_DIR/storage" ]; then
    display "Restoring storage directory..."
    rm -rf $PANEL_DIR/storage
    cp -r $BACKUP_DIR/storage $PANEL_DIR/storage
    display "Storage directory restored"
fi

# Install composer dependencies
display "Installing composer dependencies..."
cd $PANEL_DIR
composer install --no-dev --optimize-autoloader
if [ $? -ne 0 ]; then
    error "Failed to install composer dependencies"
fi
display "Composer dependencies installed"

# Clear cache
php artisan view:clear
php artisan config:clear

# Run database migrations
display "Running database migrations..."
php artisan migrate --force
if [ $? -ne 0 ]; then
    warning "Database migration failed. You may need to run migrations manually."
fi

# Doing yarn stuff

yarn
yarn install
yarn add strip-ansi

# building panel with yarn

yarn build:production

# Set permissions
display "Setting correct permissions..."
chown -R www-data:www-data $PANEL_DIR/*
find $PANEL_DIR -type f -exec chmod 644 {} \;
find $PANEL_DIR -type d -exec chmod 755 {} \;

# Make specific directories writable
chmod -R 755 $PANEL_DIR/storage/* $PANEL_DIR/bootstrap/cache/

display "Setting up queue worker..."
php artisan queue:restart

# Final message
display "Panel update completed successfully!"
display "Your old installation has been backed up to $BACKUP_DIR"
display "Please check your panel to ensure everything is working correctly."