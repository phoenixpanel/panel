#!/bin/bash

#==============================================================================
# Phoenix Panel Auto-Installer Script
# Supports: Ubuntu, Debian, RHEL, Rocky Linux, AlmaLinux
# Installs: PHP 8.3, MariaDB, Nginx, Redis, Composer, and dependencies
#==============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
DISTRO=""
PACKAGE_MANAGER=""
DB_PASSWORD=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Detect operating system
detect_os() {
    log_info "Detecting operating system..."
    
    if [[ ! -f /etc/os-release ]]; then
        log_error "Cannot detect operating system. /etc/os-release not found."
        exit 1
    fi
    
    source /etc/os-release
    
    OS_NAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
    OS_VERSION="$VERSION_ID"
    OS_CODENAME="$VERSION_CODENAME"
    
    case "$OS_NAME" in
        *ubuntu*)
            DISTRO="ubuntu"
            PACKAGE_MANAGER="apt"
            ;;
        *debian*)
            DISTRO="debian"
            PACKAGE_MANAGER="apt"
            ;;
        *"red hat"*|*rhel*)
            DISTRO="rhel"
            PACKAGE_MANAGER=$(command -v dnf >/dev/null 2>&1 && echo "dnf" || echo "yum")
            ;;
        *rocky*)
            DISTRO="rocky"
            PACKAGE_MANAGER="dnf"
            ;;
        *almalinux*)
            DISTRO="alma"
            PACKAGE_MANAGER="dnf"
            ;;
        *)
            log_error "Unsupported operating system: $OS_NAME"
            log_error "Supported distributions: Ubuntu, Debian, RHEL, Rocky Linux, AlmaLinux"
            exit 1
            ;;
    esac
    
    log_success "Detected: $OS_NAME $OS_VERSION ($DISTRO)"
}

# Install basic dependencies
install_dependencies() {
    log_info "Installing basic dependencies..."
    
    case "$PACKAGE_MANAGER" in
        apt)
            apt update
            apt -y install software-properties-common curl apt-transport-https ca-certificates gnupg lsb-release wget
            ;;
        dnf|yum)
            $PACKAGE_MANAGER -y install epel-release
            $PACKAGE_MANAGER -y install curl wget gnupg2 ca-certificates lsb-release
            ;;
    esac
    
    log_success "Basic dependencies installed"
}

# Setup repositories for Debian/Ubuntu
setup_debian_ubuntu_repos() {
    log_info "Setting up repositories for $DISTRO..."
    
    # PHP Repository (Ondrej PPA for Ubuntu, Sury for Debian)
    if [[ "$DISTRO" == "ubuntu" ]]; then
        LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php
    elif [[ "$DISTRO" == "debian" ]]; then
        wget -qO /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
        echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
    fi
    
    # Redis Repository
    curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list
    
    # MariaDB Repository
    curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | bash -s -- --mariadb-server-version="10.11"
    
    # Update package lists
    apt update
    
    log_success "Repositories configured for $DISTRO"
}

# Setup repositories for RHEL-based systems
setup_rhel_repos() {
    log_info "Setting up repositories for $DISTRO..."
    
    # Install EPEL if not already installed
    if ! rpm -qa | grep -q epel-release; then
        $PACKAGE_MANAGER -y install epel-release
    fi
    
    # Install Remi repository for PHP
    if [[ "$DISTRO" == "rhel" ]]; then
        $PACKAGE_MANAGER -y install https://rpms.remirepo.net/enterprise/remi-release-${OS_VERSION%%.*}.rpm
    else
        # Rocky Linux and AlmaLinux
        $PACKAGE_MANAGER -y install https://rpms.remirepo.net/enterprise/remi-release-${OS_VERSION%%.*}.rpm
    fi
    
    # Enable Remi PHP 8.3
    $PACKAGE_MANAGER -y module reset php
    $PACKAGE_MANAGER -y module enable php:remi-8.3
    
    # MariaDB Repository
    cat > /etc/yum.repos.d/MariaDB.repo << EOF
[mariadb]
name = MariaDB
baseurl = https://rpm.mariadb.org/10.11/rhel/\$releasever/\$basearch
module_hotfixes = 1
gpgkey = https://rpm.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck = 1
EOF
    
    # Redis is available from EPEL repository (no need for Remi module)
    # Note: Redis from EPEL is sufficient for Phoenix Panel requirements
    
    log_success "Repositories configured for $DISTRO"
}

# Install packages for Debian/Ubuntu
install_debian_ubuntu_packages() {
    log_info "Installing packages for $DISTRO..."
    
    # Install PHP 8.3 and extensions
    apt -y install --allow-downgrades php8.3 php8.3-common php8.3-cli php8.3-gd php8.3-mysql \
                   php8.3-mbstring php8.3-bcmath php8.3-xml php8.3-fpm \
                   php8.3-curl php8.3-zip
    
    # Install other packages
    apt -y install --allow-downgrades mariadb-server nginx redis-server tar unzip git curl
    
    log_success "Packages installed for $DISTRO"
}

# Install packages for RHEL-based systems
install_rhel_packages() {
    log_info "Installing packages for $DISTRO..."
    
    # Install PHP 8.3 and extensions
    $PACKAGE_MANAGER -y install php php-common php-cli php-gd php-mysqlnd \
                                php-mbstring php-bcmath php-xml php-fpm \
                                php-curl php-zip
    
    # Install other packages
    $PACKAGE_MANAGER -y install MariaDB-server nginx redis tar unzip git curl
    
    log_success "Packages installed for $DISTRO"
}

# Install Composer
install_composer() {
    log_info "Installing Composer..."
    
    # Download and install Composer
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    
    # Make sure composer is executable
    chmod +x /usr/local/bin/composer
    
    # Update PATH to include /usr/local/bin if not already there
    if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
        export PATH="/usr/local/bin:$PATH"
    fi
    
    # Verify installation by checking the file exists and is executable
    if [[ -x /usr/local/bin/composer ]]; then
        log_success "Composer installed successfully"
        /usr/local/bin/composer --version
    else
        log_error "Composer installation failed"
        exit 1
    fi
}

# Install NVM and Node.js with Yarn
install_nvm_node_yarn() {
    log_info "Installing NVM (Node Version Manager)..."
    
    # Install NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Source NVM to make it available in current session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    # Install Node.js 16.10.0
    log_info "Installing Node.js 16.10.0..."
    nvm install 16.10.0
    nvm use 16.10.0
    nvm alias default 16.10.0
    
    # Install Yarn globally
    log_info "Installing Yarn globally..."
    npm install -g yarn
    
    # Verify installations
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        log_success "Node.js installed: $NODE_VERSION"
    else
        log_error "Node.js installation verification failed"
        return 1
    fi
    
    if command -v yarn >/dev/null 2>&1; then
        YARN_VERSION=$(yarn --version)
        log_success "Yarn installed: $YARN_VERSION"
    else
        log_error "Yarn installation verification failed"
        return 1
    fi
    
    # Make NVM available for all users
    log_info "Configuring NVM for all users..."
    cat >> /etc/profile.d/nvm.sh << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
    
    log_success "NVM, Node.js, and Yarn installed successfully"
}

# Download and setup Phoenix Panel
setup_phoenix_panel() {
    log_info "Setting up Phoenix Panel application..."
    
    # Create Phoenix Panel directory
    PANEL_DIR="/var/www/phoenixpanel"
    mkdir -p "$PANEL_DIR"
    cd "$PANEL_DIR"
    
    log_info "Downloading Phoenix Panel from GitHub..."
    curl -Lo panel.tar.gz https://github.com/phoenixpanel/panel/releases/download/latest/panel.tar.gz
    
    if [[ ! -f panel.tar.gz ]]; then
        log_error "Failed to download Phoenix Panel"
        exit 1
    fi
    
    log_info "Extracting Phoenix Panel..."
    tar -xzvf panel.tar.gz
    
    log_info "Setting proper permissions..."
    chmod -R 755 storage/* bootstrap/cache/
    
    # Copy environment file
    log_info "Setting up environment configuration..."
    cp .env.example .env
    
    # Install Composer dependencies
    log_info "Installing Composer dependencies..."
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
    
    # Generate application key
    log_info "Generating application key..."
    php artisan key:generate --force
    
    # Set ownership to web server user
    case "$DISTRO" in
        ubuntu|debian)
            chown -R www-data:www-data "$PANEL_DIR"
            ;;
        rhel|rocky|alma)
            chown -R nginx:nginx "$PANEL_DIR"
            ;;
    esac
    
    log_success "Phoenix Panel application setup completed"
    log_info "Panel installed in: $PANEL_DIR"
    log_info "Environment file created and application key generated"
}

# Setup database for Phoenix Panel
setup_database() {
    log_info "Setting up database for Phoenix Panel..."
    
    # Generate random 16-character password
    DB_PASSWORD=$(openssl rand -base64 12 | tr -d "=+/" | cut -c1-16)
    
    log_info "Creating database and user..."
    
    # Create SQL commands
    mysql -u root << EOF
DROP USER IF EXISTS 'phoenixpanel'@'127.0.0.1';
DROP DATABASE IF EXISTS panel;
CREATE USER 'phoenixpanel'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
CREATE DATABASE panel;
GRANT ALL PRIVILEGES ON panel.* TO 'phoenixpanel'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF
    
    if [[ $? -eq 0 ]]; then
        log_success "Database and user created successfully"
        log_info "Database: panel"
        log_info "Username: phoenixpanel"
        log_info "Password: $DB_PASSWORD"
        log_warning "Please save these database credentials securely!"
        
        # Update .env file with database credentials
        cd /var/www/phoenixpanel
        sed -i "s/DB_DATABASE=.*/DB_DATABASE=panel/" .env
        sed -i "s/DB_USERNAME=.*/DB_USERNAME=phoenixpanel/" .env
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
        sed -i "s/DB_HOST=.*/DB_HOST=127.0.0.1/" .env
        
        log_success "Environment file updated with database credentials"
        
        # Configure Phoenix Panel database environment
        log_info "Configuring Phoenix Panel database environment..."
        php artisan p:environment:database --host=127.0.0.1 --port=3306 --database=panel --username=phoenixpanel --password="$DB_PASSWORD"
        
        # Run database migrations with seeding
        log_info "Running database migrations and seeding..."
        php artisan migrate --seed --force
        
        log_success "Phoenix Panel database environment configured and migrated"
    else
        log_error "Failed to create database and user"
        log_warning "You may need to run mysql_secure_installation first"
        return 1
    fi
}

# Configure Phoenix Panel environment
configure_phoenix_panel() {
    log_info "Configuring Phoenix Panel environment..."
    
    cd /var/www/phoenixpanel
    
    # Run Phoenix Panel environment setup
    log_info "Running Phoenix Panel environment setup..."
    
    # Temporarily disable exit on error for interactive commands
    set +e
    # Run the command with proper terminal handling
    exec 3<&0 4>&1 5>&2
    php artisan p:environment:setup 0<&3 1>&4 2>&5
    ENV_SETUP_EXIT_CODE=$?
    exec 3<&- 4>&- 5>&-
    set -e
    
    if [[ $ENV_SETUP_EXIT_CODE -ne 0 ]]; then
        log_error "Phoenix Panel environment setup failed"
        exit 1
    fi
    
    # Ask user about SMTP configuration
    echo
    echo -e "${YELLOW}Do you want to configure SMTP for email functionality? (y/n)${NC}"
    read -p "Enter your choice: " smtp_choice
    
    case "$smtp_choice" in
        [Yy]|[Yy][Ee][Ss])
            log_info "Configuring SMTP mail settings..."
            
            # Temporarily disable exit on error for interactive commands
            set +e
            # Run the command with proper terminal handling
            exec 3<&0 4>&1 5>&2
            php artisan p:environment:mail 0<&3 1>&4 2>&5
            MAIL_SETUP_EXIT_CODE=$?
            exec 3<&- 4>&- 5>&-
            set -e
            
            if [[ $MAIL_SETUP_EXIT_CODE -eq 0 ]]; then
                log_success "SMTP mail configuration completed"
            else
                log_warning "SMTP mail configuration encountered issues, but continuing..."
            fi
            ;;
        [Nn]|[Nn][Oo])
            log_info "Skipping SMTP configuration"
            ;;
        *)
            log_warning "Invalid choice. Skipping SMTP configuration"
            ;;
    esac
    
    # Build frontend assets with Yarn
    log_info "Installing frontend dependencies and building assets..."
    
    # Source NVM to ensure Node.js and Yarn are available
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Install dependencies
    yarn install
    
    # Build production assets
    log_info "Building production assets..."
    yarn build:production
    
    log_success "Frontend assets built successfully"
    
    # Create temporary administrative account
    log_info "Creating temporary administrative account..."
    
    # Generate random password for admin account
    ADMIN_PASSWORD=$(openssl rand -base64 12 | tr -d "=+/" | cut -c1-16)
    
    # Get the panel URL from environment or use localhost as default
    PANEL_URL=$(grep "^APP_URL=" .env | cut -d'=' -f2 | sed 's/https\?:\/\///' | sed 's/\///g')
    if [[ -z "$PANEL_URL" || "$PANEL_URL" == "localhost" ]]; then
        PANEL_URL="localhost"
    fi
    
    ADMIN_EMAIL="admin@changeme.com"
    
    # Create the admin user
    php artisan p:user:make --email="$ADMIN_EMAIL" --username=admin --name-first=Admin --name-last=User --password="$ADMIN_PASSWORD" --admin=1
    
    if [[ $? -eq 0 ]]; then
        log_success "Temporary administrative account created"
        log_info "Admin Email: $ADMIN_EMAIL"
        log_info "Admin Password: $ADMIN_PASSWORD"
        log_warning "Please save these admin credentials securely and change the password after first login!"
    else
        log_error "Failed to create administrative account"
    fi
    
    log_success "Phoenix Panel environment configuration completed"
}

# Setup SSL certificates with Certbot
setup_ssl_certificates() {
    echo
    echo -e "${YELLOW}Do you want to set up SSL certificates with Certbot? (y/n)${NC}"
    read -p "Enter your choice: " ssl_choice
    
    case "$ssl_choice" in
        [Yy]|[Yy][Ee][Ss])
            log_info "Setting up SSL certificates with Certbot..."
            
            # Install Certbot
            case "$PACKAGE_MANAGER" in
                apt)
                    apt -y install certbot python3-certbot-nginx
                    ;;
                dnf|yum)
                    $PACKAGE_MANAGER -y install certbot python3-certbot-nginx
                    ;;
            esac
            
            echo -e "${YELLOW}Please enter your domain name (e.g., panel.example.com):${NC}"
            read -p "Domain: " domain_name
            
            if [[ -n "$domain_name" ]]; then
                log_info "Obtaining SSL certificate for $domain_name..."
                certbot --nginx -d "$domain_name" --non-interactive --agree-tos --register-unsafely-without-email
                
                if [[ $? -eq 0 ]]; then
                    log_success "SSL certificate obtained and configured"
                    # Update APP_URL in .env
                    cd /var/www/phoenixpanel
                    sed -i "s|APP_URL=.*|APP_URL=https://$domain_name|" .env
                else
                    log_error "Failed to obtain SSL certificate"
                fi
            else
                log_warning "No domain provided, skipping SSL setup"
            fi
            ;;
        [Nn]|[Nn][Oo])
            log_info "Skipping SSL certificate setup"
            ;;
        *)
            log_warning "Invalid choice. Skipping SSL certificate setup"
            ;;
    esac
}

# Configure Nginx for Phoenix Panel
configure_nginx() {
    log_info "Configuring Nginx for Phoenix Panel..."
    
    # Determine web server user based on distribution
    case "$DISTRO" in
        ubuntu|debian)
            WEB_USER="www-data"
            WEB_GROUP="www-data"
            ;;
        rhel|rocky|alma)
            WEB_USER="nginx"
            WEB_GROUP="nginx"
            ;;
    esac
    
    # Create Nginx configuration
    cat > /etc/nginx/sites-available/phoenixpanel << EOF
server {
    listen 80;
    server_name _;
    root /var/www/phoenixpanel/public;
    index index.php;

    access_log /var/log/nginx/phoenixpanel.app-access.log;
    error_log  /var/log/nginx/phoenixpanel.app-error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)\$;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        include /etc/nginx/fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

    # Handle different Nginx configurations for different distributions
    case "$DISTRO" in
        ubuntu|debian)
            # Enable site
            ln -sf /etc/nginx/sites-available/phoenixpanel /etc/nginx/sites-enabled/phoenixpanel
            # Remove default site
            rm -f /etc/nginx/sites-enabled/default
            # Update PHP-FPM socket path in config if needed
            sed -i 's|fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;|fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;|' /etc/nginx/sites-available/phoenixpanel
            ;;
        rhel|rocky|alma)
            # Move config to conf.d
            mv /etc/nginx/sites-available/phoenixpanel /etc/nginx/conf.d/phoenixpanel.conf
            # Update PHP-FPM socket path for RHEL-based systems
            sed -i 's|fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;|fastcgi_pass 127.0.0.1:9000;|' /etc/nginx/conf.d/phoenixpanel.conf
            ;;
    esac
    
    # Set proper ownership
    chown -R $WEB_USER:$WEB_GROUP /var/www/phoenixpanel
    
    # Test Nginx configuration
    nginx -t
    if [[ $? -eq 0 ]]; then
        systemctl reload nginx
        log_success "Nginx configured successfully"
    else
        log_error "Nginx configuration test failed"
        return 1
    fi
}

# Setup crontab for Phoenix Panel
setup_crontab() {
    log_info "Setting up crontab for Phoenix Panel..."
    
    # Add cron job for Phoenix Panel scheduler
    (crontab -l 2>/dev/null; echo "* * * * * php /var/www/phoenixpanel/artisan schedule:run >> /dev/null 2>&1") | crontab -
    
    log_success "Crontab configured for Phoenix Panel scheduler"
}

# Setup queue worker service
setup_queue_worker() {
    log_info "Setting up Phoenix Panel queue worker service..."
    
    # Determine web server user based on distribution
    case "$DISTRO" in
        ubuntu|debian)
            WEB_USER="www-data"
            WEB_GROUP="www-data"
            ;;
        rhel|rocky|alma)
            WEB_USER="nginx"
            WEB_GROUP="nginx"
            ;;
    esac
    
    # Create systemd service file
    cat > /etc/systemd/system/phoenix.service << EOF
# PhoenixPanel Queue Worker File
# ----------------------------------

[Unit]
Description=PhoenixPanel Queue Worker
After=$REDIS_SERVICE.service

[Service]
# On some systems the user and group might be different.
# Some systems use \`apache\` or \`nginx\` as the user and group.
User=$WEB_USER
Group=$WEB_GROUP
Restart=always
ExecStart=/usr/bin/php /var/www/phoenixpanel/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable the service
    systemctl daemon-reload
    systemctl enable phoenix.service
    systemctl start phoenix.service
    
    if systemctl is-active --quiet phoenix.service; then
        log_success "Phoenix Panel queue worker service started successfully"
    else
        log_error "Failed to start Phoenix Panel queue worker service"
        return 1
    fi
}

# Enable and start services
configure_services() {
    log_info "Configuring and starting services..."
    
    # Service names might differ between distributions
    case "$DISTRO" in
        ubuntu|debian)
            MARIADB_SERVICE="mariadb"
            PHP_FPM_SERVICE="php8.3-fpm"
            REDIS_SERVICE="redis-server"
            ;;
        rhel|rocky|alma)
            MARIADB_SERVICE="mariadb"
            PHP_FPM_SERVICE="php-fpm"
            REDIS_SERVICE="redis"
            ;;
    esac
    
    # Enable and start services
    systemctl enable nginx
    systemctl enable $MARIADB_SERVICE
    systemctl enable $PHP_FPM_SERVICE
    systemctl enable $REDIS_SERVICE
    
    systemctl start nginx
    systemctl start $MARIADB_SERVICE
    systemctl start $PHP_FPM_SERVICE
    systemctl start $REDIS_SERVICE
    
    log_success "Services configured and started"
}

# Verify installations
verify_installation() {
    log_info "Verifying installations..."
    
    # Check PHP
    if command -v php >/dev/null 2>&1; then
        PHP_VERSION=$(php -v | head -n1)
        log_success "PHP installed: $PHP_VERSION"
    else
        log_error "PHP installation verification failed"
        return 1
    fi
    
    # Check Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_warning "Nginx is not running"
    fi
    
    # Check MariaDB
    if systemctl is-active --quiet mariadb; then
        log_success "MariaDB is running"
    else
        log_warning "MariaDB is not running"
    fi
    
    # Check Redis (use proper service name based on distribution)
    case "$DISTRO" in
        ubuntu|debian)
            REDIS_SERVICE="redis-server"
            ;;
        rhel|rocky|alma)
            REDIS_SERVICE="redis"
            ;;
    esac
    
    if systemctl is-active --quiet $REDIS_SERVICE; then
        log_success "Redis is running"
    else
        log_warning "Redis is not running"
    fi
    
    # Check Phoenix Queue Worker
    if systemctl is-active --quiet phoenix; then
        log_success "Phoenix queue worker is running"
    else
        log_warning "Phoenix queue worker is not running"
    fi
    
    # Check Composer
    if command -v composer >/dev/null 2>&1; then
        COMPOSER_VERSION=$(composer --version --no-ansi)
        log_success "Composer installed: $COMPOSER_VERSION"
    else
        log_error "Composer installation verification failed"
        return 1
    fi
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        log_success "Node.js installed: $NODE_VERSION"
    else
        log_warning "Node.js installation verification failed"
    fi
    
    # Check Yarn
    if command -v yarn >/dev/null 2>&1; then
        YARN_VERSION=$(yarn --version)
        log_success "Yarn installed: $YARN_VERSION"
    else
        log_warning "Yarn installation verification failed"
    fi
}

# Display post-installation information
show_post_install_info() {
    echo
    log_success "Installation completed successfully!"
    echo
    echo -e "${BLUE}=== Post-Installation Information ===${NC}"
    echo
    echo "Services installed and configured:"
    echo "  • PHP 8.3 with extensions (FPM enabled)"
    echo "  • MariaDB Server"
    echo "  • Nginx Web Server"
    echo "  • Redis Server"
    echo "  • Composer"
    echo "  • Node.js (via NVM)"
    echo "  • Yarn (global package manager)"
    echo "  • Phoenix Panel (installed in /var/www/phoenixpanel)"
    echo
    echo "Next steps:"
    echo "  1. Set up firewall rules for web services (ports 80, 443)"
    echo "  2. Access Phoenix Panel via web browser"
    echo "  3. Change the default admin password after first login"
    echo "  4. Configure additional settings as needed"
    echo
    echo "Database Information:"
    echo "  • Database: panel"
    echo "  • Username: phoenixpanel"
    echo "  • Password: $DB_PASSWORD"
    echo
    echo "Admin Account Information:"
    echo "  • Email: $ADMIN_EMAIL"
    echo "  • Password: $ADMIN_PASSWORD"
    echo "  • Note: Change password after first login!"
    echo
    echo "Service management commands:"
    echo "  • systemctl status nginx"
    echo "  • systemctl status mariadb"
    echo "  • systemctl status php-fpm (or php8.3-fpm)"
    echo "  • systemctl status redis"
    echo "  • systemctl status phoenix (queue worker)"
    echo
    echo "Additional Information:"
    echo "  • Nginx configuration: /etc/nginx/sites-available/phoenixpanel (Ubuntu/Debian)"
    echo "  • Nginx configuration: /etc/nginx/conf.d/phoenixpanel.conf (RHEL/Rocky/Alma)"
    echo "  • Phoenix Panel directory: /var/www/phoenixpanel"
    echo "  • Queue worker service: phoenix.service"
    echo "  • Cron job configured for Laravel scheduler"
    echo
    log_info "Installation log completed at $(date)"
}

# Main installation function
main() {
    echo -e "${BLUE}"
    echo "=============================================="
    echo "    Phoenix Panel Auto-Installer Script"
    echo "=============================================="
    echo -e "${NC}"
    echo
    
    log_info "Starting installation process..."
    
    # Pre-installation checks
    check_root
    detect_os
    
    # Installation steps
    install_dependencies
    
    case "$PACKAGE_MANAGER" in
        apt)
            setup_debian_ubuntu_repos
            install_debian_ubuntu_packages
            ;;
        dnf|yum)
            setup_rhel_repos
            install_rhel_packages
            ;;
    esac
    
    install_composer
    install_nvm_node_yarn
    setup_phoenix_panel
    configure_services
    setup_database
    configure_phoenix_panel
    configure_nginx
    setup_ssl_certificates
    setup_crontab
    setup_queue_worker
    
    # Post-installation
    if verify_installation; then
        show_post_install_info
    else
        log_error "Some verification checks failed. Please review the installation."
        exit 1
    fi
}

# Trap to handle script interruption
trap 'log_error "Installation interrupted by user"; exit 1' INT TERM

# Run main function
main "$@"
