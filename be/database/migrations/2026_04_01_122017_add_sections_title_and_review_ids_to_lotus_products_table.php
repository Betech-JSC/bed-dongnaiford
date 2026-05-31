<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $table->string('sections_title')->nullable()->after('sections');
            $table->json('review_ids')->nullable()->after('sections_title');
        });
    }

    public function down()
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $table->dropColumn(['sections_title', 'review_ids']);
        });
    }
};
