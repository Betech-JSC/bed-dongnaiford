<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('product_translations', function (Blueprint $table) {
            if (!Schema::hasColumn('product_translations', 'title_en')) {
                $table->string('title_en')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'title_overview')) {
                $table->string('title_overview')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'content_overview')) {
                $table->text('content_overview')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'title_characteristics')) {
                $table->string('title_characteristics')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'content_characteristics')) {
                $table->text('content_characteristics')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'package_included')) {
                $table->text('package_included')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'harvest_season')) {
                $table->string('harvest_season')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'product_process')) {
                $table->text('product_process')->nullable();
            }
            if (!Schema::hasColumn('product_translations', 'product_preservation')) {
                $table->text('product_preservation')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_translations', function (Blueprint $table) {
            // We can drop them if we want, or leave them. 
            // Dropping might be risky if we assume they belonged to another migration.
            // But for this fix, we can list them.
            $columns = [
                'title_en',
                'title_overview',
                'content_overview',
                'title_characteristics',
                'content_characteristics',
                'package_included',
                'harvest_season',
                'product_process',
                'product_preservation',
            ];
            
            // Only drop if they exist (though dropColumn handles array, usually safe to just pass list)
             $table->dropColumn($columns);
        });
    }
};
