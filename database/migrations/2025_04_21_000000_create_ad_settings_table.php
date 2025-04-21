<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ad_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(false);
            $table->text('top_ad_code')->nullable();
            $table->text('bottom_ad_code')->nullable();
            $table->text('sidebar_ad_code')->nullable();
            $table->text('server_list_ad_code')->nullable();
            $table->text('dashboard_ad_code')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('ad_settings')->insert([
            'enabled' => false,
            'top_ad_code' => '',
            'bottom_ad_code' => '',
            'sidebar_ad_code' => '',
            'server_list_ad_code' => '',
            'dashboard_ad_code' => '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_settings');
    }
};