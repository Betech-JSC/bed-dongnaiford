<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('lotus_product_translations')) {
            Schema::create('lotus_product_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('lotus_product_id');
                $table->string('locale', 10)->index();
                
                $table->string('title')->nullable();
                $table->string('slug')->nullable()->index();
                $table->longText('overview')->nullable();
                $table->longText('overview_courses')->nullable();
                $table->longText('overview_future')->nullable();
                $table->string('author')->nullable();
                $table->string('author_title')->nullable();
                $table->text('author_description')->nullable();
                $table->json('sections')->nullable();
                $table->json('highlights')->nullable();
                $table->string('sections_title')->nullable();

                $table->timestamps();

                $table->unique(['lotus_product_id', 'locale']);
                $table->foreign('lotus_product_id')
                      ->references('id')
                      ->on('lotus_products')
                      ->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lotus_product_translations');
    }
};
