#!/usr/bin/env bash

# PhoenixPanel Installation Script
# This script downloads and installs PhoenixPanel

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

# --- Download and Install PhoenixPanel ---
download_panel() {
    print_info "Downloading PhoenixPanel (${BRANCH} branch) from ${GITHUB_REPO}..."
    
    # Create installation directory
    mkdir -p /var/www
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "Directory ${INSTALL_DIR} already exists."
        if prompt_yes_no "Would you like to backup the existing installation?"; then
            BACKUP_DIR="${INSTALL_DIR}_backup_$(date +%Y%m%d%H%M%S)"
            print_info "Backing up existing installation to ${BACKUP_DIR}..."
            mv "$INSTALL_DIR" "$BACKUP_DIR"
            mkdir -p "$INSTALL_DIR"
        elif prompt_yes_no "Would you like to remove the existing installation?"; then
            print_info "Removing existing installation..."
            rm -rf "$INSTALL_DIR"
            mkdir -p "$INSTALL_DIR"
        else
            print_error "Cannot proceed without removing or backing up the existing installation. Aborting."
            exit 1
        fi
    fi
    
    # Clone the repository
    print_info "Cloning the repository..."
    git clone --branch $BRANCH https://github.com/$GITHUB_REPO.git "$INSTALL_DIR"
    
    print_success "PhoenixPanel downloaded."
}

# --- Set Permissions ---
set_permissions() {
    print_info "Setting file permissions..."
    # Set ownership to the webserver user and group
    chown -R ${WEBSERVER_USER}:${WEBSERVER_USER} "${INSTALL_DIR}"
    # Set correct permissions for storage and bootstrap/cache
    chmod -R 755 "${INSTALL_DIR}/storage" "${INSTALL_DIR}/bootstrap/cache"
    print_success "File permissions set."
}

# --- Install Dependencies (Composer & Yarn) ---
install_app_dependencies() {
    cd "$INSTALL_DIR"
    
    print_info "Installing Composer dependencies..."
    # Run composer as the webserver user to avoid permission issues
    sudo -u ${WEBSERVER_USER} composer install --no-dev --optimize-autoloader
    print_success "Composer dependencies installed."
    
    print_info "Installing Yarn dependencies and building assets..."
    # Ensure NVM is available for the webserver user or run as root if simpler
    yarn install --frozen-lockfile
    yarn build:production
    # Re-apply ownership just in case yarn/node created files as root
    chown -R ${WEBSERVER_USER}:${WEBSERVER_USER} "${INSTALL_DIR}"
    print_success "Yarn dependencies installed and assets built."
}

# --- Configure Environment ---
configure_env() {
    print_info "Configuring environment file (.env)..."
    cd "$INSTALL_DIR"
    
    if [ ! -f ".env" ]; then
        print_info "Copying .env.example to .env..."
        sudo -u ${WEBSERVER_USER} cp .env.example .env
    else
        print_info ".env file already exists."
    fi
    
    # Generate App Key
    # Check if APP_KEY is already set in .env before generating
    EXISTING_KEY=$(grep '^APP_KEY=' .env | cut -d '=' -f2-)
    
    if [ -n "$EXISTING_KEY" ] && [ "$EXISTING_KEY" != "null" ] && [ "$EXISTING_KEY" != "" ]; then
        print_warning "An application key already exists in the .env file."
        # Use the script's prompt function for confirmation
        if prompt_yes_no "Overwrite the existing application key? (WARNING: This can corrupt encrypted data)"; then
            print_info "Generating new application key (overwriting existing)..."
            sudo -u ${WEBSERVER_USER} php artisan key:generate --force
        else
            print_info "Skipping application key generation (existing key kept)."
        fi
    else
        # No existing key or key is empty/null, generate one normally
        print_info "Generating application key..."
        sudo -u ${WEBSERVER_USER} php artisan key:generate --force
    fi
    
    # Set APP_URL based on domain or IP choice
    if [ "$USE_DOMAIN" = true ]; then
        APP_URL="http://${DOMAIN}"
        # If we're going to set up SSL later, use https
        if prompt_yes_no "Will you be setting up SSL/HTTPS for this domain?"; then
            APP_URL="https://${DOMAIN}"
        fi
    else
        APP_URL="http://${IP_ADDRESS}"
    fi
    
    print_info "Using Panel URL: ${APP_URL}"
    
    # Create a temporary directory for answer files if it doesn't exist
    TEMP_DIR=$(mktemp -d)
    
    # Run the environment setup command
    print_info "Running environment setup..."
    
    # Prepare answers for p:environment:setup
    # Format: app url, timezone, cache driver, session driver, queue driver, redis host, redis password, redis port, mail driver, mail host, mail port, mail username, mail password, mail encryption, mail from address, mail from name
    TIMEZONE=$(prompt_user "Enter your timezone (default: UTC)")
    TIMEZONE=${TIMEZONE:-UTC}
    
    # Create a temporary file with answers
    SETUP_ANSWERS="${TEMP_DIR}/setup_answers.txt"
    cat > "$SETUP_ANSWERS" <<EOF
${APP_URL}
${TIMEZONE}
file
file
sync
localhost

6379
mail
mailtrap.io
2525


tls
no-reply@${DOMAIN:-example.com}
PhoenixPanel
EOF
    
    # Run the environment setup command with the answers
    sudo -u ${WEBSERVER_USER} php artisan p:environment:setup < "$SETUP_ANSWERS"
    
    # Run the database setup command
    print_info "Running database setup..."
    
    # Prepare answers for p:environment:database
    # Format: database host, database port, database name, database username, database password
    DB_ANSWERS="${TEMP_DIR}/db_answers.txt"
    cat > "$DB_ANSWERS" <<EOF
127.0.0.1
3306
${DB_DATABASE}
${DB_USERNAME}
${DB_PASSWORD}
EOF
    
    # Run the database setup command with the answers
    sudo -u ${WEBSERVER_USER} php artisan p:environment:database < "$DB_ANSWERS"
    
    # Clean up temporary files
    rm -f "$SETUP_ANSWERS" "$DB_ANSWERS"
    rmdir "$TEMP_DIR" 2>/dev/null || true
    
    print_success ".env file configured."
}

# --- Database Migration & Seeding ---
run_migrations() {
    print_info "Running database migrations and seeding..."
    cd "$INSTALL_DIR"
    sudo -u ${WEBSERVER_USER} php artisan migrate --seed --force
    print_success "Database migrated and seeded."
}

# --- Main Function ---
main() {
    # Load configuration
    if [ -f /tmp/phoenixpanel_install_vars ]; then
        source /tmp/phoenixpanel_install_vars
    else
        print_error "Configuration file not found. Please run the previous installation steps first."
        exit 1
    fi
    
    # Set default values if not already set
    GITHUB_REPO=${GITHUB_REPO:-"phoenixpanel/panel"}
    BRANCH=${BRANCH:-"main"}
    INSTALL_DIR=${INSTALL_DIR:-"/var/www/phoenixpanel"}
    
    # Download panel
    download_panel
    
    # Set permissions
    set_permissions
    
    # Install app dependencies
    install_app_dependencies
    
    # Configure environment
    configure_env
    
    # Run migrations
    run_migrations
    
    print_success "PhoenixPanel core installation completed."
    
    # Save installation directory for other scripts
    echo "INSTALL_DIR=$INSTALL_DIR" >> /tmp/phoenixpanel_install_vars
}

# Run the main function
main