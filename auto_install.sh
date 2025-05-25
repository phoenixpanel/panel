#!/usr/bin/env bash

# PhoenixPanel Auto Installer for Linux
# This script detects the Linux distribution and runs the modular installer

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

# --- Linux Distribution Detection ---
detect_linux_distro() {
    print_info "Detecting Linux distribution..."
    
    # Check for Linux
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Detect specific Linux distribution
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            echo "linux-$ID"
        else
            echo "linux-unknown"
        fi
        return
    fi
    
    # Not Linux
    echo "not-linux"
}

# --- Main Script ---
main() {
    print_info "PhoenixPanel Linux Installer"
    print_info "==========================="
    
    DISTRO=$(detect_linux_distro)
    print_info "Detected distribution: $DISTRO"
    
    # Check if running on Linux
    if [[ "$DISTRO" == "not-linux" ]]; then
        print_error "This installer only supports Linux operating systems."
        print_info "Please visit https://phoenixpanel.io/panel/1.0/getting_started.html for manual installation instructions."
        exit 1
    fi
    
    # Create temporary directory for downloads
    TEMP_DIR=$(mktemp -d)
    print_info "Created temporary directory: $TEMP_DIR"
    
    # Download the modular Linux installer
    print_info "Downloading modular Linux installer..."
    curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/main/auto-installer/install.sh -o "$TEMP_DIR/install.sh"
    chmod +x "$TEMP_DIR/install.sh"
    print_info "Running modular Linux installer..."
    "$TEMP_DIR/install.sh"
    
    # Clean up
    rm -rf "$TEMP_DIR"
    print_success "Installation process completed!"
}

# Run the main function
main