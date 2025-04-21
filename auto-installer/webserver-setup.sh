#!/usr/bin/env bash

# PhoenixPanel Webserver Setup Script
# This script sets up Nginx for PhoenixPanel on Linux

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

# --- Setup Nginx on Linux ---
setup_nginx_linux() {
    print_info "Setting up Nginx..."
    NGINX_CONFIG_PATH="/etc/nginx/sites-available/phoenixpanel.conf"
    NGINX_SYMLINK_PATH="/etc/nginx/sites-enabled/phoenixpanel.conf"
    
    # Install Nginx if not already installed
    if ! command -v nginx &> /dev/null; then
        print_info "Installing Nginx..."
        case "$OS" in
            ubuntu|debian) apt-get install -y nginx ;;
            centos|rhel|rocky|almalinux) dnf install -y nginx ;;
        esac
        systemctl enable --now nginx
    else
        print_info "Nginx already installed."
    fi
    
    # Ask for domain name (used for server_name and potentially SSL)
    NGINX_DOMAIN=$(prompt_user "Enter the domain/subdomain for the panel (e.g., panel.example.com or IP address): ")
    while [[ -z "$NGINX_DOMAIN" ]]; do
        print_warning "Domain/IP cannot be empty."
        NGINX_DOMAIN=$(prompt_user "Enter the domain/subdomain for the panel (e.g., panel.example.com or IP address): ")
    done
    
    USE_SSL=false
    if [[ "$NGINX_DOMAIN" != *"."* ]]; then
        print_warning "SSL cannot be configured for an IP address. Proceeding without SSL."
    elif prompt_yes_no "Configure SSL using Let's Encrypt (Certbot)?"; then
        USE_SSL=true
        print_info "Setting up SSL..."
        # Install Certbot
        if ! command -v certbot &> /dev/null; then
            print_info "Installing Certbot..."
            case "$OS" in
                ubuntu|debian) apt-get install -y certbot python3-certbot-nginx ;;
                centos|rhel|rocky|almalinux) dnf install -y certbot python3-certbot-nginx ;;
            esac
        else
            print_info "Certbot already installed."
        fi
        # Using Nginx plugin
        print_info "Attempting to obtain SSL certificate for ${NGINX_DOMAIN}..."
        certbot --nginx -d "$NGINX_DOMAIN" --non-interactive --agree-tos -m "$ADMIN_EMAIL" --redirect
        print_success "SSL certificate obtained and Nginx configured for SSL."
    fi
    
    # Create Nginx configuration if SSL wasn't automatically configured by Certbot or if SSL was declined
    if [ "$USE_SSL" = false ] || ! grep -q "ssl_certificate" "$NGINX_CONFIG_PATH" 2>/dev/null; then
        print_info "Creating Nginx configuration file..."
        cat > "$NGINX_CONFIG_PATH" <<EOF
server {
    listen 80;
    server_name ${NGINX_DOMAIN};
    root ${INSTALL_DIR}/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/phoenixpanel.error.log error;

    # Block access to sensitive files
    location ~ /\.ht {
        deny all;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php${PHP_VERSION}-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param PATH_INFO \$fastcgi_path_info;
        fastcgi_read_timeout 300;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
    }
}
EOF
        # Symlink if not already done by Certbot
        if [ ! -L "$NGINX_SYMLINK_PATH" ]; then
            ln -s "$NGINX_CONFIG_PATH" "$NGINX_SYMLINK_PATH"
        fi
        print_success "Nginx configuration created at ${NGINX_CONFIG_PATH}"
    fi
    
    # Adjust PHP-FPM socket path for RHEL-based systems in Nginx config if needed
    if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "rocky" || "$OS" == "almalinux" ]]; then
        FPM_SOCK_PATH="/run/php-fpm/www.sock" # Default path for RHEL-based systems with php-fpm
        # Check if the default sock exists, otherwise try the versioned one
        if [ ! -S "$FPM_SOCK_PATH" ]; then
            FPM_SOCK_PATH="/var/run/php/php${PHP_VERSION}-fpm.sock" # Fallback or alternative path
        fi
        sed -i "s|unix:/var/run/php/php.*-fpm.sock;|unix:${FPM_SOCK_PATH};|" "$NGINX_CONFIG_PATH"
        print_info "Adjusted PHP-FPM socket path for RHEL-based system in Nginx config."
        # Ensure PHP-FPM is running and enabled
        systemctl enable --now php-fpm
    fi
    
    # SELinux permissions for RHEL-based systems
    if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "rocky" || "$OS" == "almalinux" ]] && command -v semanage &> /dev/null; then
        print_info "Configuring SELinux permissions for Nginx..."
        semanage fcontext -a -t httpd_sys_rw_content_t "${INSTALL_DIR}/storage(/.*)?"
        restorecon -R "${INSTALL_DIR}/storage"
        semanage fcontext -a -t httpd_sys_rw_content_t "${INSTALL_DIR}/bootstrap/cache(/.*)?"
        restorecon -R "${INSTALL_DIR}/bootstrap/cache"
        # Allow network connections if needed (e.g., for database, redis)
        setsebool -P httpd_can_network_connect 1
        setsebool -P httpd_can_network_connect_db 1
        print_success "SELinux permissions configured."
    fi
    
    # Test Nginx configuration
    print_info "Testing Nginx configuration..."
    nginx -t
    # Reload Nginx
    print_info "Reloading Nginx service..."
    systemctl reload nginx
    
    # Firewall Configuration
    print_info "Configuring firewall..."
    HTTP_PORT=80
    HTTPS_PORT=443
    
    if command -v ufw &> /dev/null; then
        ufw allow $HTTP_PORT/tcp
        if [ "$USE_SSL" = true ]; then
            ufw allow $HTTPS_PORT/tcp
        fi
        # ufw enable # Uncomment if ufw is not already enabled
        ufw reload
        print_success "UFW firewall configured."
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=http
        if [ "$USE_SSL" = true ]; then
            firewall-cmd --permanent --add-service=https
        fi
        firewall-cmd --reload
        print_success "Firewalld configured."
    else
        print_warning "Could not detect ufw or firewalld. Please configure your firewall manually to allow ports ${HTTP_PORT} (HTTP) and ${HTTPS_PORT} (HTTPS if SSL is enabled)."
    fi
    
    # Save Nginx domain for other scripts
    echo "NGINX_DOMAIN=$NGINX_DOMAIN" >> /tmp/phoenixpanel_install_vars
    echo "USE_SSL=$USE_SSL" >> /tmp/phoenixpanel_install_vars
    
    print_success "Nginx setup complete."
    print_info "You should now be able to access the panel at: ${CYAN}${APP_URL}${RESET}"
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
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
    else
        print_error "Cannot detect Linux distribution."
        exit 1
    fi
    
    print_info "Detected Linux distribution: $OS"
    
    # Setup Nginx
    if prompt_yes_no "Setup web server automatically?"; then
        setup_nginx_linux
    else
        print_info "Skipping web server setup. You will need to configure a web server manually."
    fi
    
    print_success "Web server setup completed."
}

# Run the main function
main