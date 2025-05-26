#!/bin/sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

USESSL=""

# Enhanced logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    #echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    #echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    #echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    #echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1"
}

log_debug() {
    echo -e "${PURPLE}[DEBUG]${NC} $1"
    #echo "[$(date '+%Y-%m-%d %H:%M:%S')] [DEBUG] $1"
}

# Example of getting an input:
#NAME=$(get_user_input "Please enter your name")
#echo "$NAME"

get_user_input() {
    PROMPT_MESSAGE="$1"
    read -p "$PROMPT_MESSAGE" resp
    echo "$resp"
}

# Function to check SELinux status on AlmaLinux
check_selinux_status() {
  # Check if sestatus command exists
  if ! command -v sestatus &> /dev/null; then
    echo 0
  fi

  # Get SELinux status
  SELINUX_STATUS=$(sestatus | grep "SELinux status:" | awk '{print $3}')

  case "$SELINUX_STATUS" in
    enabled)
      echo 1
      ;;
    disabled)
      echo 0
      ;;
    permissive)
      echo 1
      ;;
    *)
      echo 0
      ;;
  esac

  echo 0
}

selinux=$(check_selinux_status)
if [ selinux = 1 ]; then
    log_info "Due to you having SELinux enabled, I will install the extra packages..."
    sh -c "sudo dnf install -y policycoreutils selinux-policy selinux-policy-targeted setroubleshoot-server setools setools-console mcstrans"
fi

log_info "Installing panel requirements"
sh -c "sudo dnf update -y"
sh -c "sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm"
sh -c "sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm"
sh -c "sudo dnf module reset php"
sh -c "sudo dnf module enable php:remi-8.3 -y"
sh -c "sudo dnf install -y php php-common php-cli php-gd php-mysql php-mbstring php-bcmath php-xml php-fpm php-curl php-zip mariadb mariadb-server nginx redis zip unzip tar"
log_info "Enabling services"
sh -c "sudo systemctl enable --now mariadb nginx redis"

INSTALL_FIREWALL=$(get_user_input "Do you want to install firewall-cmd (y/n): ")
INSTALL_FIREWALL_LOWER=$(echo "$INSTALL_FIREWALL" | tr '[:upper:]' '[:lower:]')

case "$INSTALL_FIREWALL_LOWER" in
    y)
        log_info "Installing firewalld"
        sh -c "sudo dnf install firewalld"
        sh -c "sudo systemctl start firewalld"
        log_info "Firewall setup for HTTP and HTTPs"
        sh -c "sudo firewall-cmd --add-service=http --permanent"
        sh -c "sudo firewall-cmd --add-service=https --permanent "
        sh -c "sudo firewall-cmd --reload"
        sh -c "sudo systemctl enable firewalld"
        ;;
    *)
        log_info "Continuing without firewall..."
        ;;
esac
log_info "Installing composer..."
sh -c "curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer"

log_info "Create phoenixpanel folder"
sh -c "mkdir -p /var/www/phoenixpanel"
sh -c "cd /var/www/phoenixpanel"

sh -c "curl -Lo panel.tar.gz https://github.com/phoenixpanel/panel/releases/download/latest/panel.tar.gz"
sh -c "tar -xzvf panel.tar.gz"
sh -c "chmod -R 755 storage/* bootstrap/cache/"

sh -c "cp .env.example .env"
sh -c "COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader"

sh -c "php artisan key:generate --force"

log_info "Creating new PHP-FPM Configuration"
cat >> /etc/php-fpm.d/www-phoenixpanel.conf << EOF
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
EOF
sh -c "sudo systemctl enable --now php-fpm"

LENGTH=16
DB_USER="phoenixpanel"
DB_PASSWORD=$(head /dev/urandom | tr -dc 'A-Za-z0-9!@#$%^&*()_+-=' | head -c "$LENGTH")
DB_NAME="panel"

mysql <<EOF
CREATE USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

# Check the exit status of the mysql command
if [ $? -eq 0 ]; then
    log_success "MySQL user '$DB_USER' and database '$DB_NAME' created successfully."
else
    log_warning "MySQL DB and/or User already exists."
    cont=$(get_user_input "Would you like to use your already existing details (y/n): ")
    cont=$(echo "$cont" | tr '[:upper:]' '[:lower:]')

    case cont in 
        y)
            DB_USER=$(get_user_input "What's the current username: ")
            DB_PASSWORD=$(get_user_input "What's the current db password: ")
            ;;
        *)
            log_info "Dropping already existing DB + User"
            mysql <<EOF
DROP USER '$DB_USER'@'127.0.0.1';
DROP DATABASE $DB_NAME;

CREATE USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF
            log_success "MySQL user '$DB_USER' and database '$DB_NAME' created successfully."
            ;;
    esac
fi

sh -c "php artisan p:environment:database --host=127.0.0.1 --port=3306 --database=$DB_NAME --username=$DB_USER --password=\"$DB_PASSWORD\" --quiet"
log_success "Setup environment database settings."

sh -c "php artisan p:environment:setup --cache=redis --session=redis --queue=redis --settings-ui=yes --redis-host=127.0.0.1 --redis-pass= --redis-port=6379"
log_success "Setup environment settings."

log_info "Setting up database!"
sh -c "php artisan migrate --seed --force"

ADMIN_PASSWORD=$(head /dev/urandom | tr -dc 'A-Za-z0-9' | head -c "$LENGTH")
ADMIN_EMAIL="admin@phoenix.io"

log_info "Creating administrator account (details at end)"
sh -c "php artisan p:user:make --email=$ADMIN_EMAIL --username=admin --name-first=admin --name-last=admin --password=$ADMIN_PASSWORD --admin=yes"

log_info "Giving permissions to NGINX"
sh -c "chown -R nginx:nginx /var/www/phoenixpanel/*"

sh -c "sudo systemctl disable nginx"

log_info "Setting up Crontab configuration"
CRON_JOB="* * * * * php /var/www/phoenixpanel/artisan schedule:run >> /dev/null 2>&1"
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

log_info "Creating new Queue Worker"
cat > /etc/systemd/system/phoenix.service << EOF
[Unit]
Description=PhoenixPanel Queue Worker
After=redis.service

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
EOF

log_info "Enabling redis + queue worker"
sh -c "sudo systemctl enable --now redis"
sh -c "sudo systemctl enable --now phoenix"

log_info "NGINX Setup"
log_info "Removing default NGINX configuration (if existing)"
sh -c "rm /etc/nginx/sites-enabled/default"

domain=$(get_user_input "What domain are you using (e.g phoenixpanel.io): ")
cat > /etc/nginx/conf.d/phoenixpanel.conf << EOF
server {
    listen 80;
    server_name $domain;

    root /var/www/phoenixpanel/public;
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/phoenixpanel.app-error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php-fpm/phoenixpanel.sock;
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
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

certbot=$(get_user_input "Do you want to use SSL (y/n): ")
case certbot in 
        y)
            log_info "Using SSL, recommended for security."
            sh -c "sudo systemctl enable nginx"
            sh -c "sudo dnf install certbot python3-certbot-nginx"
            sh -c "sudo certbot --nginx -d $domain"
            USESSL="y"
            ;;
        *)
            log_warning "Using HTTP, not recommended for security."
            ;;
esac

sh -c "sudo systemctl restart nginx"
log_success "You've completed the setup."

URL="http://$domain"
if [ USESSL = "y" ]; then
    URL="https://$domain"
fi

log_info "ADMIN USERNAME: admin
ADMIN EMAIL: admin@phoenix.io
ADMIN PASSWORD: $ADMIN_PASSWORD
  [!] Change admin password

Your panel should now be accessible @ $URL

THANKS FOR USING PHOENIXPANEL
~ PhoenixPanel Team :p"