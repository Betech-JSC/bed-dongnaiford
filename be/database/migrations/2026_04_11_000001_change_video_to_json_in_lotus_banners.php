<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('lotus_banners')
            ->whereNotNull('video')
            ->update(['video' => null]);

        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->json('video')->nullable()->comment('File video (JSON: {type, path, file_size})')->change();
        });
    }

    public function down(): void
    {
        DB::table('lotus_banners')
            ->whereNotNull('video')
            ->update(['video' => null]);

        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->string('video', 500)->nullable()->comment('URL nhúng YouTube / Vimeo')->change();
        });
    }
};
