<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // lotus_categories: image string(500) → json
        Schema::table('lotus_categories', function (Blueprint $table) {
            $table->json('image')->nullable()->change();
        });

        // lotus_hero_banners: image string(500) → json
        Schema::table('lotus_hero_banners', function (Blueprint $table) {
            $table->json('image')->nullable()->change();
        });

        // lotus_sponsors: logo string(500) → json
        Schema::table('lotus_sponsors', function (Blueprint $table) {
            $table->json('logo')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotus_categories', function (Blueprint $table) {
            $table->string('image', 500)->nullable()->change();
        });

        Schema::table('lotus_hero_banners', function (Blueprint $table) {
            $table->string('image', 500)->nullable()->change();
        });

        Schema::table('lotus_sponsors', function (Blueprint $table) {
            $table->string('logo', 500)->nullable()->change();
        });
    }
};
