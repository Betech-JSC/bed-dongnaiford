<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable()->unique();
            $table->string('image', 500)->nullable()->comment('Thumbnail hiển thị ngoài danh sách');
            $table->string('banner_product', 500)->nullable()->comment('Banner trên trang danh sách sản phẩm');
            $table->string('banner_detail', 500)->nullable()->comment('Banner nền trang chi tiết');

            // Nội dung mô tả (3 sections text)
            $table->text('overview')->nullable()->comment('Giới thiệu tổng quan');
            $table->text('overview_courses')->nullable()->comment('Khóa học bao gồm');
            $table->text('overview_future')->nullable()->comment('Hướng tới');

            // Thông tin giảng viên
            $table->string('author', 100)->nullable();
            $table->string('author_title', 500)->nullable()->comment('Chức danh: CEO - LOTUS INSTITUTE');
            $table->string('author_avatar', 500)->nullable();
            $table->text('author_description')->nullable();

            // Sections động (card image + text)
            $table->json('sections')->nullable()->comment('Array of [{image, text}]');

            $table->decimal('price', 15, 2)->default(0);
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_hot')->default(false)->comment('Sản phẩm nổi bật');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                ->references('id')
                ->on('lotus_categories')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_products');
    }
};
