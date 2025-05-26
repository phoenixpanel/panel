#!/bin/sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Register global variables
OS_NAME=""
OS_VERSION=""
OS_CODENAME=""

PACKAGE_MANAGER=""
DISTRO=""

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
    
    #log_debug "OS_NAME: $OS_NAME"
    #log_debug "OS_VERSION: $OS_VERSION"
    #log_debug "OS_CODENAME: $OS_CODENAME"
    
    case "$OS_NAME" in
        *ubuntu*)
            DISTRO="ubuntu"
            PACKAGE_MANAGER="apt"
            ;;
        *debian*)
            DISTRO="debian"
            PACKAGE_MANAGER="apt"
        #*"red hat"*|*rhel*)
        #    DISTRO="rhel"
        #    PACKAGE_MANAGER=$(command -v dnf >/dev/null 2>&1 && echo "dnf" || echo "yum")
        #    ;;
        #*rocky*)
        #    DISTRO="rocky"
        #    PACKAGE_MANAGER="dnf"

            ;;
        *almalinux*)
            DISTRO="alma"
            PACKAGE_MANAGER="dnf"
            ;;
        *)
            log_error "Unsupported operating system: $OS_NAME"
            log_error "Supported distributions: Ubuntu, Debian, AlmaLinux"
            exit 1
            ;;
    esac
    
    log_success "Detected: $OS_NAME $OS_VERSION ($DISTRO)"
    log_debug "Package manager: $PACKAGE_MANAGER"
}


# Example of getting an input:
#NAME=$(get_user_input "Please enter your name")
#echo "$NAME"

get_user_input() {
    PROMPT_MESSAGE="$1"
    read -p "$PROMPT_MESSAGE" resp
    echo "$resp"
}

# Detect OS
detect_os
case "$OS_NAME" in
    ubuntu)
        echo "You're running an Ubuntu Machine"
        sh -c 'curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/refs/heads/main/autoinstaller/ubuntu.sh | bash'
        ;;
    debian)
        echo "You're running a Debian Machine"
        sh -c 'curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/refs/heads/main/autoinstaller/debian.sh | bash'
        ;;
    almalinux)
        echo "You're running an AlmaLinux Machine"
        sh -c 'curl -sSL https://raw.githubusercontent.com/phoenixpanel/panel/refs/heads/main/autoinstaller/alma.sh | bash'
        ;;
    *)
        ;;
esac