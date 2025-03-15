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

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
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

echo "Starting Phoenix Panel installation..."

# disable selinux
echo "Disabling SELinux..."
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
setenforce 0

# Update system
echo "Updating system..."
dnf update -y

# Install EPEL and Remi repository
echo "Installing EPEL and Remi repositories..."
dnf install -y epel-release
dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm

# enable crb
echo "Enabling CRB..."
dnf config-manager --set-enabled crb

# Enable PHP 8.3 from Remi
echo "Enabling PHP 8.3 from Remi..."
dnf module reset php -y
dnf module enable php:remi-8.3 -y

# Install dependencies
echo "Installing dependencies..."
dnf install -y php php-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip,process} mariadb mariadb-server nginx redis zip unzip tar

# Start and enable services
echo "Starting and enabling services..."
systemctl enable --now mariadb nginx redis

# Install Composer
echo "Installing Composer..."
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create PHP-FPM configuration
echo "Creating Phoenix Panel PHP-FPM configuration..."
cat > /etc/php-fpm.d/phoenixpanel.conf << 'EOL'
[phoenixpanel]
user = nginx
group = nginx
listen = /var/run/php-fpm/www.sock
listen.owner = nginx
listen.group = nginx
listen.mode = 0750
pm = ondemand
pm.max_children = 9
pm.process_idle_timeout = 10s
pm.max_requests = 200
EOL

# Enable PHP-FPM
echo "Enabling PHP-FPM..."
systemctl enable --now php-fpm

# Create web directories for Phoenix Panel
echo "Creating web directories..."
mkdir -p /var/www/phoenixpanel
cd /var/www/phoenixpanel

# Download the files
echo "Downloading Phoenix Panel files..."
curl -Lo develop.tar.gz https://github.com/phoenixpanel/panel/archive/refs/tags/development.tar.gz
tar --strip-components=1 -xzvf develop.tar.gz
chmod -R 755 storage/* bootstrap/cache

# Configure MariaDB
echo "Configuring MariaDB..."
mysql -u root << EOF
CREATE USER '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME};
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT
EOF

# Create storage directories
echo "Creating storage directories..."
cd /var/www/phoenixpanel/storage/
mkdir -p framework/{sessions,views,cache}
chmod -R 775 framework

# Setup .env and composer
echo "Setting up .env and running composer..."
cd /var/www/phoenixpanel
cp .env.example .env
sed -i "s/DB_PASSWORD=/DB_PASSWORD=${DB_PASSWORD}/g" .env
sed -i "s/DB_USERNAME=pterodactyl/DB_USERNAME=${DB_USER}/g" .env
sed -i "s/DB_DATABASE=panel/DB_DATABASE=${DB_NAME}/g" .env
sed -i "s/APP_URL=http:\/\/localhost/APP_URL=https:\/\/${DOMAIN}/g" .env
sed -i "s/APP_ENVIRONMENT_ONLY=false/APP_ENVIRONMENT_ONLY=true/g" .env
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader

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
echo "Setting webserver permissions..."
chown -R nginx:nginx /var/www/phoenixpanel/*

# Setup cron job
echo "Setting up cron job for queue processing..."
(crontab -l 2>/dev/null; echo "* * * * * php /var/www/phoenixpanel/artisan schedule:run >> /dev/null 2>&1") | crontab -

# Create queue worker service
echo "Creating queue worker service..."
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

# Enable services
echo "Enabling services..."
systemctl enable --now redis.service
systemctl enable --now phoenix.service

# Install SSL certificate
echo "Installing SSL certificate..."
dnf install -y certbot python3-certbot-nginx
systemctl stop nginx
certbot certonly --standalone --non-interactive --agree-tos --email admin@${DOMAIN} -d ${DOMAIN}

# Configure Nginx
echo "Configuring Nginx..."
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

# Restart Nginx
echo "Restarting Nginx..."
systemctl restart nginx

# Save credentials to a file for reference
echo "Saving credentials to /root/phoenixpanel-credentials.txt..."
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
chmod 600 /root/phoenixpanel-credentials.txt

# Display completion message with credentials
echo ""
echo "Phoenix Panel installation completed!"
echo "========================================"
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
