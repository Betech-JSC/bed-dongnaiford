<?php

use App\Models\Product\ProductCategory;
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
        Schema::create('product_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('parent_id')->nullable()->default(0);

            $table->integer('position')->nullable();
            $table->string('status', 30)->default(ProductCategory::STATUS_ACTIVE);
            $table->json('images')->nullable();
            $table->json('image')->nullable();
            $table->json('image_mobile')->nullable();
            $table->integer('view_count')->default(0);

            $table->integer('menu_position')->nullable();
            $table->integer('footer_position')->nullable();
            $table->integer('featured_position')->nullable();
            $table->integer('homepage_position')->nullable();

            $table->addInjectCode();
            $table->addTimestamps();

            $table->index('parent_id', 'parent_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_categories');
    }
};
