<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_awards', function (Blueprint $table) {
            $table->id();
            $table->string('title');                    // Tên giải thưởng
            $table->text('description')->nullable();    // Mô tả ngắn
            $table->json('image')->nullable();          // Ảnh giải thưởng
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_awards');
    }
};
