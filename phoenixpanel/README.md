[![Logo Image](https://cdn.phoenixpanel.io/logos/new/phoenixpanel_logo.png)](https://phoenixpanel.io)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/phoenixpanel/panel/ci.yaml?label=Tests&style=for-the-badge&branch=1.0-develop)
![Discord](https://img.shields.io/discord/122900397965705216?label=Discord&logo=Discord&logoColor=white&style=for-the-badge)
![GitHub Releases](https://img.shields.io/github/downloads/phoenixpanel/panel/latest/total?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/phoenixpanel/panel?style=for-the-badge)

# PhoenixPanel

PhoenixPanel® is a free, open-source game server management panel built with PHP, React, and Go. Designed with security
in mind, PhoenixPanel runs all game servers in isolated Docker containers while exposing a beautiful and intuitive
UI to end users.

Stop settling for less. Make game servers a first class citizen on your platform.

![Image](https://cdn.phoenixpanel.io/site-assets/phoenixpanel_v1_demo.gif)

## Documentation

* [Panel Documentation](https://phoenixpanel.io/panel/1.0/getting_started.html)
* [Wings Documentation](https://phoenixpanel.io/wings/1.0/installing.html)
* [Community Guides](https://phoenixpanel.io/community/about.html)
* Or, get additional help [via Discord](https://discord.gg/phoenixpanel)

## Installation

These instructions cover the installation of the PhoenixPanel web panel on various Linux distributions.

**Prerequisites:**

*   A server running Ubuntu, Debian, or a RHEL-based distribution (CentOS, Fedora, AlmaLinux, etc.).
*   Root access or `sudo` privileges.
*   Required software: Web Server (Nginx or Apache), **PHP 8.2 or 8.3 (PHP 8.3 Recommended)**, Composer v2, MariaDB/MySQL, Redis (`redis-server`), `tar`, `unzip`, `wget`, `git`.

### 1. Install Dependencies

**Debian/Ubuntu:**

```bash
# Add repositories for PHP 8.2/8.3 if needed (check OS version)
# Example for Ubuntu using Ondřej Surý's PPA (recommended):
# sudo apt update
# sudo apt install -y software-properties-common
# sudo add-apt-repository ppa:ondrej/php -y # Adds support for multiple PHP versions
# sudo add-apt-repository ppa:ondrej/php -y

sudo apt update
# Install PHP 8.3 (Recommended) or PHP 8.2
sudo apt install -y php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \
                    nginx mariadb-server redis-server tar unzip git wget curl
```

**RHEL-based (CentOS/Fedora/AlmaLinux):**

```bash
# Enable EPEL and REMI repositories for PHP 8.2/8.3 and other packages
sudo dnf install -y epel-release https://rpms.remirepo.net/enterprise/remi-release-$(rpm -E %rhel).rpm
sudo dnf module reset php -y
# Enable PHP 8.3 (Recommended) or PHP 8.2
sudo dnf module enable php:remi-8.3 -y

sudo dnf update -y
# Install PHP 8.3 (Recommended) or PHP 8.2
sudo dnf install -y php php-{common,cli,gd,mysqlnd,mbstring,bcmath,xml,fpm,curl,zip} \
                    nginx mariadb-server redis tar unzip git wget curl

# Start and enable services
sudo systemctl enable --now nginx mariadb redis
```

**Install Composer:**

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### 2. Configure Database

Log into MySQL/MariaDB and create a database and user for PhoenixPanel.

```sql
sudo mysql -u root -p

# Replace 'your_password' with a strong password
CREATE USER 'phoenixpanel'@'127.0.0.1' IDENTIFIED BY 'your_password';
CREATE DATABASE panel;
GRANT ALL PRIVILEGES ON panel.* TO 'phoenixpanel'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### 3. Download and Configure Panel

```bash
# Create the directory and download panel files (replace with actual release URL/method)
sudo mkdir -p /var/www/phoenixpanel
cd /var/www/phoenixpanel

# Example: Download latest release tarball (adjust URL as needed)
sudo curl -L -o panel.tar.gz https://github.com/phoenixpanel/panel/releases/latest/download/panel.tar.gz
sudo tar -xzvf panel.tar.gz
sudo rm panel.tar.gz

# Set permissions for Composer
sudo chown -R $USER:$USER .

# Install dependencies
composer install --no-dev --optimize-autoloader

# Copy environment file and set application key
cp .env.example .env
composer update --ignore-platform-req=ext-posix # Update lock file if needed after edits
php artisan key:generate --force
```

### 4. Setup Panel Configuration

Run the following commands to set up the database, create an admin user, and configure the environment settings interactively.

```bash
# Migrate database and seed core data
php artisan migrate --seed --force

# Setup core environment settings (follow prompts)
php artisan p:environment:setup

# Setup database connection details (follow prompts)
php artisan p:environment:database

# Create initial admin user (follow prompts)
php artisan p:user:make

# Setup mail environment details (follow prompts - optional)
php artisan p:environment:mail
```

### 5. Set File Permissions

Set the correct ownership for the panel files. The user depends on your OS and web server.

**Debian/Ubuntu (Nginx/Apache):**

```bash
# If using Nginx/Apache on Debian/Ubuntu, the user is typically www-data
sudo chown -R www-data:www-data /var/www/phoenixpanel/*
sudo chmod -R 755 /var/www/phoenixpanel/storage/* /var/www/phoenixpanel/bootstrap/cache/*
```

**RHEL-based (Nginx):**

```bash
# If using Nginx on RHEL-based, the user is typically nginx
sudo chown -R nginx:nginx /var/www/phoenixpanel/*
sudo chmod -R 755 /var/www/phoenixpanel/storage/* /var/www/phoenixpanel/bootstrap/cache/*
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/phoenixpanel/storage(/.*)?"
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/phoenixpanel/bootstrap/cache(/.*)?"
sudo restorecon -R /var/www/phoenixpanel
```

**RHEL-based (Apache):**

```bash
# If using Apache on RHEL-based, the user is typically apache
sudo chown -R apache:apache /var/www/phoenixpanel/*
sudo chmod -R 755 /var/www/phoenixpanel/storage/* /var/www/phoenixpanel/bootstrap/cache/*
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/phoenixpanel/storage(/.*)?"
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/phoenixpanel/bootstrap/cache(/.*)?"
sudo restorecon -R /var/www/phoenixpanel
```

### 6. Configure Queue Worker

PhoenixPanel requires a queue worker to handle background tasks.

**Create Systemd Service File:**

```bash
sudo nano /etc/systemd/system/pteroq.service
```

Paste the following content:

```ini
# PhoenixPanel Queue Worker File
# ----------------------------------

[Unit]
Description=PhoenixPanel Queue Worker
After=redis-server.service

[Service]
User=www-data # Use nginx/apache on RHEL-based systems
Group=www-data # Use nginx/apache on RHEL-based systems
Restart=always
ExecStart=/usr/bin/php /var/www/phoenixpanel/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
WorkingDirectory=/var/www/phoenixpanel

[Install]
WantedBy=multi-user.target
```

**Enable and Start the Service:**

```bash
sudo systemctl enable --now pteroq.service
```

### 7. Configure Web Server

**Nginx Example:**

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/phoenixpanel.conf
# On RHEL-based: sudo nano /etc/nginx/conf.d/phoenixpanel.conf
```

Paste the following configuration, adjusting `server_name` and PHP socket path if necessary:

```nginx
server {
    listen 80;
    server_name your.domain.com; # Replace with your domain

    root /var/www/phoenixpanel/public;
    index index.php;

    access_log /var/log/nginx/phoenixpanel.app-access.log;
    error_log  /var/log/nginx/phoenixpanel.app-error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock; # Adjust PHP version/path if needed
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_PROXY ""; # Mitigate httpoxy vulnerability
        fastcgi_read_timeout 300; # Increase timeout for larger uploads
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Enable the site and restart Nginx:

```bash
# Debian/Ubuntu:
sudo ln -s /etc/nginx/sites-available/phoenixpanel.conf /etc/nginx/sites-enabled/phoenixpanel.conf
sudo systemctl restart nginx

# RHEL-based:
sudo systemctl restart nginx
```

**Apache Example:**

Ensure `mod_rewrite` is enabled (`sudo a2enmod rewrite` on Debian/Ubuntu). Create a new Apache configuration file:

```bash
sudo nano /etc/apache2/sites-available/phoenixpanel.conf
# On RHEL-based: sudo nano /etc/httpd/conf.d/phoenixpanel.conf
```

Paste the following configuration, adjusting `ServerName` and paths if necessary:

```apache
<VirtualHost *:80>
    ServerName your.domain.com # Replace with your domain
    DocumentRoot "/var/www/phoenixpanel/public"

    AllowEncodedSlashes NoDecode
    <Directory "/var/www/phoenixpanel/public">
        Require all granted
        AllowOverride all
        Options FollowSymLinks MultiViews
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/phoenixpanel-error.log
    CustomLog ${APACHE_LOG_DIR}/phoenixpanel-access.log combined
    # On RHEL-based, use /var/log/httpd/ instead of ${APACHE_LOG_DIR}
</VirtualHost>
```

Enable the site and restart Apache:

```bash
# Debian/Ubuntu:
sudo a2ensite phoenixpanel.conf
sudo systemctl restart apache2

# RHEL-based:
sudo systemctl restart httpd
```

**(Optional) Configure SSL:** After confirming the panel works over HTTP, configure SSL using Certbot or your preferred method.

**(Optional) Configure Cronjob:** Set up a cronjob to run the Laravel scheduler:
```bash
* * * * * php /var/www/phoenixpanel/artisan schedule:run >> /dev/null 2>&1
```


## Development

### Frontend Development Workflow

This section outlines the unified command for running the frontend development environment.

#### Purpose

The `yarn dev` command streamlines the frontend development startup process by:

1.  **Validating Environment:** Ensuring the necessary backend URL (`APP_URL`) is configured.
2.  **Installing Dependencies:** Automatically installing Node.js dependencies (`node_modules`) if they are missing.
3.  **Launching Dev Server:** Starting the Webpack development server with hot-reloading and file watching.

#### Command

To start the frontend development server, run:

```bash
yarn dev
```

#### Prerequisites

*   **Node.js:** Version 14 or higher installed.
*   **Yarn:** Yarn package manager installed (`npm install -g yarn`).
*   **.env File:** A `.env` file must exist in the project root. You can create one by copying the example using: `cp .env.example .env`

#### Environment Variable Setup

The development workflow requires the backend application URL to be set.

1.  Open the `.env` file in the project root.
2.  Ensure the following variable is defined with the correct URL for your local backend environment:

    ```dotenv
    APP_URL=http://your-phoenixpanel-backend.test
    ```

    Replace `http://your-phoenixpanel-backend.test` with the actual URL your backend Laravel application is served from (this might be `http://localhost:8000` or a custom domain if using tools like Laragon, Docker, etc.).

#### Key Files

*   **`package.json`:** Contains the `dev` script definition and other project metadata/dependencies.
*   **`scripts/dev-workflow.js`:** The Node.js helper script that orchestrates the validation, installation, and server launch steps.
*   **`.env`:** Stores local environment variables, including the required `APP_URL`.
*   **`webpack.config.js`:** Configures the Webpack development server launched by the `serve` script (which is called by `dev-workflow.js`).

#### Expected Behavior & Output

When you run `yarn dev`:

1.  The script checks for `APP_URL` in `.env`. If missing, it shows an error and stops.
    ```
    [dev-workflow] Checking for required environment variable: APP_URL...
    [dev-workflow] Error: Environment variable 'APP_URL' is not set.
    Please define it in your .env file (e.g., APP_URL=http://your-backend.test)
    ```
2.  It checks for the `node_modules` directory. If missing, it runs `yarn install`.
    ```
    [dev-workflow] Checking if dependencies are installed...
    [dev-workflow] 'node_modules' directory not found. Installing dependencies using yarn...
    yarn install v1.22.22
    [1/5] Validating package.json...
    ... (yarn install output) ...
    Done in X.XXs.
    [dev-workflow] Dependencies installed successfully.
    ```
3.  It launches the development server via `yarn run serve`.
    ```
    [dev-workflow] Launching development server using: yarn run serve...
    yarn run v1.22.22
    $ yarn run clean && cross-env WEBPACK_PUBLIC_PATH=/webpack@hmr/ NODE_ENV=development webpack-dev-server --host 0.0.0.0 --port 8080 --public https://phoenixpanel.test --hot
    ... (webpack dev server output, including build progress and listening address) ...
     ℹ ｢wds｣: Project is running at https://phoenixpanel.test/
     ℹ ｢wds｣: webpack output is served from /
     ℹ ｢wds｣: Content not from webpack is served from C:\Users\lucas\Desktop\base_panel\public
    ```

The server will then watch for file changes and automatically rebuild/refresh.

#### Troubleshooting

*   **`Error: Environment variable 'APP_URL' is not set.`:** Ensure `APP_URL` is correctly defined in your `.env` file in the project root.
*   **Dependency Installation Failures:** Check your Node.js and Yarn installation. Ensure you have network connectivity. You might need to delete `node_modules` and `yarn.lock` and run `yarn install` manually to diagnose further.
*   **Server Start Failures:** Look for errors in the Webpack Dev Server output. Common issues include port conflicts or configuration errors in `webpack.config.js`.

