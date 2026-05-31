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
