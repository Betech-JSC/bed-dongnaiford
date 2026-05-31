<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;


class CreateOrderLinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_lines', function (Blueprint $table) {
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('product_id')->nullable()->default(0);
            $table->bigInteger('order_id')->nullable()->default(0);

            $table->string('title', 255)->nullable();
            $table->integer('quantity')->nullable()->default(0);
            $table->decimal('price', 18, 2)->default(0);
            $table->decimal('total_discount', 18, 2)->default(0);
            $table->string('sku', 255)->nullable();

            $table->boolean('requires_shipping')->default(false);
            $table->boolean('taxable')->default(false);
            $table->text('tax_lines')->nullable();
            $table->string('fulfillment_status', 50)->nullable();
            $table->integer('fulfillable_quantity')->nullable()->default(0);
            $table->timestamps();

            $table->index('order_id', 'order_id');
            $table->index('product_id', 'product_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_lines');
    }
}
