<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgencyTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agency_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agency_id');

            $table->string('title');
            $table->string('locale');
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->json('phones')->nullable();
            $table->json('info')->nullable();

            $table->unique(['locale', 'agency_id']);
            $table->foreign('agency_id')
                ->references('id')
                ->on('agencies')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agency_translations');
    }
}
