#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
GITHUB_REPO="phoenixpanel/panel"
RELEASE_TAG="latest"
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

# Function to generate a random password
generate_password() {
    openssl rand -base64 16
}

# Function to prompt the user for input
prompt_user() {
    local prompt_message=$1
    local user_input
    # Read directly from the terminal, even if stdin is piped
    read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message}")" user_input < /dev/tty
    echo "$user_input"
}

# Function to prompt yes/no
prompt_yes_no() {
    local prompt_message=$1
    local default=${2:-y} # Default to yes if not specified
    local answer

    while true; do
        # Read directly from the terminal
        read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message} [y/N]: ")" answer < /dev/tty
        answer=${answer:-$default} # Use default if empty
        case $answer in
            [Yy]* ) return 0;; # Yes
            [Nn]* ) return 1;; # No
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# --- Root Check ---
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root or with sudo."
   exit 1
fi

print_info "Starting Phoenix Panel installation script..."

# --- Distribution Detection ---
OS=""
VERSION_ID=""
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION_ID=$VERSION_ID
elif type lsb_release >/dev/null 2>&1; then
    OS=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
    VERSION_ID=$(lsb_release -sr)
else
    print_error "Cannot detect Linux distribution."
    exit 1
fi

print_info "Detected Distribution: ${OS} ${VERSION_ID}"

# --- Dependency Installation ---
print_info "Installing required system dependencies..."

install_debian_based_deps() {
    apt-get update -y
    # Essential build tools and utilities
    apt-get install -y software-properties-common curl wget git unzip zip tar gnupg apt-transport-https lsb-release ca-certificates jq
    # PHP Repo
    print_info "Adding PHP repository (ppa:ondrej/php)..."
    add-apt-repository ppa:ondrej/php -y
    apt-get update -y
    # PHP and extensions
    print_info "Installing PHP ${PHP_VERSION} and extensions..."
    apt-get install -y php${PHP_VERSION} php${PHP_VERSION}-cli php${PHP_VERSION}-gd php${PHP_VERSION}-mysql php${PHP_VERSION}-pdo php${PHP_VERSION}-mbstring php${PHP_VERSION}-tokenizer php${PHP_VERSION}-bcmath php${PHP_VERSION}-xml php${PHP_VERSION}-fpm php${PHP_VERSION}-curl php${PHP_VERSION}-zip php${PHP_VERSION}-intl php${PHP_VERSION}-redis php${PHP_VERSION}-process php${PHP_VERSION}-opcache
    # MySQL Server
    if ! command -v mysql &> /dev/null; then
        print_info "Installing MySQL Server..."
        apt-get install -y mysql-server
    else
        print_info "MySQL Server already installed."
    fi
    # Nginx (if chosen later)
    # Certbot (if chosen later)
}

install_rhel_based_deps() {
    dnf update -y
    # Essential build tools and utilities
    dnf install -y epel-release curl wget git unzip zip tar gnupg2 policycoreutils-python-utils
    # REMI Repo for PHP
    print_info "Adding REMI repository for PHP..."
    dnf install -y https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %{rhel}).rpm
    dnf module reset php -y
    dnf module enable php:remi-${PHP_VERSION} -y
    # Redis, PHP and extensions
    print_info "Installing PHP ${PHP_VERSION} and extensions..."
    dnf install -y redis php php-cli php-process php-gd php-mysqlnd php-pdo php-mbstring php-tokenizer php-bcmath php-xml php-fpm php-curl php-zip php-intl php-redis php-opcache
    # Start redis
    sudo systemctl enable redis
    sudo systemctl start redis
    # MySQL Server
    if ! command -v mysql &> /dev/null; then
        print_info "Installing MySQL Server..."
        dnf install -y mysql-server
        systemctl enable --now mysqld
    else
        print_info "MySQL Server already installed."
    fi
    # Nginx (if chosen later)
    # Certbot (if chosen later)
}

case "$OS" in
    ubuntu|debian)
        install_debian_based_deps
        WEBSERVER_USER="www-data"
        ;;
    centos|rhel|rocky|almalinux)
        install_rhel_based_deps
        WEBSERVER_USER="nginx" # Assuming Nginx will be used
        ;;
    *)
        print_error "Unsupported distribution: $OS"
        exit 1
        ;;
esac

print_success "System dependencies installed."

# --- Install Composer ---
print_info "Installing Composer..."
if ! command -v composer &> /dev/null; then
    EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"

    if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
        print_error "Composer installer signature mismatch. Aborting."
        rm composer-setup.php
        exit 1
    fi

    php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    rm composer-setup.php
    print_success "Composer installed successfully."
else
    print_info "Composer already installed."
fi

# --- Install NVM, Node.js, Yarn ---
print_info "Installing NVM, Node.js ${NODE_VERSION}, and Yarn..."
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Load NVM
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Load NVM bash_completion
else
    print_info "NVM already installed."
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Load NVM
fi

# Check if correct Node version is installed
CURRENT_NODE_VERSION=$(nvm current)
if [[ "$CURRENT_NODE_VERSION" != "v${NODE_VERSION}"* ]]; then
    print_info "Installing Node.js v${NODE_VERSION}..."
    nvm install ${NODE_VERSION}
    nvm use ${NODE_VERSION}
    nvm alias default ${NODE_VERSION}
else
    print_info "Node.js v${NODE_VERSION} already installed and active."
fi

# Install Yarn
if ! command -v yarn &> /dev/null; then
    print_info "Installing Yarn..."
    npm install -g yarn
    print_success "Yarn installed successfully."
else
    print_info "Yarn already installed."
fi

# --- MySQL Setup ---
print_info "Configuring MySQL Database..."
DB_DATABASE="phoenixpanel"
DB_USERNAME="phoenixpanel"
DB_PASSWORD=""

if prompt_yes_no "Generate a random password for the MySQL user '${DB_USERNAME}'?"; then
    DB_PASSWORD=$(generate_password)
    print_info "Generated MySQL Password: ${YELLOW}${DB_PASSWORD}${RESET} (Please save this!)"
else
    while [[ -z "$DB_PASSWORD" ]]; do
        DB_PASSWORD=$(prompt_user "Enter the desired password for MySQL user '${DB_USERNAME}': ")
        if [[ -z "$DB_PASSWORD" ]]; then
            print_warning "Password cannot be empty."
        fi
    done
fi

# Secure MySQL installation if needed (basic example)
# mysql_secure_installation # Consider running this interactively or automating parts if possible

# --- MySQL Root Password Handling ---
print_info "Checking MySQL root access..."
MYSQL_ROOT_PASSWORD=""
MYSQL_COMMAND_BASE="mysql" # Base command

# Try connecting without password first
if ! $MYSQL_COMMAND_BASE -e "SELECT 1;" > /dev/null 2>&1; then
    print_warning "Could not connect to MySQL as root without a password."
    while true; do
        read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Enter MySQL root password (leave blank to skip): ")" MYSQL_ROOT_PASSWORD < /dev/tty
        echo # Newline after password input

        if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
            print_error "MySQL root password is required to proceed with database setup. Aborting."
            exit 1
        fi

        # Test connection with the provided password
        if $MYSQL_COMMAND_BASE -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT 1;" > /dev/null 2>&1; then
            print_success "MySQL root connection successful."
            MYSQL_COMMAND="${MYSQL_COMMAND_BASE} -uroot -p'${MYSQL_ROOT_PASSWORD}'" # Use quotes for safety
            break
        else
            print_warning "Incorrect MySQL root password. Please try again."
        fi
    done
else
    print_info "MySQL root access successful without password."
    MYSQL_COMMAND="${MYSQL_COMMAND_BASE}" # No password needed
fi

# --- Database and User Creation ---
print_info "Checking for existing database/user..."
# Check if database exists by querying and checking if the output is non-empty
DB_QUERY_OUTPUT=$( $MYSQL_COMMAND -sN -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_DATABASE}';" )
if [[ $? -ne 0 ]]; then print_error "Failed to query database existence."; exit 1; fi
DB_EXISTS=""
if [[ -n "$DB_QUERY_OUTPUT" ]]; then DB_EXISTS="true"; fi

# Check if user exists by querying and checking if the output is non-empty
USER_QUERY_OUTPUT=$( $MYSQL_COMMAND -sN -e "SELECT User FROM mysql.user WHERE User = '${DB_USERNAME}' AND Host = 'localhost';" )
if [[ $? -ne 0 ]]; then print_error "Failed to query user existence."; exit 1; fi
USER_EXISTS=""
if [[ -n "$USER_QUERY_OUTPUT" ]]; then USER_EXISTS="true"; fi

# If either exists, prompt for confirmation before deleting
if [ -n "$DB_EXISTS" ] || [ -n "$USER_EXISTS" ]; then
    print_warning "Database '${DB_DATABASE}' and/or user '${DB_USERNAME}'@'localhost' already exist."
    if prompt_yes_no "Proceeding will DELETE the existing database and/or user. Continue?"; then
        print_info "Deleting existing database and/or user..."
        $MYSQL_COMMAND -e "DROP DATABASE IF EXISTS \`${DB_DATABASE}\`;" || { print_error "Failed to drop database '${DB_DATABASE}'."; exit 1; }
        $MYSQL_COMMAND -e "DROP USER IF EXISTS '${DB_USERNAME}'@'localhost';" || { print_error "Failed to drop user '${DB_USERNAME}'@'localhost'."; exit 1; }
        $MYSQL_COMMAND -e "FLUSH PRIVILEGES;" || { print_error "Failed to flush privileges after dropping."; exit 1; }
        print_info "Existing database/user deleted."
    else
        print_error "User chose not to overwrite existing database/user. Aborting installation."
        exit 1
    fi
fi

# Escape password for MySQL commands (needs to be done *before* CREATE USER)
DB_PASSWORD_MYSQL_ESCAPED=$(printf '%s\n' "$DB_PASSWORD" | sed -e 's/\\/\\\\/g' -e "s/'/\\'/g") # Escape \ and ' for MySQL string

# Create database and user
print_info "Creating database '${DB_DATABASE}'..."
$MYSQL_COMMAND -e "CREATE DATABASE \`${DB_DATABASE}\`;" || { print_error "Failed to create database '${DB_DATABASE}'."; exit 1; }
print_info "Creating user '${DB_USERNAME}'@'localhost'..."
$MYSQL_COMMAND -e "CREATE USER '${DB_USERNAME}'@'localhost' IDENTIFIED BY '${DB_PASSWORD_MYSQL_ESCAPED}';" || { print_error "Failed to create user '${DB_USERNAME}'. Check MySQL logs for details."; exit 1; }
print_info "Granting privileges..."
$MYSQL_COMMAND -e "GRANT ALL PRIVILEGES ON \`${DB_DATABASE}\`.* TO '${DB_USERNAME}'@'localhost';" || { print_error "Failed to grant privileges."; exit 1; }
$MYSQL_COMMAND -e "FLUSH PRIVILEGES;" || { print_error "Failed to flush privileges after granting."; exit 1; }

print_success "MySQL database and user configured."

# --- Download Phoenix Panel ---
print_info "Downloading Phoenix Panel (${RELEASE_TAG}) from ${GITHUB_REPO}..."
mkdir -p /var/www
if [ -d "$INSTALL_DIR" ]; then
    print_warning "Directory ${INSTALL_DIR} already exists. Skipping download."
    # Optionally add logic to backup/remove existing dir
else
    # Fetch release information using GitHub API
    API_URL="https://api.github.com/repos/${GITHUB_REPO}/releases/${RELEASE_TAG}"
    RELEASE_INFO=$(curl -s "$API_URL")
    if [[ $? -ne 0 ]] || [[ -z "$RELEASE_INFO" ]]; then
        print_error "Failed to fetch release info from ${API_URL}. Trying 'latest' tag."
        API_URL="https://api.github.com/repos/${GITHUB_REPO}/releases/latest"
        RELEASE_INFO=$(curl -s "$API_URL")
        if [[ $? -ne 0 ]] || [[ -z "$RELEASE_INFO" ]]; then
            print_error "Failed to fetch release info for 'latest' tag either. Aborting."
            exit 1
        fi
        print_info "Using release info from 'latest' tag."
    fi

    # Try to find a .tar.gz asset URL using jq
    DOWNLOAD_URL=$(echo "$RELEASE_INFO" | jq -r '.assets[] | select(.name | endswith(".tar.gz")) | .browser_download_url' | head -n 1)

    # If no .tar.gz asset found, fall back to the tarball_url
    if [ -z "$DOWNLOAD_URL" ]; then
        print_warning "No .tar.gz asset found in release assets. Falling back to source code tarball."
        DOWNLOAD_URL=$(echo "$RELEASE_INFO" | jq -r '.tarball_url')
        if [ -z "$DOWNLOAD_URL" ] || [ "$DOWNLOAD_URL" == "null" ]; then
             print_error "Could not find a suitable download URL (asset or tarball). Aborting."
             exit 1
        fi
    fi

    print_info "Downloading from ${DOWNLOAD_URL}..."
    # Use wget with --content-disposition if it's the tarball_url, as GitHub API redirects
    # Need to handle potential filename differences
    wget --content-disposition -q -O panel-download.tar.gz "$DOWNLOAD_URL"
    if [[ $? -ne 0 ]]; then print_error "Download failed from ${DOWNLOAD_URL}."; exit 1; fi

    print_info "Extracting files to ${INSTALL_DIR}..."
    # Create the target directory first
    mkdir -p "$INSTALL_DIR"
    # Extract and strip the top-level directory (GitHub tarballs often have one)
    tar -xzf panel-download.tar.gz --strip-components=1 -C "$INSTALL_DIR"
    if [[ $? -ne 0 ]]; then print_error "Extraction failed. Check panel-download.tar.gz."; exit 1; fi
    rm panel-download.tar.gz
    print_success "Phoenix Panel downloaded and extracted."
fi

cd "$INSTALL_DIR"

# --- Set Permissions ---
print_info "Setting file permissions..."
# Set ownership to the webserver user and group
chown -R ${WEBSERVER_USER}:${WEBSERVER_USER} "${INSTALL_DIR}"
# Set correct permissions for storage and bootstrap/cache
chmod -R 755 "${INSTALL_DIR}/storage" "${INSTALL_DIR}/bootstrap/cache"
print_success "File permissions set."

# --- Install Dependencies (Composer & Yarn) ---
print_info "Installing Composer dependencies..."
# Run composer as the webserver user to avoid permission issues
sudo -u ${WEBSERVER_USER} /usr/local/bin/composer install --no-dev --optimize-autoloader
print_success "Composer dependencies installed."

print_info "Installing Yarn dependencies and building assets..."
# Ensure NVM is available for the webserver user or run as root if simpler
# Running as root might be easier here, but check ownership after
yarn install --frozen-lockfile
yarn build:production
# Re-apply ownership just in case yarn/node created files as root
chown -R ${WEBSERVER_USER}:${WEBSERVER_USER} "${INSTALL_DIR}"
print_success "Yarn dependencies installed and assets built."

# --- Configure .env ---
print_info "Configuring environment file (.env)..."
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
        sudo -u ${WEBSERVER_USER} php artisan key:generate --no-interaction
    else
        print_info "Skipping application key generation (existing key kept)."
    fi
else
    # No existing key or key is empty/null, generate one normally
    print_info "Generating application key..."
    sudo -u ${WEBSERVER_USER} php artisan key:generate --no-interaction
fi

# Prompt for .env values
APP_URL=$(prompt_user "Enter the Panel URL (e.g., http://panel.example.com): ")
# Basic validation
while [[ -z "$APP_URL" ]]; do
    print_warning "Panel URL cannot be empty."
    APP_URL=$(prompt_user "Enter the Panel URL (e.g., http://panel.example.com): ")
done

# Update .env file using sed (be careful with special characters in passwords/values)
print_info "Updating .env with configuration..."
sudo -u ${WEBSERVER_USER} sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" .env
sudo -u ${WEBSERVER_USER} sed -i "s|^DB_HOST=.*|DB_HOST=127.0.0.1|" .env
sudo -u ${WEBSERVER_USER} sed -i "s|^DB_PORT=.*|DB_PORT=3306|" .env
sudo -u ${WEBSERVER_USER} sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|" .env
sudo -u ${WEBSERVER_USER} sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|" .env
# Escape password for sed
# Escape password for sed - handle backslash, ampersand, and the delimiter (#)
DB_PASSWORD_SED_ESCAPED=$(printf '%s\n' "$DB_PASSWORD" | sed -e 's/[\#&\\]/\\&/g')
sudo -u ${WEBSERVER_USER} sed -i "s#^DB_PASSWORD=.*#DB_PASSWORD=${DB_PASSWORD_SED_ESCAPED}#" .env

# Add prompts for other important settings like Mail, Redis if needed
# Example:
# MAIL_MAILER=$(prompt_user "Enter Mail Driver (e.g., smtp, mailgun, log): ")
# sudo -u ${WEBSERVER_USER} sed -i "s|^MAIL_MAILER=.*|MAIL_MAILER=${MAIL_MAILER}|" .env
# ... add more prompts for MAIL_HOST, MAIL_PORT, etc.

print_success ".env file configured."

# --- Database Migration & Seeding ---
print_info "Running database migrations and seeding..."
sudo -u ${WEBSERVER_USER} php artisan migrate --seed --force
print_success "Database migrated and seeded."

# --- Create Administrator Account ---
# Always prompt, reading from /dev/tty via helper function
if prompt_yes_no "Create an administrator account now?"; then
    ADMIN_EMAIL=""
    ADMIN_USERNAME=""
    ADMIN_FIRST_NAME=""
    ADMIN_LAST_NAME=""
    ADMIN_PASSWORD=""

    # Always prompt for details using prompt_user (which reads from /dev/tty)
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

    # Always prompt for password choice using prompt_yes_no (reads from /dev/tty)
    if prompt_yes_no "Generate a random password for the administrator?"; then
        ADMIN_PASSWORD=$(generate_password)
        print_info "Generated Admin Password: ${YELLOW}${ADMIN_PASSWORD}${RESET} (Please save this!)"
    else # Prompt for password interactively, reading from /dev/tty
        while true; do # Loop until valid password or generated
            read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Enter administrator password (leave empty to generate): ")" ADMIN_PASSWORD < /dev/tty
            echo
            if [[ -z "$ADMIN_PASSWORD" ]]; then
                print_info "Empty password entered. Generating a random password..."
                ADMIN_PASSWORD=$(generate_password)
                print_info "Generated Admin Password: ${YELLOW}${ADMIN_PASSWORD}${RESET} (Please save this!)"
                break # Exit loop after generating
            fi

            read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Confirm administrator password: ")" confirm_password < /dev/tty
            echo
            if [[ "$ADMIN_PASSWORD" == "$confirm_password" ]]; then
                break # Passwords match, exit loop
            else
                print_warning "Passwords do not match. Please try again."
                ADMIN_PASSWORD="" # Reset password to retry loop
            fi
        done
    fi

    print_info "Creating administrator account..."
    sudo -u ${WEBSERVER_USER} php artisan p:user:make --email="$ADMIN_EMAIL" --username="$ADMIN_USERNAME" --name-first="$ADMIN_FIRST_NAME" --name-last="$ADMIN_LAST_NAME" --password="$ADMIN_PASSWORD" --admin=1
    print_success "Administrator account created."
    print_info "Username: ${ADMIN_USERNAME}"
    print_info "Password: ${YELLOW}${ADMIN_PASSWORD}${RESET}"
fi

# --- Nginx Setup (Optional) ---
if prompt_yes_no "Setup Nginx web server automatically?"; then
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
        # Stop Nginx temporarily for standalone challenge if needed, or use webroot
        # Using Nginx plugin is generally preferred
        print_info "Attempting to obtain SSL certificate for ${NGINX_DOMAIN}..."
        CERTBOT_EMAIL="$ADMIN_EMAIL" # Use admin email by default
        if [ -z "$CERTBOT_EMAIL" ]; then
            CERTBOT_EMAIL=$(prompt_user "Enter an email address for Let's Encrypt alerts: ")
            while [[ -z "$CERTBOT_EMAIL" ]]; do
                print_warning "Email address cannot be empty."
                CERTBOT_EMAIL=$(prompt_user "Enter an email address for Let's Encrypt alerts: ")
            done
        fi
        certbot certonly --standalone -d "$NGINX_DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect
        print_success "SSL certificate obtained and Nginx configured for SSL."
    fi

    # Create Nginx configuration if SSL wasn't automatically configured by Certbot or if SSL was declined
    if [ "$USE_SSL" = false ] || ! grep -q "ssl_certificate" "$NGINX_CONFIG_PATH"; then
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

    access_log off; # Or set path: /var/log/nginx/phoenixpanel.app-access.log;
    error_log  /var/log/nginx/phoenixpanel.app-error.log error;

    # Block access to sensitive files
    location ~ /\.ht {
        deny all;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php${PHP_VERSION}-fpm.sock; # Adjust path if needed (e.g., /run/php-fpm/www.sock on RHEL)
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param PATH_INFO \$fastcgi_path_info;
        fastcgi_read_timeout 300; # Increase timeout for longer operations
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

    # --- Firewall Configuration ---
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

    print_success "Nginx setup complete."
    print_info "You should now be able to access the panel at: ${CYAN}${APP_URL}${RESET}"

else
    print_info "Skipping Nginx setup. You will need to configure a web server manually."
fi

# --- Final Steps ---
# Add cronjob for Laravel scheduler
print_info "Adding cronjob for scheduled tasks..."
CRON_JOB="* * * * * php ${INSTALL_DIR}/artisan schedule:run >> /dev/null 2>&1"
# Add check to prevent duplicate cron jobs
(crontab -l 2>/dev/null | grep -v "schedule:run" ; echo "$CRON_JOB") | crontab -
print_success "Cronjob added."

# Add queue worker service (optional but recommended)
# Consider adding instructions or optionally setting up systemd for queue:work

print_success "Phoenix Panel installation completed!"
print_info "Please review the output above for any generated passwords or important information."
if [ ! -z "$DB_PASSWORD" ]; then
    print_info "MySQL User: ${CYAN}${DB_USERNAME}${RESET}, Password: ${YELLOW}${DB_PASSWORD}${RESET}"
fi
if [ ! -z "$ADMIN_PASSWORD" ]; then
    print_info "Admin User: ${CYAN}${ADMIN_USERNAME}${RESET}, Password: ${YELLOW}${ADMIN_PASSWORD}${RESET}"
fi
if [ "$NGINX_DOMAIN" ]; then
    print_info "Panel URL: ${CYAN}${APP_URL}${RESET}"
fi

exit 0
