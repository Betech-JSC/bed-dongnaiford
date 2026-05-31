<?php

use App\Models\Product\Product;
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
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('brand_id')->index()->nullable();

            $table->string('status', 30)->default(Product::STATUS_ACTIVE);
            $table->boolean('is_featured')->nullable()->default(0);
            $table->boolean('is_new')->nullable()->default(0);
            $table->boolean('is_stock')->nullable()->default(0);
            $table->integer('position')->nullable();
            $table->integer('home_position')->nullable();
            $table->integer('view_count')->default(0);
            $table->string('sku')->nullable();

            $table->boolean('is_sale')->nullable()->default(0);
            $table->datetime('last_sale')->nullable();
            $table->time('first_sale')->nullable();
            $table->datetime('sale_form_date')->nullable();
            $table->datetime('sale_to_date')->nullable();
            $table->datetime('sale_date')->nullable();

            $table->datetime('flash_sale_to')->nullable();
            $table->datetime('flash_sale_from')->nullable();

            $table->json('images')->nullable();
            $table->json('image')->nullable();

            $table->decimal('price', 18, 2)->nullable();
            $table->decimal('old_price', 18, 2)->nullable();
            $table->decimal('sale_price', 18, 2)->nullable();
            $table->integer('sale_quantity')->nullable()->default(0);
            $table->integer('flash_sale_quantity')->nullable();


            $table->addInjectCode();
            $table->addTimestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
