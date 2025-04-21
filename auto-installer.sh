#!/usr/bin/env bash

# PhoenixPanel One-Line Auto Installer
# This script downloads and runs the auto installer for PhoenixPanel

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Colors ---
RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'

# --- Helper Functions ---
print_info() {
    echo -e "${BLUE}[INFO]${RESET} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${RESET} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${RESET} $1" >&2
}

# --- Main Function ---
main() {
    print_info "PhoenixPanel One-Line Auto Installer"
    print_info "==================================="
    
    # Create temporary directory for downloads
    TEMP_DIR=$(mktemp -d)
    print_info "Created temporary directory: $TEMP_DIR"
    
    # Set default values for non-interactive mode
    export PHOENIXPANEL_NONINTERACTIVE=true
    export PHOENIXPANEL_DOMAIN="panel.example.com"
    export PHOENIXPANEL_IP="127.0.0.1"
    export PHOENIXPANEL_USE_DOMAIN=true
    export PHOENIXPANEL_ADMIN_EMAIL="admin@example.com"
    export PHOENIXPANEL_ADMIN_USERNAME="admin"
    export PHOENIXPANEL_ADMIN_PASSWORD=$(openssl rand -base64 12)
    
    # Display the default values
    print_info "Using default values:"
    print_info "Domain: ${CYAN}${PHOENIXPANEL_DOMAIN}${RESET}"
    print_info "Admin Email: ${CYAN}${PHOENIXPANEL_ADMIN_EMAIL}${RESET}"
    print_info "Admin Username: ${CYAN}${PHOENIXPANEL_ADMIN_USERNAME}${RESET}"
    print_info "Admin Password: ${YELLOW}${PHOENIXPANEL_ADMIN_PASSWORD}${RESET} (Please save this!)"
    
    # Download the auto installer
    print_info "Downloading auto installer..."
    curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/main/auto-installer/auto_install.sh -o "$TEMP_DIR/auto_install.sh"
    chmod +x "$TEMP_DIR/auto_install.sh"
    
    # Run the auto installer in non-interactive mode
    print_info "Running auto installer in non-interactive mode..."
    
    # Run the installer with environment variables explicitly passed
    env PHOENIXPANEL_NONINTERACTIVE=true \
        PHOENIXPANEL_DOMAIN="$PHOENIXPANEL_DOMAIN" \
        PHOENIXPANEL_IP="$PHOENIXPANEL_IP" \
        PHOENIXPANEL_USE_DOMAIN="$PHOENIXPANEL_USE_DOMAIN" \
        PHOENIXPANEL_ADMIN_EMAIL="$PHOENIXPANEL_ADMIN_EMAIL" \
        PHOENIXPANEL_ADMIN_USERNAME="$PHOENIXPANEL_ADMIN_USERNAME" \
        PHOENIXPANEL_ADMIN_PASSWORD="$PHOENIXPANEL_ADMIN_PASSWORD" \
        "$TEMP_DIR/auto_install.sh"
    
    # Clean up
    rm -rf "$TEMP_DIR"
    print_success "Installation process completed!"
}

# Run the main function
main