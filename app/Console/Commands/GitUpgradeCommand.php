<?php

namespace PhoenixPanel\Console\Commands;

use Illuminate\Console\Command;
use PhoenixPanel\Console\Kernel;
use Symfony\Component\Process\Process;
use Symfony\Component\Console\Helper\ProgressBar;

class GitUpgradeCommand extends Command
{
    protected $signature = 'p:git-upgrade
        {--user= : The user that PHP runs under. All files will be owned by this user.}
        {--group= : The group that PHP runs under. All files will be owned by this group.}
        {--branch=main : The branch to pull from.}
        {--repo=https://github.com/phoenixpanel/panel.git : The repository URL to pull from.}
        {--force : Force the upgrade without confirmation.}';

    protected $description = 'Upgrades PhoenixPanel by pulling the latest files from the main branch on GitHub.';

    /**
     * Executes an upgrade command which will pull the latest code from GitHub
     * and run through all of our standard upgrade commands for PhoenixPanel.
     *
     * This places the application in maintenance mode while the commands
     * are being executed.
     *
     * @throws \Exception
     */
    public function handle()
    {
        $this->output->warning('This command will upgrade your PhoenixPanel installation by pulling the latest files from GitHub.');
        $this->output->comment('Repository (set with --repo=):');
        $this->line($this->option('repo'));
        $this->output->comment('Branch (set with --branch=):');
        $this->line($this->option('branch'));

        if (version_compare(PHP_VERSION, '7.4.0') < 0) {
            $this->error('Cannot execute self-upgrade process. The minimum required PHP version required is 7.4.0, you have [' . PHP_VERSION . '].');
            return;
        }

        $user = 'www-data';
        $group = 'www-data';
        if ($this->input->isInteractive() && !$this->option('force')) {
            if (is_null($this->option('user'))) {
                $userDetails = posix_getpwuid(fileowner('public'));
                $user = $userDetails['name'] ?? 'www-data';

                if (!$this->confirm("Your webserver user has been detected as <fg=blue>[{$user}]:</> is this correct?", true)) {
                    $user = $this->anticipate(
                        'Please enter the name of the user running your webserver process. This varies from system to system, but is generally "www-data", "nginx", or "apache".',
                        [
                            'www-data',
                            'nginx',
                            'apache',
                        ]
                    );
                }
            }

            if (is_null($this->option('group'))) {
                $groupDetails = posix_getgrgid(filegroup('public'));
                $group = $groupDetails['name'] ?? 'www-data';

                if (!$this->confirm("Your webserver group has been detected as <fg=blue>[{$group}]:</> is this correct?", true)) {
                    $group = $this->anticipate(
                        'Please enter the name of the group running your webserver process. Normally this is the same as your user.',
                        [
                            'www-data',
                            'nginx',
                            'apache',
                        ]
                    );
                }
            }

            if (!$this->confirm('Are you sure you want to run the git upgrade process for your Panel?')) {
                $this->warn('Upgrade process terminated by user.');
                return;
            }
        } else {
            $user = $this->option('user') ?? $user;
            $group = $this->option('group') ?? $group;
        }

        ini_set('output_buffering', '0');
        $bar = $this->output->createProgressBar(10);
        $bar->start();

        // Step 1: Check if git is installed
        $this->withProgress($bar, function () {
            $this->line('$upgrader> Checking if git is installed');
            $process = new Process(['git', '--version']);
            $process->run();
            
            if (!$process->isSuccessful()) {
                $this->error('Git is not installed or not available in the PATH. Please install git and try again.');
                exit(1);
            }
            
            $this->line($process->getOutput());
        });

        // Step 2: Put the application in maintenance mode
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan down');
            $this->call('down');
        });

        // Step 3: Fetch the latest changes from the repository
        $this->withProgress($bar, function () {
            $repo = $this->option('repo');
            $branch = $this->option('branch');
            
            // Check if .git directory exists
            if (!is_dir('.git')) {
                $this->line('$upgrader> Initializing git repository');
                $process = new Process(['git', 'init']);
                $process->run(function ($type, $buffer) {
                    $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
                });
                
                $this->line('$upgrader> Adding remote origin');
                $process = new Process(['git', 'remote', 'add', 'origin', $repo]);
                $process->run(function ($type, $buffer) {
                    $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
                });
            } else {
                // Make sure the remote is set correctly
                $this->line('$upgrader> Setting remote origin');
                $process = new Process(['git', 'remote', 'set-url', 'origin', $repo]);
                $process->run(function ($type, $buffer) {
                    $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
                });
            }
            
            // Fetch the latest changes
            $this->line('$upgrader> Fetching latest changes');
            $process = new Process(['git', 'fetch', 'origin', $branch]);
            $process->setTimeout(300); // 5 minutes timeout
            $process->run(function ($type, $buffer) {
                $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
            });
            
            // Stash any local changes
            $this->line('$upgrader> Stashing local changes');
            $process = new Process(['git', 'stash']);
            $process->run(function ($type, $buffer) {
                $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
            });
            
            // Reset to the latest commit on the specified branch
            $this->line('$upgrader> Resetting to latest commit on ' . $branch);
            $process = new Process(['git', 'reset', '--hard', 'origin/' . $branch]);
            $process->run(function ($type, $buffer) {
                $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
            });
        });

        // Step 4: Set proper permissions
        $this->withProgress($bar, function () {
            $this->line('$upgrader> chmod -R 755 storage bootstrap/cache');
            $process = new Process(['chmod', '-R', '755', 'storage', 'bootstrap/cache']);
            $process->run(function ($type, $buffer) {
                $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
            });
        });

        // Step 5: Install dependencies
        $this->withProgress($bar, function () {
            $command = ['composer', 'install', '--no-ansi'];
            if (config('app.env') === 'production' && !config('app.debug')) {
                $command[] = '--optimize-autoloader';
                $command[] = '--no-dev';
            }

            $this->line('$upgrader> ' . implode(' ', $command));
            $process = new Process($command);
            $process->setTimeout(10 * 60);
            $process->run(function ($type, $buffer) {
                $this->line($buffer);
            });
        });

        // Step 6: Bootstrap the application
        /** @var \Illuminate\Foundation\Application $app */
        $app = require __DIR__ . '/../../../bootstrap/app.php';
        /** @var \PhoenixPanel\Console\Kernel $kernel */
        $kernel = $app->make(Kernel::class);
        $kernel->bootstrap();
        $this->setLaravel($app);

        // Step 7: Clear view cache
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan view:clear');
            $this->call('view:clear');
        });

        // Step 8: Clear config cache
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan config:clear');
            $this->call('config:clear');
        });

        // Step 9: Run migrations
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan migrate --force --seed');
            $this->call('migrate', ['--force' => true, '--seed' => true]);
        });

        // Step 10: Set proper ownership
        $this->withProgress($bar, function () use ($user, $group) {
            $this->line("\$upgrader> chown -R {$user}:{$group} *");
            $process = Process::fromShellCommandline("chown -R {$user}:{$group} *", $this->getLaravel()->basePath());
            $process->setTimeout(10 * 60);
            $process->run(function ($type, $buffer) {
                $this->{$type === Process::ERR ? 'error' : 'line'}($buffer);
            });
        });

        // Step 11: Restart queue workers
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan queue:restart');
            $this->call('queue:restart');
        });

        // Step 12: Take the application out of maintenance mode
        $this->withProgress($bar, function () {
            $this->line('$upgrader> php artisan up');
            $this->call('up');
        });

        $this->newLine(2);
        $this->info('Panel has been successfully upgraded using the latest code from the GitHub repository.');
        $this->info('Please ensure you also update any Wings instances: https://phoenixpanel.io/wings/1.0/upgrading.html');
    }

    /**
     * Execute a callback and advance the progress bar.
     */
    protected function withProgress(ProgressBar $bar, \Closure $callback)
    {
        $bar->clear();
        $callback();
        $bar->advance();
        $bar->display();
    }
}