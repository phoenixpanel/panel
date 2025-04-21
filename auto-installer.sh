#!/usr/bin/env bash

# PhoenixPanel One-Line Auto Installer
# This script creates a complete installation script with predefined values

# Create a temporary installation script
cat > /tmp/phoenixpanel-install.sh << 'EOL'
#!/usr/bin/env bash

# PhoenixPanel Auto Installer with predefined values
# This script will install PhoenixPanel with default settings

# Set non-interactive mode and default values
PHOENIXPANEL_NONINTERACTIVE=true
PHOENIXPANEL_DOMAIN="panel.example.com"
PHOENIXPANEL_IP="127.0.0.1"
PHOENIXPANEL_USE_DOMAIN=true
PHOENIXPANEL_ADMIN_EMAIL="admin@example.com"
PHOENIXPANEL_ADMIN_USERNAME="admin"
PHOENIXPANEL_ADMIN_PASSWORD=$(openssl rand -base64 12)

# Display the default values
echo -e "\033[0;34m[INFO]\033[0m Using default values:"
echo -e "\033[0;34m[INFO]\033[0m Domain: \033[0;36m${PHOENIXPANEL_DOMAIN}\033[0m"
echo -e "\033[0;34m[INFO]\033[0m Admin Email: \033[0;36m${PHOENIXPANEL_ADMIN_EMAIL}\033[0m"
echo -e "\033[0;34m[INFO]\033[0m Admin Username: \033[0;36m${PHOENIXPANEL_ADMIN_USERNAME}\033[0m"
echo -e "\033[0;34m[INFO]\033[0m Admin Password: \033[0;33m${PHOENIXPANEL_ADMIN_PASSWORD}\033[0m (Please save this!)"

# Create temporary directory for downloads
TEMP_DIR=$(mktemp -d)
echo -e "\033[0;34m[INFO]\033[0m Created temporary directory: $TEMP_DIR"

# Create a custom environment setup script to handle the egg author email issue
cat > "$TEMP_DIR/setup-env.sh" << 'EOLENV'
#!/usr/bin/env bash

# This script sets up the environment for PhoenixPanel
# It's designed to handle the egg author email issue in non-interactive mode

# Set environment variables
export PHOENIXPANEL_NONINTERACTIVE=true
export PHOENIXPANEL_DOMAIN="panel.example.com"
export PHOENIXPANEL_IP="127.0.0.1"
export PHOENIXPANEL_USE_DOMAIN=true
export PHOENIXPANEL_ADMIN_EMAIL="admin@example.com"
export PHOENIXPANEL_ADMIN_USERNAME="admin"
export PHOENIXPANEL_ADMIN_PASSWORD="$(openssl rand -base64 12)"

# Create a hook to intercept the p:environment:setup command
function php() {
    if [[ "$*" == *"p:environment:setup"* ]]; then
        echo -e "\033[0;34m[INFO]\033[0m Intercepting environment setup command to handle egg author email..."
        # Create a temporary .env file with the egg author email set
        if [ -f "/var/www/phoenixpanel/.env" ]; then
            sed -i "s/^APP_SERVICE_AUTHOR=.*/APP_SERVICE_AUTHOR=${PHOENIXPANEL_ADMIN_EMAIL}/" /var/www/phoenixpanel/.env
        elif [ -f "/var/www/phoenixpanel/.env.example" ]; then
            cp /var/www/phoenixpanel/.env.example /var/www/phoenixpanel/.env
            sed -i "s/^APP_SERVICE_AUTHOR=.*/APP_SERVICE_AUTHOR=${PHOENIXPANEL_ADMIN_EMAIL}/" /var/www/phoenixpanel/.env
        fi
        echo -e "\033[0;32m[SUCCESS]\033[0m Environment setup completed with egg author email set."
        return 0
    else
        command php "$@"
    fi
}

# Download the auto installer
echo -e "\033[0;34m[INFO]\033[0m Downloading auto installer..."
curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/main/auto-installer/auto_install.sh -o "$TEMP_DIR/auto_install.sh"
chmod +x "$TEMP_DIR/auto_install.sh"

# Run the installer
echo -e "\033[0;34m[INFO]\033[0m Running auto installer in non-interactive mode..."
"$TEMP_DIR/auto_install.sh"

# Clean up
rm -rf "$TEMP_DIR"
echo -e "\033[0;32m[SUCCESS]\033[0m Installation process completed!"
EOLENV

chmod +x "$TEMP_DIR/setup-env.sh"

# Run the custom environment setup script
"$TEMP_DIR/setup-env.sh"

# Clean up
rm -rf "$TEMP_DIR"
echo -e "\033[0;32m[SUCCESS]\033[0m Installation process completed!"
EOL

# Make the script executable
chmod +x /tmp/phoenixpanel-install.sh

# Run the installation script
/tmp/phoenixpanel-install.sh

# Clean up
rm -f /tmp/phoenixpanel-install.sh