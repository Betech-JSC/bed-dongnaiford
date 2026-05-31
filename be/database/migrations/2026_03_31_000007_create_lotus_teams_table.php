<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('job_title')->nullable();       // Chức danh
            $table->string('department')->nullable();      // Bộ phận / nhóm (Chuyên viên, Giám đốc...)
            $table->json('avatar')->nullable();            // Ảnh đại diện
            $table->json('cover_image')->nullable();       // Ảnh bìa trang chi tiết
            $table->text('short_bio')->nullable();         // Mô tả ngắn (hiển thị list)
            $table->longText('bio')->nullable();           // Tiểu sử đầy đủ (trang chi tiết)
            $table->json('gallery')->nullable();           // Ảnh gallery (trang chi tiết)
            $table->string('facebook_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_teams');
    }
};
