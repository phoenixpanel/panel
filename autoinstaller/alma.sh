#!/bin/sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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