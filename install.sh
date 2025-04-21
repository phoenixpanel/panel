#!/usr/bin/env bash

# PhoenixPanel Modular Installer for Linux
# This script downloads and executes modular installation scripts for PhoenixPanel

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
GITHUB_REPO="phoenixpanel/panel"
SCRIPTS_REPO="phoenixpanel/panel"  # Repository containing installation scripts
SCRIPTS_BRANCH="main"              # Branch containing installation scripts
INSTALL_DIR="/var/www/phoenixpanel"
PHP_VERSION="8.3"
NODE_VERSION="16"

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

# Function to prompt the user for input
prompt_user() {
    local prompt_message=$1
    local user_input
    read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message}")" user_input
    echo "$user_input"
}

# Function to prompt yes/no
prompt_yes_no() {
    local prompt_message=$1
    local default=${2:-y} # Default to yes if not specified
    local answer

    while true; do
        read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message} [y/N]: ")" answer
        answer=${answer:-$default} # Use default if empty
        case $answer in
            [Yy]* ) return 0;; # Yes
            [Nn]* ) return 1;; # No
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# --- Root Check ---
check_root() {
    # Check for root on Linux
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root or with sudo."
        exit 1
    fi
}

# --- Download Installation Script ---
download_script() {
    local script_name=$1
    local output_path=$2
    
    print_info "Downloading ${script_name}..."
    
    # For local development, you can use local files instead of downloading
    # If the script exists locally, use it
    if [ -f "./auto-installer/${script_name}" ]; then
        print_info "Using local ${script_name}"
        cp "./auto-installer/${script_name}" "${output_path}"
    else
        # Otherwise download from GitHub
        curl -sSL "https://raw.githubusercontent.com/${SCRIPTS_REPO}/${SCRIPTS_BRANCH}/auto-installer/${script_name}" -o "${output_path}"
        if [ $? -ne 0 ]; then
            print_error "Failed to download ${script_name}. Please check your internet connection."
            exit 1
        fi
    fi
    
    # Make the script executable
    chmod +x "${output_path}"
    print_success "${script_name} downloaded successfully."
}

# --- Initial Setup ---
initial_setup() {
    print_info "Performing initial setup..."
    
    # Create temporary directory for installation scripts
    TEMP_DIR=$(mktemp -d)
    print_info "Created temporary directory: ${TEMP_DIR}"
    
    # Create configuration file
    CONFIG_FILE="/tmp/phoenixpanel_install_vars"
    echo "# PhoenixPanel Installation Configuration" > "$CONFIG_FILE"
    echo "GITHUB_REPO=$GITHUB_REPO" >> "$CONFIG_FILE"
    echo "BRANCH=main" >> "$CONFIG_FILE"
    echo "INSTALL_DIR=$INSTALL_DIR" >> "$CONFIG_FILE"
    echo "PHP_VERSION=$PHP_VERSION" >> "$CONFIG_FILE"
    echo "NODE_VERSION=$NODE_VERSION" >> "$CONFIG_FILE"
    
    # Ask if using domain or IP
    USE_DOMAIN=false
    if prompt_yes_no "Will you be using a domain name for this installation? (If no, an IP address will be used)"; then
        USE_DOMAIN=true
        DOMAIN=$(prompt_user "Enter your domain name (e.g., panel.example.com)")
        while [[ -z "$DOMAIN" ]]; do
            print_warning "Domain cannot be empty."
            DOMAIN=$(prompt_user "Enter your domain name (e.g., panel.example.com)")
        done
        echo "USE_DOMAIN=true" >> "$CONFIG_FILE"
        echo "DOMAIN=$DOMAIN" >> "$CONFIG_FILE"
    else
        IP_ADDRESS=$(prompt_user "Enter the server IP address")
        while [[ -z "$IP_ADDRESS" ]]; do
            print_warning "IP address cannot be empty."
            IP_ADDRESS=$(prompt_user "Enter the server IP address")
        done
        echo "USE_DOMAIN=false" >> "$CONFIG_FILE"
        echo "IP_ADDRESS=$IP_ADDRESS" >> "$CONFIG_FILE"
    fi
    
    print_success "Initial setup completed."
}

# --- Main Function ---
main() {
    print_info "PhoenixPanel Linux Installer"
    print_info "==========================="
    
    # Check if running as root
    check_root
    
    # Perform initial setup
    initial_setup
    
    # Create temporary directory for installation scripts
    TEMP_DIR=$(mktemp -d)
    print_info "Created temporary directory for installation scripts: ${TEMP_DIR}"
    
    # Download and execute each installation script in sequence
    
    # 1. Linux Dependencies
    download_script "linux-dependencies.sh" "${TEMP_DIR}/linux-dependencies.sh"
    print_info "Installing Linux dependencies..."
    "${TEMP_DIR}/linux-dependencies.sh"
    print_success "Linux dependencies installed."
    
    # 2. Database Setup
    download_script "database-setup.sh" "${TEMP_DIR}/database-setup.sh"
    print_info "Setting up database..."
    "${TEMP_DIR}/database-setup.sh"
    print_success "Database setup completed."
    
    # 3. Panel Installation
    download_script "panel-install.sh" "${TEMP_DIR}/panel-install.sh"
    print_info "Installing PhoenixPanel..."
    "${TEMP_DIR}/panel-install.sh"
    print_success "PhoenixPanel installation completed."
    
    # 4. Webserver Setup
    download_script "webserver-setup.sh" "${TEMP_DIR}/webserver-setup.sh"
    print_info "Setting up web server..."
    "${TEMP_DIR}/webserver-setup.sh"
    print_success "Web server setup completed."
    
    # 5. Post-Installation Tasks
    download_script "post-install.sh" "${TEMP_DIR}/post-install.sh"
    print_info "Performing post-installation tasks..."
    "${TEMP_DIR}/post-install.sh"
    print_success "Post-installation tasks completed."
    
    # Clean up
    print_info "Cleaning up..."
    rm -rf "${TEMP_DIR}"
    # Keep the configuration file for reference
    # rm -f "/tmp/phoenixpanel_install_vars"
    
    print_success "PhoenixPanel installation completed successfully!"
    print_info "Please review the information above for important details about your installation."
}

# Run the main function
main
