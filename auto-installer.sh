#!/usr/bin/env bash

# PhoenixPanel One-Line Auto Installer
# This script downloads and runs the auto installer for PhoenixPanel

# Exit immediately if a command exits with a non-zero status.
set -e

# Download and execute the auto installer
curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/main/auto-installer/auto_install.sh | bash