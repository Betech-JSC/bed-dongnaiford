<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            // Đổi từ string(500) sang json để lưu file object {type, path, file_size}
            $table->json('image')->nullable()->change();
            $table->json('image_mobile')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->string('image', 500)->nullable()->change();
            $table->string('image_mobile', 500)->nullable()->change();
        });
    }
};
