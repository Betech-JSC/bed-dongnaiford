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
        Schema::create('product_translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('product_id');

            $table->string('title', 255);
            $table->string('locale');
            $table->string('slug');

            $table->json('questions')->nullable();
            $table->longText('content')->nullable();
            $table->text('description')->nullable();
            $table->text('specification')->nullable();

            $table->string('title_en')->nullable();
            $table->string('title_overview')->nullable();
            $table->text('content_overview')->nullable();
            $table->string('title_characteristics')->nullable();
            $table->text('content_characteristics')->nullable();
            $table->text('package_included')->nullable();
            $table->string('harvest_season')->nullable();
            $table->text('product_process')->nullable();
            $table->text('product_preservation')->nullable();
            $table->string('output')->nullable();

            $table->json('image')->nullable();
            $table->json('banner')->nullable();
            $table->json('image_harvest_season')->nullable();
            $table->json('images_characteristics')->nullable();
            $table->json('images_product_process')->nullable();
            $table->json('images_package_specification')->nullable();
            $table->json('images_preservation_methods')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'product_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
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
        Schema::dropIfExists('product_translations');
    }
};
