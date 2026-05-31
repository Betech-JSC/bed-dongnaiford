<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected array $tables = [
        'agency_translations',
        'brand_translations',
        'history_translations',
        'job_translations',
        'lotus_category_translations',
        'post_category_translations',
        'product_category_translations',
        'product_translations',
        'service_translations',
        'slider_translations',
        'tag_translations',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            if (!Schema::hasTable($table)) continue;

            Schema::table($table, function (Blueprint $table) {
                $table->string('title')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (!Schema::hasTable($tableName)) continue;

            Schema::table($tableName, function (Blueprint $table) {
                $table->string('title')->nullable(false)->default('')->change();
            });
        }
    }
};
