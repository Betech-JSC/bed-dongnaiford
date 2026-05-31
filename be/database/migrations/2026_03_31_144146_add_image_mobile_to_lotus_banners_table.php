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
            $table->string('image_mobile', 500)->nullable()->after('image')->comment('Ảnh banner phiên bản mobile');
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
            $table->dropColumn('image_mobile');
        });
    }
};
