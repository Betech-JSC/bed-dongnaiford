<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            // Đổi các file_upload columns từ string(500) → json
            $table->json('image')->nullable()->change();
            $table->json('banner_product')->nullable()->change();
            $table->json('banner_detail')->nullable()->change();
            $table->json('author_avatar')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $table->string('image', 500)->nullable()->change();
            $table->string('banner_product', 500)->nullable()->change();
            $table->string('banner_detail', 500)->nullable()->change();
            $table->string('author_avatar', 500)->nullable()->change();
        });
    }
};
