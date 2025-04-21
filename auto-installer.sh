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

# Download the auto installer
echo -e "\033[0;34m[INFO]\033[0m Downloading auto installer..."
curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/main/auto-installer/auto_install.sh -o "$TEMP_DIR/auto_install.sh"
chmod +x "$TEMP_DIR/auto_install.sh"

# Export environment variables
export PHOENIXPANEL_NONINTERACTIVE
export PHOENIXPANEL_DOMAIN
export PHOENIXPANEL_IP
export PHOENIXPANEL_USE_DOMAIN
export PHOENIXPANEL_ADMIN_EMAIL
export PHOENIXPANEL_ADMIN_USERNAME
export PHOENIXPANEL_ADMIN_PASSWORD

# Run the installer
echo -e "\033[0;34m[INFO]\033[0m Running auto installer in non-interactive mode..."
"$TEMP_DIR/auto_install.sh"

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