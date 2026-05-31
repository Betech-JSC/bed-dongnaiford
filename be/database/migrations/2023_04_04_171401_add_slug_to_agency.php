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
        Schema::table('agency_translations', function (Blueprint $table) {
            $table->string('slug')->after('title');
            $table->longText('content')->nullable()->after('description');
            $table->unique(['locale', 'slug']);

            $table->addSeo();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('agency_translations', function (Blueprint $table) {
            $table->dropUnique('agency_translations_locale_slug_unique');
            $table->dropColumn('slug');
            $table->dropColumn('content');

            $table->dropColumn('seo_meta_title');
            $table->dropColumn('seo_slug');
            $table->dropColumn('seo_meta_description');
            $table->dropColumn('seo_meta_keywords');
            $table->dropColumn('seo_meta_robots');
            $table->dropColumn('seo_canonical');
            $table->dropColumn('seo_image');
            $table->dropColumn('seo_schemas');
        });
    }
};
