<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_translations', function (Blueprint $table) {
            $table->string('title_en')->nullable();
            $table->string('title_overview')->nullable();
            $table->text('content_overview')->nullable();

            $table->string('title_characteristics')->nullable();
            $table->text('content_characteristics')->nullable();

            $table->text('package_included')->nullable();
            $table->string('harvest_season')->nullable();
            $table->text('product_process')->nullable();
            $table->text('product_preservation')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('product_translations', function (Blueprint $table) {
            $table->dropColumn([
                'title_en',
                'title_overview',
                'content_overview',
                'title_characteristics',
                'content_characteristics',
                'package_included',
                'harvest_season',
                'product_process',
                'product_preservation',
            ]);
        });
    }
};
