#!/usr/bin/env bash

# PhoenixPanel Linux Dependencies Installer
# This script installs the required dependencies for PhoenixPanel on Linux systems

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

# --- Install Dependencies for Debian-based systems ---
install_debian_based_deps() {
    print_info "Installing dependencies for Debian-based system..."
    apt-get update -y
    # Essential build tools and utilities
    apt-get install -y software-properties-common curl wget git unzip zip tar gnupg apt-transport-https lsb-release ca-certificates jq
    # PHP Repo
    print_info "Adding PHP repository (ppa:ondrej/php)..."
    add-apt-repository ppa:ondrej/php -y
    apt-get update -y
    # PHP and extensions
    print_info "Installing PHP ${PHP_VERSION} and extensions..."
    apt-get install -y php${PHP_VERSION} php${PHP_VERSION}-cli php${PHP_VERSION}-gd php${PHP_VERSION}-mysql php${PHP_VERSION}-pdo php${PHP_VERSION}-mbstring php${PHP_VERSION}-tokenizer php${PHP_VERSION}-bcmath php${PHP_VERSION}-xml php${PHP_VERSION}-fpm php${PHP_VERSION}-curl php${PHP_VERSION}-zip php${PHP_VERSION}-intl php${PHP_VERSION}-redis php${PHP_VERSION}-opcache
    # MySQL Server
    if ! command -v mysql &> /dev/null; then
        print_info "Installing MySQL Server..."
        apt-get install -y mysql-server
    else
        print_info "MySQL Server already installed."
    fi
    
    # Set web server user
    WEBSERVER_USER="www-data"
    echo "WEBSERVER_USER=$WEBSERVER_USER" >> /tmp/phoenixpanel_install_vars
    
    print_success "Debian-based dependencies installed."
}

# --- Install Dependencies for RHEL-based systems ---
install_rhel_based_deps() {
    print_info "Installing dependencies for RHEL-based system..."
    dnf update -y
    # Essential build tools and utilities
    dnf install -y epel-release curl wget git unzip zip tar gnupg2 policycoreutils-python-utils
    # REMI Repo for PHP
    print_info "Adding REMI repository for PHP..."
    dnf install -y https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %{rhel}).rpm
    dnf module reset php -y
    dnf module enable php:remi-${PHP_VERSION} -y
    # PHP and extensions
    print_info "Installing PHP ${PHP_VERSION} and extensions..."
    dnf install -y php php-cli php-gd php-mysqlnd php-pdo php-mbstring php-tokenizer php-bcmath php-xml php-fpm php-curl php-zip php-intl php-redis php-opcache
    # MySQL Server
    if ! command -v mysql &> /dev/null; then
        print_info "Installing MySQL Server..."
        dnf install -y mysql-server
        systemctl enable --now mysqld
    else
        print_info "MySQL Server already installed."
    fi
    
    # Set web server user
    WEBSERVER_USER="nginx" # Assuming Nginx will be used
    echo "WEBSERVER_USER=$WEBSERVER_USER" >> /tmp/phoenixpanel_install_vars
    
    print_success "RHEL-based dependencies installed."
}

# --- Install Composer ---
install_composer() {
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
}

# --- Install Node.js and Yarn ---
install_node_and_yarn() {
    print_info "Installing NVM, Node.js ${NODE_VERSION}, and Yarn..."
    
    # Install NVM
    export NVM_DIR="$HOME/.nvm"
    if [ ! -s "$NVM_DIR/nvm.sh" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Load NVM
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # Load NVM bash_completion
    else
        print_info "NVM already installed."
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Load NVM
    fi

    # Install Node.js
    CURRENT_NODE_VERSION=$(nvm current 2>/dev/null || echo "none")
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
}

# --- Main Function ---
main() {
    # Load configuration
    if [ -f /tmp/phoenixpanel_install_vars ]; then
        source /tmp/phoenixpanel_install_vars
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
    
    # Install dependencies based on OS
    case "$OS" in
        ubuntu|debian)
            install_debian_based_deps
            ;;
        centos|rhel|rocky|almalinux)
            install_rhel_based_deps
            ;;
        *)
            print_error "Unsupported distribution: $OS"
            exit 1
            ;;
    esac
    
    # Install Composer
    install_composer
    
    # Install Node.js and Yarn
    install_node_and_yarn
    
    print_success "All dependencies installed successfully."
}

# Run the main function
main