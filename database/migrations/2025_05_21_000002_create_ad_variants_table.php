<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ad_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('placement_id')->constrained('ad_placements')->onDelete('cascade');
            $table->string('name');
            $table->text('ad_code');
            $table->integer('weight')->default(50);
            $table->boolean('is_control')->default(false);
            $table->integer('impressions')->default(0);
            $table->integer('clicks')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ad_variants');
    }
}