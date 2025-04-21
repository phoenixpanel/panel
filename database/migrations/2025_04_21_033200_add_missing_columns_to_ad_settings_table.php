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
        Schema::table('ad_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('ad_settings', 'sidebar_ad_code')) {
                $table->text('sidebar_ad_code')->nullable()->after('bottom_ad_code');
            }
            
            if (!Schema::hasColumn('ad_settings', 'server_list_ad_code')) {
                $table->text('server_list_ad_code')->nullable()->after('sidebar_ad_code');
            }
            
            if (!Schema::hasColumn('ad_settings', 'dashboard_ad_code')) {
                $table->text('dashboard_ad_code')->nullable()->after('server_list_ad_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_settings', function (Blueprint $table) {
            $table->dropColumn(['sidebar_ad_code', 'server_list_ad_code', 'dashboard_ad_code']);
        });
    }
};