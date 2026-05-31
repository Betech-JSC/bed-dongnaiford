<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tạo bảng lotus_category_translations để hỗ trợ đa ngữ cho LotusCategory.
 * Phải chạy TRƯỚC migration seed (2026_04_09_210005).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lotus_category_translations')) {
            return; // Đã tồn tại (local), bỏ qua
        }

        Schema::create('lotus_category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lotus_category_id');
            $table->string('locale', 10)->index();
            $table->string('title')->nullable();
            $table->string('slug')->nullable()->index();

            $table->unique(['lotus_category_id', 'locale']);
            $table->foreign('lotus_category_id')
                ->references('id')->on('lotus_categories')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_category_translations');
    }
};
