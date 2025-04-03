// scripts/dev-workflow.js
const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

// --- Configuration ---
const REQUIRED_ENV_VAR = 'APP_URL';
const PROJECT_ROOT = path.resolve(__dirname, '..'); // Define project root
const ENV_FILE_PATH = path.join(PROJECT_ROOT, '.env');
const NODE_MODULES_DIR_PATH = path.join(PROJECT_ROOT, 'node_modules');
const LOCK_FILE = 'yarn.lock'; // Assuming Yarn based on project structure
const INSTALL_COMMAND = 'yarn';
const INSTALL_ARGS = ['install'];
const DEV_SERVER_COMMAND = 'yarn';
const DEV_SERVER_ARGS = ['run', 'serve'];
// --- End Configuration ---

function log(message) {
    console.log(`[dev-workflow] ${message}`);
}

function error(message) {
    console.error(`\x1b[31m[dev-workflow] Error: ${message}\x1b[0m`); // Red color for errors
}

// 1. Load and Validate Environment Variable
log(`Checking for required environment variable: ${REQUIRED_ENV_VAR}...`);
let envConfig = {};
try {
    if (fs.existsSync(ENV_FILE_PATH)) {
        log(`Reading environment variables from: ${ENV_FILE_PATH}`);
        const envFileContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
        // Split by newline, handle potential \r, trim whitespace, ignore comments/empty lines
        envFileContent.split(/\r?\n/).forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const equalsIndex = trimmedLine.indexOf('=');
                if (equalsIndex > 0) {
                    // Ensure there is a key and an equals sign
                    const key = trimmedLine.substring(0, equalsIndex).trim();
                    let value = trimmedLine.substring(equalsIndex + 1).trim();
                    // Remove surrounding quotes (single or double)
                    if (
                        (value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))
                    ) {
                        value = value.substring(1, value.length - 1);
                    }
                    envConfig[key] = value;
                    // Also set in process.env for potential use by child processes if not already set by the system
                    if (!(key in process.env)) {
                        process.env[key] = value;
                    }
                }
            }
        });
    } else {
        log(`Warning: ${path.basename(ENV_FILE_PATH)} file not found. Relying on system environment variables.`);
    }
} catch (err) {
    error(`Failed to read or parse ${path.basename(ENV_FILE_PATH)}: ${err.message}`);
    process.exit(1);
}

// Check value from parsed .env first, then fallback to process.env
const requiredValue = envConfig[REQUIRED_ENV_VAR] || process.env[REQUIRED_ENV_VAR];

if (!requiredValue) {
    error(`Required environment variable '${REQUIRED_ENV_VAR}' is not set or is empty.`);
    console.error(
        `Please define it in your ${path.basename(
            ENV_FILE_PATH
        )} file (e.g., ${REQUIRED_ENV_VAR}=http://your-backend.test)`
    );
    process.exit(1);
}
log(`'${REQUIRED_ENV_VAR}' is set.`);

// 2. Dependency Installation Check
log('Checking if dependencies are installed...');
try {
    if (!fs.existsSync(NODE_MODULES_DIR_PATH)) {
        log(
            `'${path.basename(
                NODE_MODULES_DIR_PATH
            )}' directory not found. Installing dependencies using ${INSTALL_COMMAND}...`
        );
        const installProcess = spawnSync(INSTALL_COMMAND, INSTALL_ARGS, {
            stdio: 'inherit', // Show output directly
            shell: true, // Use shell for cross-platform compatibility (handles PATH)
            cwd: PROJECT_ROOT, // Run in project root
        });

        if (installProcess.error) {
            error(`Failed to start dependency installation process: ${installProcess.error.message}`);
            process.exit(1);
        }
        if (installProcess.status !== 0) {
            error(`Dependency installation failed with exit code ${installProcess.status}.`);
            process.exit(1);
        }
        log('Dependencies installed successfully.');
    } else {
        log('Dependencies already installed.');
    }
} catch (err) {
    error(`Failed during dependency check/installation: ${err.message}`);
    process.exit(1);
}

// 3. Development Server Launch
log(`Launching development server using: ${DEV_SERVER_COMMAND} ${DEV_SERVER_ARGS.join(' ')}...`);
try {
    const devServerProcess = spawn(DEV_SERVER_COMMAND, DEV_SERVER_ARGS, {
        stdio: 'inherit', // Show output directly
        shell: true, // Use shell
        cwd: PROJECT_ROOT, // Run in project root
    });

    devServerProcess.on('error', (err) => {
        error(`Failed to start development server process: ${err.message}`);
        process.exit(1); // Exit if the process itself fails to spawn
    });

    devServerProcess.on('close', (code) => {
        // Log based on exit code, but don't necessarily exit the workflow script with an error
        // as the user might have intentionally stopped the server (Ctrl+C often results in null/0/1 code).
        if (code !== 0 && code !== null) {
            log(`Development server process exited with non-zero code: ${code}.`);
        } else {
            log(`Development server process exited.`);
        }
        // We let the script exit naturally here based on the child process closing.
    });
} catch (err) {
    error(`Failed to launch development server: ${err.message}`);
    process.exit(1);
}
