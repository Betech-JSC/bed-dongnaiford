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
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title')->nullable();
            $table->timestamp('start_time')->nullable();;
            $table->timestamp('end_time')->nullable();;
            $table->timestamps();

            $table->integer('flash_sale_quantity')->nullable();
            $table->decimal('flash_sale_price', 18, 2)->nullable();

            $table->unsignedBigInteger('product_id')->nullable();;
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('flash_sales');
    }
};
