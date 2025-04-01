# Phoenix Panel Installation Guide (Linux)

This guide provides step-by-step instructions for installing the Phoenix Panel on a Linux server. These instructions assume you are installing into the `/var/www/phoenixpanel` directory.

**Target Directory:** `/var/www/phoenixpanel`

## 1. Prerequisites

Ensure your server meets the following requirements:

*   **Web Server:** Nginx or Apache
*   **PHP:** Version 8.1 or higher (check project's `composer.json` for exact requirements if possible) with the following extensions:
    *   BCMath
    *   Ctype
    *   cURL
    *   DOM
    *   Fileinfo
    *   JSON
    *   Mbstring
    *   OpenSSL
    *   PDO (specifically `pdo_mysql` if using MySQL/MariaDB)
    *   Tokenizer
    *   XML
    *   Zip
    *   GD (often needed for image manipulation)
    *   GMP (sometimes required by dependencies)
*   **Database:** MySQL 5.7+ or MariaDB 10.3+
*   **Composer:** Dependency Manager for PHP ([Install Composer](https://getcomposer.org/download/))
*   **Node.js:** Version 16+ (check `package.json` for specifics)
*   **npm or yarn:** JavaScript package manager (comes with Node.js or install yarn separately)
*   **Git:** For cloning or downloading the source code.
*   **Curl:** For downloading files.
*   **Tar:** For extracting archives.
*   **Redis:** (Optional but recommended) For caching and queue management.

**Example Installation (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y # For latest PHP versions
sudo apt update
sudo apt install -y nginx mysql-server php8.1 php8.1-fpm php8.1-cli php8.1-mysql php8.1-bcmath php8.1-ctype php8.1-curl php8.1-dom php8.1-fileinfo php8.1-mbstring php8.1-openssl php8.1-pdo php8.1-tokenizer php8.1-xml php8.1-zip php8.1-gd php8.1-gmp redis-server git curl tar unzip
# Install Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
# Install Node.js (example using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Download and Extract Project

1.  Create the target directory:
    ```bash
    sudo mkdir -p /var/www/phoenixpanel
    ```
2.  Download the latest release archive:
    ```bash
    cd /tmp
    curl -Lo phoenixpanel.tar.gz https://github.com/SHBenno/phoenixpanel-dev/archive/refs/tags/latest.tar.gz
    ```
3.  Extract the archive into the target directory:
    ```bash
    sudo tar -xzvf phoenixpanel.tar.gz -C /var/www/phoenixpanel --strip-components=1
    ```
4.  Navigate to the project directory:
    ```bash
    cd /var/www/phoenixpanel
    ```

## 3. Install Dependencies

1.  **Install PHP Dependencies:**
    ```bash
    sudo composer install --no-dev --optimize-autoloader
    ```
2.  **Install JavaScript Dependencies:**
    *   Using npm:
        ```bash
        sudo npm install
        ```
    *   Or using yarn:
        ```bash
        sudo yarn install
        ```

## 4. Configure Environment

1.  **Copy Environment File:**
    ```bash
    sudo cp .env.example .env
    ```
2.  **Edit `.env` File:**
    Open the `.env` file with a text editor (like `nano` or `vim`) and configure the following settings:
    *   `APP_NAME`: Set your application name.
    *   `APP_ENV`: Set to `production`.
    *   `APP_KEY`: Will be generated in the next step.
    *   `APP_DEBUG`: Set to `false`.
    *   `APP_URL`: Set to the URL you will use to access the panel (e.g., `http://yourdomain.com`).
    *   `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Configure your database connection details. Ensure the database exists and the user has permissions.
    *   `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`: Configure Redis connection details if using it.
    *   `MAIL_*`: Configure your mail driver settings for sending emails.
    ```bash
    sudo nano .env
    ```
3.  **Generate Application Key:**
    ```bash
    sudo php artisan key:generate --force
    ```
4.  **Link Storage:**
    ```bash
    sudo php artisan storage:link
    ```

## 5. Database Setup

1.  **Run Migrations and Seeders:**
    This command sets up the database schema and potentially populates it with initial data.
    ```bash
    sudo php artisan migrate --seed --force
    ```
    *(Note: The `--seed` flag runs database seeders. Check the project documentation if seeding is required or optional.)*

## 6. Compile Frontend Assets

Compile JavaScript and CSS assets for production.

*   Using npm:
    ```bash
    sudo npm run build
    ```
*   Or using yarn:
    ```bash
    sudo yarn build
    ```

## 7. Set Permissions

The web server user (commonly `www-data` on Debian/Ubuntu or `nginx`/`apache` on CentOS/RHEL) needs write access to certain directories.

```bash
# Set ownership to the web server user/group
sudo chown -R www-data:www-data /var/www/phoenixpanel/*
# Set correct permissions (adjust if needed based on project specifics)
sudo find /var/www/phoenixpanel -type f -exec chmod 644 {} \;
sudo find /var/www/phoenixpanel -type d -exec chmod 755 {} \;
# Give write access to storage and bootstrap/cache
sudo chgrp -R www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
```
*(Replace `www-data:www-data` with your actual web server user and group if different.)*

## 8. Configure Web Server

Configure your web server (Nginx or Apache) to serve the application.

**Nginx Example:**

Create a new Nginx configuration file (e.g., `/etc/nginx/sites-available/phoenixpanel.conf`):

```nginx
server {
    listen 80;
    server_name yourdomain.com; # Replace with your domain
    root /var/www/phoenixpanel/public;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust PHP version if needed
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Add SSL configuration here if using HTTPS
    # listen 443 ssl;
    # ssl_certificate /path/to/your/fullchain.pem;
    # ssl_certificate_key /path/to/your/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/phoenixpanel.conf /etc/nginx/sites-enabled/
sudo nginx -t # Test configuration
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm # Restart PHP-FPM
```

**Apache Example:**

Ensure `mod_rewrite` is enabled (`sudo a2enmod rewrite`). Create a new Apache configuration file (e.g., `/etc/apache2/sites-available/phoenixpanel.conf`):

```apache
<VirtualHost *:80>
    ServerName yourdomain.com # Replace with your domain
    DocumentRoot /var/www/phoenixpanel/public

    <Directory /var/www/phoenixpanel/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/phoenixpanel_error.log
    CustomLog ${APACHE_LOG_DIR}/phoenixpanel_access.log combined

    # Add SSL configuration here if using HTTPS
    # SSLEngine on
    # SSLCertificateFile /path/to/your/fullchain.pem
    # SSLCertificateKeyFile /path/to/your/privkey.pem
</VirtualHost>
```

Enable the site and restart Apache:

```bash
sudo a2ensite phoenixpanel.conf
sudo systemctl restart apache2
```

## 9. Setup Queue Worker (Optional but Recommended)

Laravel often uses queues for background tasks. Supervisor is commonly used to keep the queue worker running.

1.  **Install Supervisor:**
    ```bash
    sudo apt install -y supervisor # Debian/Ubuntu
    # sudo yum install -y supervisor # CentOS/RHEL
    # sudo systemctl enable --now supervisor
    ```
2.  **Create Supervisor Configuration:**
    Create a file like `/etc/supervisor/conf.d/phoenix-worker.conf`:
    ```ini
    [program:phoenix-worker]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/phoenixpanel/artisan queue:work --sleep=3 --tries=3 --max-time=3600
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true
    user=www-data # User the worker should run as
    numprocs=2 # Number of worker processes
    redirect_stderr=true
    stdout_logfile=/var/www/phoenixpanel/storage/logs/worker.log
    stopwaitsecs=3600
    ```
3.  **Start the Worker:**
    ```bash
    sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl start phoenix-worker:*
    ```

## 10. Setup Task Scheduling

Laravel's scheduler runs background tasks periodically (e.g., cleanup, sending reports).

1.  **Add Cron Job:**
    Open the crontab for the web server user:
    ```bash
    sudo crontab -u www-data -e
    ```
    Add the following line to run the scheduler every minute:
    ```cron
    * * * * * cd /var/www/phoenixpanel && php artisan schedule:run >> /dev/null 2>&1
    ```

## 11. Final Steps

*   Visit your configured `APP_URL` in a web browser.
*   Follow any on-screen setup instructions if provided by the application.
*   Consult the specific documentation for Phoenix Panel if available for any additional setup steps or configurations.

Installation is complete!
