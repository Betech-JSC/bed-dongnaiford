<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Xoá dữ liệu JSON cũ (nếu có) vì chuyển sang lưu URL string
        DB::table('lotus_banners')
            ->whereNotNull('video')
            ->where('video', 'like', '{%')
            ->update(['video' => null]);

        // Đổi comment column cho rõ ràng
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->string('video', 500)->nullable()->comment('URL nhúng YouTube / Vimeo')->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->string('video', 500)->nullable()->comment('File video (JSON: {type, path, file_size})')->change();
        });
    }
};
