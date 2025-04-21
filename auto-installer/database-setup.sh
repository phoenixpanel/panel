#!/usr/bin/env bash

# PhoenixPanel Database Setup Script
# This script sets up the MySQL database for PhoenixPanel

# Exit immediately if a command exits with a non-zero status.
set -e

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

# Function to generate a random password
generate_password() {
    openssl rand -base64 16
}

# Function to prompt the user for input
prompt_user() {
    local prompt_message=$1
    local user_input
    read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message}")" user_input
    echo "$user_input"
}

# Function to prompt yes/no
prompt_yes_no() {
    local prompt_message=$1
    local default=${2:-y} # Default to yes if not specified
    local answer

    while true; do
        read -p "$(echo -e "${CYAN}[PROMPT]${RESET} ${prompt_message} [y/N]: ")" answer
        answer=${answer:-$default} # Use default if empty
        case $answer in
            [Yy]* ) return 0;; # Yes
            [Nn]* ) return 1;; # No
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# --- Setup MySQL Database ---
setup_mysql() {
    print_info "Configuring MySQL Database..."
    DB_DATABASE="phoenixpanel"
    DB_USERNAME="phoenixpanel"
    DB_PASSWORD=""
    
    # Check if running in non-interactive mode
    if [ "$PHOENIXPANEL_NONINTERACTIVE" = true ]; then
        print_info "Running in non-interactive mode with default values."
        
        # Generate a random password for MySQL
        DB_PASSWORD=$(generate_password)
        print_info "Generated MySQL Password: ${YELLOW}${DB_PASSWORD}${RESET} (Please save this!)"
    else
        # Interactive mode
        if prompt_yes_no "Generate a random password for the MySQL user '${DB_USERNAME}'?"; then
            DB_PASSWORD=$(generate_password)
            print_info "Generated MySQL Password: ${YELLOW}${DB_PASSWORD}${RESET} (Please save this!)"
        else
            while [[ -z "$DB_PASSWORD" ]]; do
                DB_PASSWORD=$(prompt_user "Enter the desired password for MySQL user '${DB_USERNAME}': ")
                if [[ -z "$DB_PASSWORD" ]]; then
                    print_warning "Password cannot be empty."
                fi
            done
        fi
    fi
    
    # MySQL Root Password Handling
    print_info "Checking MySQL root access..."
    MYSQL_ROOT_PASSWORD=""
    MYSQL_COMMAND_BASE="mysql" # Base command
    
    # Try connecting without password first
    if ! $MYSQL_COMMAND_BASE -e "SELECT 1;" > /dev/null 2>&1; then
        print_warning "Could not connect to MySQL as root without a password."
        
        # Check if running in non-interactive mode
        if [ "$PHOENIXPANEL_NONINTERACTIVE" = true ]; then
            print_info "Non-interactive mode: Using empty MySQL root password."
            print_warning "This may fail if MySQL requires a password. Consider running in interactive mode."
            
            # Try with empty password in non-interactive mode
            MYSQL_COMMAND="${MYSQL_COMMAND_BASE} -uroot -p''" # Empty password
            
            # Test connection
            if ! $MYSQL_COMMAND -e "SELECT 1;" > /dev/null 2>&1; then
                print_error "Cannot connect to MySQL with empty password in non-interactive mode. Aborting."
                print_error "Please run the installer in interactive mode or ensure MySQL allows root access without password."
                exit 1
            fi
        else
            # Interactive mode - prompt for password
            while true; do
                read -s -p "$(echo -e "${CYAN}[PROMPT]${RESET} Enter MySQL root password (leave blank to skip): ")" MYSQL_ROOT_PASSWORD
                echo # Newline after password input
                
                if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
                    print_error "MySQL root password is required to proceed with database setup. Aborting."
                    exit 1
                fi
                
                # Test connection with the provided password
                if $MYSQL_COMMAND_BASE -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT 1;" > /dev/null 2>&1; then
                    print_success "MySQL root connection successful."
                    MYSQL_COMMAND="${MYSQL_COMMAND_BASE} -uroot -p'${MYSQL_ROOT_PASSWORD}'" # Use quotes for safety
                    break
                else
                    print_warning "Incorrect MySQL root password. Please try again."
                fi
            done
        fi
    else
        print_info "MySQL root access successful without password."
        MYSQL_COMMAND="${MYSQL_COMMAND_BASE}" # No password needed
    fi
    
    # Database and User Creation
    print_info "Checking for existing database/user..."
    # Check if database exists
    DB_QUERY_OUTPUT=$( $MYSQL_COMMAND -sN -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_DATABASE}';" )
    if [[ $? -ne 0 ]]; then print_error "Failed to query database existence."; exit 1; fi
    DB_EXISTS=""
    if [[ -n "$DB_QUERY_OUTPUT" ]]; then DB_EXISTS="true"; fi
    
    # Check if user exists
    USER_QUERY_OUTPUT=$( $MYSQL_COMMAND -sN -e "SELECT User FROM mysql.user WHERE User = '${DB_USERNAME}' AND Host = 'localhost';" )
    if [[ $? -ne 0 ]]; then print_error "Failed to query user existence."; exit 1; fi
    USER_EXISTS=""
    if [[ -n "$USER_QUERY_OUTPUT" ]]; then USER_EXISTS="true"; fi
    
    # If either exists, prompt for confirmation before deleting
    if [ -n "$DB_EXISTS" ] || [ -n "$USER_EXISTS" ]; then
        print_warning "Database '${DB_DATABASE}' and/or user '${DB_USERNAME}'@'localhost' already exist."
        if prompt_yes_no "Proceeding will DELETE the existing database and/or user. Continue?"; then
            print_info "Deleting existing database and/or user..."
            $MYSQL_COMMAND -e "DROP DATABASE IF EXISTS \`${DB_DATABASE}\`;" || { print_error "Failed to drop database '${DB_DATABASE}'."; exit 1; }
            $MYSQL_COMMAND -e "DROP USER IF EXISTS '${DB_USERNAME}'@'localhost';" || { print_error "Failed to drop user '${DB_USERNAME}'@'localhost'."; exit 1; }
            $MYSQL_COMMAND -e "FLUSH PRIVILEGES;" || { print_error "Failed to flush privileges after dropping."; exit 1; }
            print_info "Existing database/user deleted."
        else
            print_error "User chose not to overwrite existing database/user. Aborting installation."
            exit 1
        fi
    fi
    
    # Escape password for MySQL commands
    DB_PASSWORD_MYSQL_ESCAPED=$(printf '%s\n' "$DB_PASSWORD" | sed -e 's/[\/&]/\\&/g' -e "s/'/\\'/g") # Escape \, &, and '
    
    # Create database and user
    print_info "Creating database '${DB_DATABASE}'..."
    $MYSQL_COMMAND -e "CREATE DATABASE \`${DB_DATABASE}\`;" || { print_error "Failed to create database '${DB_DATABASE}'."; exit 1; }
    print_info "Creating user '${DB_USERNAME}'@'localhost'..."
    $MYSQL_COMMAND -e "CREATE USER '${DB_USERNAME}'@'localhost' IDENTIFIED BY '${DB_PASSWORD_MYSQL_ESCAPED}';" || { print_error "Failed to create user '${DB_USERNAME}'. Check MySQL logs for details."; exit 1; }
    print_info "Granting privileges..."
    $MYSQL_COMMAND -e "GRANT ALL PRIVILEGES ON \`${DB_DATABASE}\`.* TO '${DB_USERNAME}'@'localhost';" || { print_error "Failed to grant privileges."; exit 1; }
    $MYSQL_COMMAND -e "FLUSH PRIVILEGES;" || { print_error "Failed to flush privileges after granting."; exit 1; }
    
    # Save database credentials to a temporary file for other scripts to use
    echo "DB_DATABASE=$DB_DATABASE" >> /tmp/phoenixpanel_install_vars
    echo "DB_USERNAME=$DB_USERNAME" >> /tmp/phoenixpanel_install_vars
    echo "DB_PASSWORD=$DB_PASSWORD" >> /tmp/phoenixpanel_install_vars
    
    print_success "MySQL database and user configured."
}

# --- Main Function ---
main() {
    # Load configuration if exists
    if [ -f /tmp/phoenixpanel_install_vars ]; then
        source /tmp/phoenixpanel_install_vars
    fi
    
    # Setup MySQL
    setup_mysql
    
    print_success "Database setup completed successfully."
}

# Run the main function
main