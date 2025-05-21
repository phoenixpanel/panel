<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSchedulingToAdPlacementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dateTime('start_date')->nullable()->after('is_active');
            $table->dateTime('end_date')->nullable()->after('start_date');
            $table->json('recurring_schedule')->nullable()->after('end_date');
            $table->json('time_of_day_targeting')->nullable()->after('recurring_schedule');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');
            $table->dropColumn('recurring_schedule');
            $table->dropColumn('time_of_day_targeting');
        });
    }
}