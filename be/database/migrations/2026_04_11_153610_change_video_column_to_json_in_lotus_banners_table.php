<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->json('video')->nullable()->comment('File video (JSON: {type, path, file_size})')->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->string('video', 500)->nullable()->comment('URL nhúng YouTube / Vimeo')->change();
        });
    }
};
