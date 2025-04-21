#!/usr/bin/env bash

# PhoenixPanel Post-Installation Script
# This script performs final setup tasks for PhoenixPanel

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

# Function to generate a random password
generate_password() {
    openssl rand -base64 16
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

# --- Create Administrator Account ---
create_admin() {
    cd "$INSTALL_DIR"
    
    if prompt_yes_no "Create an administrator account now?"; then
        ADMIN_EMAIL=""
        ADMIN_USERNAME=""
        ADMIN_FIRST_NAME=""
        ADMIN_LAST_NAME=""
        ADMIN_PASSWORD=""
        
        while [[ -z "$ADMIN_EMAIL" ]]; do
            ADMIN_EMAIL=$(prompt_user "Enter administrator email address: ")
        done
        while [[ -z "$ADMIN_USERNAME" ]]; do
            ADMIN_USERNAME=$(prompt_user "Enter administrator username: ")
        done
        while [[ -z "$ADMIN_FIRST_NAME" ]]; do
            ADMIN_FIRST_NAME=$(prompt_user "Enter administrator first name: ")
        done
        while [[ -z "$ADMIN_LAST_NAME" ]]; do
            ADMIN_LAST_NAME=$(prompt_user "Enter administrator last name: ")
        done
        
        if prompt_yes_no "Generate a random password for the administrator?"; then
            ADMIN_PASSWORD=$(generate_password)
            print_info "Generated Admin Password: ${YELLOW}${ADMIN_PASSWORD}${RESET} (Please save this!)"
        else
            while [[ -z "$ADMIN_PASSWORD" ]]; do
                read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Enter administrator password: ")" ADMIN_PASSWORD
                echo
                read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Confirm administrator password: ")" confirm_password
                echo
                if [[ "$ADMIN_PASSWORD" != "$confirm_password" ]]; then
                    print_warning "Passwords do not match. Please try again."
                    ADMIN_PASSWORD=""
                elif [[ -z "$ADMIN_PASSWORD" ]]; then
                    print_warning "Password cannot be empty."
                fi
            done
        fi
        
        print_info "Creating administrator account..."
        sudo -u ${WEBSERVER_USER} php artisan p:user:make --email="$ADMIN_EMAIL" --username="$ADMIN_USERNAME" --name-first="$ADMIN_FIRST_NAME" --name-last="$ADMIN_LAST_NAME" --password="$ADMIN_PASSWORD" --admin=1
        print_success "Administrator account created."
        print_info "Username: ${ADMIN_USERNAME}"
        print_info "Password: ${YELLOW}${ADMIN_PASSWORD}${RESET}"
        
        # Save admin credentials for summary
        echo "ADMIN_USERNAME=$ADMIN_USERNAME" >> /tmp/phoenixpanel_install_vars
        echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" >> /tmp/phoenixpanel_install_vars
        echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> /tmp/phoenixpanel_install_vars
    fi
}

# --- Create Upgrade Script ---
create_upgrade_script() {
    print_info "Creating upgrade script..."
    
    UPGRADE_SCRIPT="${INSTALL_DIR}/upgrade.sh"
    
    cat > "$UPGRADE_SCRIPT" <<EOF
#!/usr/bin/env bash

# PhoenixPanel Upgrade Script
# This script upgrades an existing PhoenixPanel installation

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
    echo -e "\${BLUE}[INFO]\${RESET} \$1"
}

print_success() {
    echo -e "\${GREEN}[SUCCESS]\${RESET} \$1"
}

print_warning() {
    echo -e "\${YELLOW}[WARNING]\${RESET} \$1"
}

print_error() {
    echo -e "\${RED}[ERROR]\${RESET} \$1" >&2
}

# --- Check if running as root ---
if [[ \$EUID -ne 0 ]]; then
    print_error "This script must be run as root or with sudo."
    exit 1
fi

# --- Configuration ---
PANEL_DIR="${INSTALL_DIR}"
WEBSERVER_USER="${WEBSERVER_USER}"

# --- Backup ---
print_info "Creating backup..."
BACKUP_DIR="\${PANEL_DIR}_backup_\$(date +%Y%m%d%H%M%S)"
cp -r "\$PANEL_DIR" "\$BACKUP_DIR"
print_success "Backup created at \$BACKUP_DIR"

# --- Pull Latest Changes ---
print_info "Pulling latest changes from repository..."
cd "\$PANEL_DIR"
git fetch
git reset --hard
git checkout main
git pull

# --- Set Permissions ---
print_info "Setting file permissions..."
chown -R \${WEBSERVER_USER}:\${WEBSERVER_USER} "\${PANEL_DIR}"
chmod -R 755 "\${PANEL_DIR}/storage" "\${PANEL_DIR}/bootstrap/cache"

# --- Update Dependencies ---
print_info "Updating Composer dependencies..."
sudo -u \${WEBSERVER_USER} composer install --no-dev --optimize-autoloader

print_info "Updating Yarn dependencies and rebuilding assets..."
yarn install --frozen-lockfile
yarn build:production
chown -R \${WEBSERVER_USER}:\${WEBSERVER_USER} "\${PANEL_DIR}"

# --- Run Migrations ---
print_info "Running database migrations..."
sudo -u \${WEBSERVER_USER} php artisan migrate --force

# --- Clear Cache ---
print_info "Clearing application cache..."
sudo -u \${WEBSERVER_USER} php artisan view:clear
sudo -u \${WEBSERVER_USER} php artisan config:clear
sudo -u \${WEBSERVER_USER} php artisan cache:clear

print_success "PhoenixPanel has been upgraded successfully!"
print_info "If you encounter any issues, you can restore the backup from \$BACKUP_DIR"
EOF
    
    chmod +x "$UPGRADE_SCRIPT"
    print_success "Upgrade script created at ${UPGRADE_SCRIPT}"
    print_info "You can upgrade your installation in the future by running: ${CYAN}sudo ${UPGRADE_SCRIPT}${RESET}"
}

# --- Add Cronjob ---
add_cronjob() {
    print_info "Adding cronjob for scheduled tasks..."
    CRON_JOB="* * * * * php ${INSTALL_DIR}/artisan schedule:run >> /dev/null 2>&1"
    # Add check to prevent duplicate cron jobs
    (crontab -l 2>/dev/null | grep -v "schedule:run" ; echo "$CRON_JOB") | crontab -
    print_success "Cronjob added."
}

# --- Display Installation Summary ---
display_summary() {
    print_success "PhoenixPanel installation completed!"
    print_info "Please review the following information:"
    
    if [ ! -z "$DB_PASSWORD" ]; then
        print_info "MySQL User: ${CYAN}${DB_USERNAME}${RESET}, Password: ${YELLOW}${DB_PASSWORD}${RESET}"
    fi
    
    if [ ! -z "$ADMIN_PASSWORD" ]; then
        print_info "Admin User: ${CYAN}${ADMIN_USERNAME}${RESET}, Password: ${YELLOW}${ADMIN_PASSWORD}${RESET}"
    fi
    
    if [ "$NGINX_DOMAIN" ]; then
        if [ "$USE_SSL" = true ]; then
            print_info "Panel URL: ${CYAN}https://${NGINX_DOMAIN}${RESET}"
        else
            print_info "Panel URL: ${CYAN}http://${NGINX_DOMAIN}${RESET}"
        fi
    fi
    
    print_info "Installation Directory: ${CYAN}${INSTALL_DIR}${RESET}"
    print_info "To upgrade your installation in the future, run: ${CYAN}sudo ${INSTALL_DIR}/upgrade.sh${RESET}"
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
    
    # Create admin account
    create_admin
    
    # Create upgrade script
    create_upgrade_script
    
    # Add cronjob
    add_cronjob
    
    # Display installation summary
    display_summary
    
    # Clean up temporary files
    # Uncomment the following line if you want to remove the temporary variables file
    # rm -f /tmp/phoenixpanel_install_vars
    
    print_success "Post-installation tasks completed."
}

# Run the main function
main