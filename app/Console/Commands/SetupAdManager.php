<?php

namespace PhoenixPanel\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SetupAdManager extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admanager:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up the Ad Manager by running migrations and seeders';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Setting up Ad Manager...');

        $this->info('Running migrations...');
        Artisan::call('migrate', ['--force' => true]);
        $this->info(Artisan::output());

        $this->info('Seeding database...');
        Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\AdSettingsSeeder', '--force' => true]);
        $this->info(Artisan::output());

        $this->info('Ad Manager setup complete!');
        $this->info('You can now access the Ad Manager in the admin panel under Settings > Ad Manager.');

        return 0;
    }
}