<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            if (!Schema::hasColumn('lotus_banners', 'title')) {
                $table->string('title', 255)->nullable()->after('id');
            }
            if (!Schema::hasColumn('lotus_banners', 'subtitle')) {
                $table->string('subtitle', 500)->nullable()->after('title');
            }
            if (!Schema::hasColumn('lotus_banners', 'button_text')) {
                $table->string('button_text', 100)->nullable()->after('location');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle', 'button_text']);
        });
    }
};
