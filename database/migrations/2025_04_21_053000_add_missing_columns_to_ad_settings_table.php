<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMissingColumnsToAdSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ad_settings', function (Blueprint $table) {
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('ad_settings', 'header_ad_code')) {
                $table->text('header_ad_code')->nullable();
            }
            
            if (!Schema::hasColumn('ad_settings', 'sidebar_ad_code')) {
                $table->text('sidebar_ad_code')->nullable();
            }
            
            if (!Schema::hasColumn('ad_settings', 'footer_ad_code')) {
                $table->text('footer_ad_code')->nullable();
            }
            
            if (!Schema::hasColumn('ad_settings', 'content_ad_code')) {
                $table->text('content_ad_code')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ad_settings', function (Blueprint $table) {
            // We don't want to drop these columns in the down method
            // as it could lead to data loss if the migration is rolled back
        });
    }
}