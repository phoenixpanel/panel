#!/bin/bash

#################################
#
#         Phoenix Panel
#
#Almalinux 9 - 64 bit installation
#
#            Version
#			 1.0.0
#
#################################

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display success messages
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to display error messages
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo -e "${YELLOW}Installation failed at: $(date)${NC}"
    echo -e "${YELLOW}Please check the error above and try again.${NC}"
    exit 1
}

# Function to display stage information
stage() {
    echo -e "\n${YELLOW}[STAGE]${NC} $1"
}

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root" 
   exit 1
fi

# Get domain from command line argument or prompt user
if [ -z "$1" ]; then
    read -p "Enter your domain (e.g., panel.phoenixpanel.io): " DOMAIN
else
    DOMAIN=$1
fi

# Generate random passwords
generate_password() {
    openssl rand -base64 32 | tr -dc 'a-zA-Z0-9!@#$%^&*()_+?><~=' | head -c 24
}

# Database credentials
DB_PASSWORD=$(generate_password)
DB_USER="phoenixpanel"
DB_NAME="phoenixpanel"

# Admin credentials
ADMIN_EMAIL="admin@${DOMAIN}"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD=$(generate_password)

stage "Starting Phoenix Panel installation..."

# disable selinux
stage "Configuring SELinux..."
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
setenforce 0 || error "Failed to disable SELinux"
success "SELinux disabled successfully"

# Update system
stage "Updating system packages..."
if ! dnf update -y; then
    error "Failed to update system packages"
fi
success "System packages updated successfully"

# Install EPEL and Remi repository
stage "Installing EPEL and Remi repositories..."
if ! dnf install -y epel-release; then
    error "Failed to install EPEL repository"
fi

if ! dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm; then
    error "Failed to install EPEL 9 repository"
fi

if ! dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm; then
    error "Failed to install Remi repository"
fi
success "EPEL and Remi repositories installed successfully"

# enable crb
stage "Enabling CodeReady Builder (CRB) repository..."
if ! dnf config-manager --set-enabled crb; then
    error "Failed to enable CRB repository"
fi
success "CRB repository enabled successfully"

# Enable PHP 8.3 from Remi
stage "Setting up PHP 8.3..."
if ! dnf module reset php -y; then
    error "Failed to reset PHP module"
fi

if ! dnf module enable php:remi-8.3 -y; then
    error "Failed to enable PHP 8.3 module"
fi
success "PHP 8.3 module enabled successfully"

# Install dependencies
stage "Installing dependencies..."
if ! dnf install -y php php-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip,process} mariadb mariadb-server nginx redis zip unzip tar; then
    error "Failed to install dependencies"
fi
success "Dependencies installed successfully"

# Start and enable services
stage "Starting core services..."
if ! systemctl enable --now mariadb nginx redis; then
    error "Failed to enable and start core services"
fi
success "Core services started successfully"

# Install Composer
stage "Installing Composer..."
if ! curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; then
    error "Failed to install Composer"
fi

# Verify Composer installation
if ! composer --version &> /dev/null; then
    error "Composer installation failed or not found in PATH"
fi
success "Composer installed and verified successfully"

# Create PHP-FPM configuration
stage "Configuring PHP-FPM..."
cat > /etc/php-fpm.d/phoenixpanel.conf << 'EOL'
[phoenixpanel]
user = nginx
group = nginx
listen = /var/run/php-fpm/phoenixpanel.sock
listen.owner = nginx
listen.group = nginx
listen.mode = 0750
pm = ondemand
pm.max_children = 9
pm.process_idle_timeout = 10s
pm.max_requests = 200
EOL

# Enable PHP-FPM
stage "Enabling PHP-FPM..."
if ! systemctl enable --now php-fpm; then
    error "Failed to enable PHP-FPM"
fi
success "PHP-FPM enabled successfully"

# Create web directories for Phoenix Panel
stage "Creating web directories..."
mkdir -p /var/www/phoenixpanel || error "Failed to create web directories"
cd /var/www/phoenixpanel || error "Failed to change to web directory"
success "Web directories created successfully"

# Download the files
stage "Downloading Phoenix Panel files..."
if ! curl -Lo develop.tar.gz https://github.com/phoenixpanel/panel/archive/refs/tags/dev.tar.gz; then
    error "Failed to download Phoenix Panel files"
fi

if ! tar --strip-components=1 -xzvf develop.tar.gz; then
    error "Failed to extract Phoenix Panel files"
fi

chmod -R 755 storage/* bootstrap/cache || error "Failed to set permissions on storage directories"
success "Phoenix Panel files downloaded and extracted successfully"

# Configure MariaDB
stage "Configuring MariaDB database..."
if ! mysql -u root << EOF
CREATE USER '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME};
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT
EOF
then
    error "Failed to configure MariaDB database"
fi
success "MariaDB database configured successfully"

# Create storage directories
stage "Setting up storage directories..."
cd /var/www/phoenixpanel/storage/ || error "Failed to change to storage directory"
mkdir -p framework/{sessions,views,cache} || error "Failed to create framework directories"
chmod -R 775 framework || error "Failed to set permissions on framework directories"
success "Storage directories set up successfully"

# Setup .env and composer
stage "Configuring environment and installing dependencies..."
cd /var/www/phoenixpanel || error "Failed to change to Phoenix Panel directory"
cp .env.example .env || error "Failed to create .env file"
sed -i "s/DB_PASSWORD=/DB_PASSWORD=${DB_PASSWORD}/g" .env || error "Failed to set database password in .env"
sed -i "s/DB_USERNAME=phoenixpanel/DB_USERNAME=${DB_USER}/g" .env || error "Failed to set database username in .env"
sed -i "s/DB_DATABASE=panel/DB_DATABASE=${DB_NAME}/g" .env || error "Failed to set database name in .env"
sed -i "s/APP_URL=http:\/\/localhost/APP_URL=https:\/\/${DOMAIN}/g" .env || error "Failed to set app URL in .env"
sed -i "s/APP_ENVIRONMENT_ONLY=false/APP_ENVIRONMENT_ONLY=true/g" .env || error "Failed to set environment mode in .env"

if ! COMPOSER_ALLOW_SUPERUSER=1 php /usr/local/bin/composer install --no-interaction --no-dev --optimize-autoloader; then
    error "Failed to install Composer dependencies"
fi
success "Environment configured and dependencies installed successfully"

# Check if this is a first installation
if [ -z "$2" ] || [ "$2" != "--skip-setup" ]; then
    echo ""
    echo "⚠️  WARNING ⚠️"
    echo "Running key:generate on an existing installation will invalidate all existing encrypted data!"
    echo "This includes user sessions, cookies, and encrypted database values."
    echo "Your data will become INACCESSIBLE and UNRECOVERABLE if you generate a new key on an existing installation."
    echo ""
    read -p "Is this a FIRST installation? Only answer 'y' if this is a NEW installation (y/n): " FIRST_INSTALL
    if [[ $FIRST_INSTALL =~ ^[Yy]$ ]]; then
        # Generate key and setup application
        echo "Generating application key and setting up application..."
        php artisan key:generate --force

        # Create admin user with generated password
        echo "Creating admin user..."
        php artisan p:user:make --email=${ADMIN_EMAIL} --username=${ADMIN_USERNAME} --name-first=Admin --name-last=User --password=${ADMIN_PASSWORD} --admin
        
        # Seed database
        echo "Seeding database..."
        php artisan migrate --seed --force
    else
        echo "Skipping key generation, admin user creation, and database seeding..."
        echo "This is the safe option for existing installations."
    fi
else
    echo "Skipping key generation, admin user creation, and database seeding (--skip-setup flag detected)..."
    echo "This is the safe option for existing installations."
fi

# Set webserver permissions
stage "Setting webserver permissions..."
chown -R nginx:nginx /var/www/phoenixpanel/* || error "Failed to set webserver permissions"
success "Webserver permissions set successfully"

# Setup cron job
stage "Configuring cron job for queue processing..."
if ! (crontab -l 2>/dev/null; echo "* * * * * php /var/www/phoenixpanel/artisan schedule:run >> /dev/null 2>&1") | crontab -; then
    error "Failed to configure cron job"
fi
success "Cron job configured successfully"

# Create queue worker service
stage "Creating queue worker service..."
cat > /etc/systemd/system/phoenix.service << 'EOL'
[Unit]
Description=Phoenix Panel Queue Worker
After=redis-server.service

[Service]
User=nginx
Group=nginx
Restart=always
ExecStart=/usr/bin/php /var/www/phoenixpanel/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOL
success "Queue worker service created successfully"

# Enable services
stage "Enabling services..."
if ! systemctl enable --now redis.service; then
    error "Failed to enable Redis service"
fi

if ! systemctl enable --now phoenix.service; then
    error "Failed to enable Phoenix service"
fi
success "Services enabled successfully"

# Install SSL certificate
stage "Installing SSL certificate..."
if ! dnf install -y certbot python3-certbot-nginx; then
    error "Failed to install SSL tools"
fi

systemctl stop nginx || error "Failed to stop Nginx"
if ! certbot certonly --standalone --non-interactive --agree-tos --email admin@${DOMAIN} -d ${DOMAIN}; then
    error "Failed to obtain SSL certificate"
fi
success "SSL certificate installed successfully"

# Configure Nginx
stage "Configuring Nginx server block..."
cat > /etc/nginx/conf.d/phoenixpanel.conf << EOL
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    root /var/www/phoenixpanel/public;
    index index.php;

    access_log /var/log/nginx/phoenixpanel.access.log;
    error_log  /var/log/nginx/phoenixpanel.error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
    ssl_prefer_server_ciphers on;

    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Robots-Tag none;
    add_header Content-Security-Policy "frame-ancestors 'self'";
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy same-origin;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \\.php$ {
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php-fpm/phoenixpanel.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \\n post_max_size=100M";
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

    location ~ /\\.ht {
        deny all;
    }
}
EOL
success "Nginx configuration applied successfully"

# Restart Nginx
stage "Restarting Nginx..."
if ! systemctl restart nginx; then
    error "Failed to restart Nginx"
fi
success "Nginx restarted successfully"

# Save credentials to a file for reference
stage "Saving credentials..."
cat > /root/phoenixpanel-credentials.txt << EOL
Phoenix Panel Credentials
======================================
Panel URL: https://${DOMAIN}

Admin Credentials:
Username: ${ADMIN_USERNAME}
Email: ${ADMIN_EMAIL}
Password: ${ADMIN_PASSWORD}

Database Credentials:
Database: ${DB_NAME}
Username: ${DB_USER}
Password: ${DB_PASSWORD}

Installation Date: $(date)
======================================
EOL
chmod 600 /root/phoenixpanel-credentials.txt || error "Failed to secure credentials file"
success "Credentials saved successfully"

# Final completion message
stage "Installation Complete"
success "Phoenix Panel installation completed!"
echo ""
echo "Panel URL: https://${DOMAIN}"
echo ""
echo "Admin Credentials:"
echo "Username: ${ADMIN_USERNAME}"
echo "Email: ${ADMIN_EMAIL}"
echo "Password: ${ADMIN_PASSWORD}"
echo ""
echo "Database Credentials:"
echo "Database: ${DB_NAME}"
echo "Username: ${DB_USER}"
echo "Password: ${DB_PASSWORD}"
echo ""
echo "These credentials have been saved to /root/phoenixpanel-credentials.txt"
echo ""
echo "Need help? Join our Discord server: https://discord.gg/vGDvr74q"
echo "========================================"
