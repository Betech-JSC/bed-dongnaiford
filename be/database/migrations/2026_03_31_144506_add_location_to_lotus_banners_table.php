<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            // JSON array các trang hiển thị: ["homepage", "courses", "about"...]
            $table->json('location')->nullable()->after('image_mobile')->comment('Vị trí hiển thị banner');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lotus_banners', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
