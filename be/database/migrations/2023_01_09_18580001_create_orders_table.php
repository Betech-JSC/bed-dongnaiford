<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;


class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->string('order_number', 255)->nullable();
            $table->integer('payment_method')->default(1)->nullable();
            $table->smallInteger('status')->default(0);
            $table->boolean('taxes_included')->default(false);
            $table->boolean('confirmed')->default(false);
            $table->boolean('buyer_accepts_marketing')->default(false);
            $table->text('discount_codes')->nullable();

            $table->decimal('total_price', 18, 2)->default(0);
            $table->decimal('shipping_cost', 18, 2)->default(0);
            $table->decimal('subtotal_price', 18, 2)->default(0);
            $table->decimal('deposit_fee', 18, 2)->default(0);
            $table->decimal('total_tax', 18, 2)->default(0);
            $table->decimal('total_discounts', 18, 2)->default(0);
            $table->decimal('total_line_items_price', 18, 2)->default(0);
            $table->integer('total_weight')->default(0);

            $table->bigInteger('customer_id')->nullable()->default(0);
            $table->string('name', 255)->nullable();
            $table->string('phone', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('note')->nullable();

            $table->string('currency', 10)->nullable();
            $table->string('financial_status', 50)->nullable();
            $table->text('cancel_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('checkout_token')->nullable();
            $table->string('reference')->nullable();
            $table->string('device_id')->nullable();
            $table->string('browser_ip')->nullable();
            $table->text('note_attributes')->nullable();
            $table->text('payment_gateway_names')->nullable();

            $table->string('processing_method')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->text('billing_address')->nullable();
            $table->text('shipping_address')->nullable();
            $table->text('shipping_lines')->nullable();
            $table->text('tax_lines')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('ward')->nullable();

            $table->index('customer_id', 'customer_id');
            $table->index('order_number', 'order_number');
            $table->index('deleted_at', 'deleted_at');

            $table->datetime('start_rental_date')->nullable();
            $table->datetime('end_rental_date')->nullable();
            $table->integer('rental_date')->default(0);

            $table->string('rental')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
