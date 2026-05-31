<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable()->comment('Null = review chung toàn site');
            $table->string('customer_name', 100)->nullable();
            $table->tinyInteger('rating')->default(5)->comment('1-5 sao');
            $table->text('content')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                ->references('id')
                ->on('lotus_products')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_reviews');
    }
};
