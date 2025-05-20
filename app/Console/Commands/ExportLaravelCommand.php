<?php

namespace PhoenixPanel\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

// Ngl, did this at god knows what time so have fun trying it! ~ Benno
class ExportLaravelCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exportlaravel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export Laravel logs to logs.phoenixpanel.io';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Locating Laravel logs...');
        
        // Get today's log file using the date-based naming convention
        $today = now()->format('Y-m-d');
        $logPath = storage_path("logs/laravel-{$today}.log");
        
        if (!File::exists($logPath)) {
            $this->error('❌ Laravel log file not found!');
            $this->line('   The log file does not exist at: ' . $logPath);
            return 1;
        }
        
        $logContent = File::get($logPath);
        
        if (empty($logContent)) {
            $this->warn('⚠️ Laravel log file is empty!');
            $this->line('   Nothing to export.');
            return 0;
        }
        
        $this->info('📤 Uploading logs to logs.phoenixpanel.io...');
        
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'text/plain',
                ])
                ->post('https://logs.phoenixpanel.io/documents', $logContent);
            
            if (!$response->successful()) {
                $this->error('❌ Failed to upload logs!');
                $this->line('   Server responded with status code: ' . $response->status());
                return 1;
            }
            
            $responseData = $response->json();
            
            if (!isset($responseData['key'])) {
                $this->error('❌ Invalid response from server!');
                $this->line('   The server response did not contain a key.');
                return 1;
            }
            
            $key = $responseData['key'];
            $url = "https://logs.phoenixpanel.io/{$key}";
            
            $this->newLine();
            $this->info('✅ Logs uploaded successfully!');
            $this->line('   Your logs are available at:');
            $this->newLine();
            $this->line('   <fg=bright-blue;options=bold>' . $url . '</>');
            $this->newLine();
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error('❌ An error occurred while uploading logs!');
            $this->line('   ' . $e->getMessage());
            return 1;
        }
    }
}