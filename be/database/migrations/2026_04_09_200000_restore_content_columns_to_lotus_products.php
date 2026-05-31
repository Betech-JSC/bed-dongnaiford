<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Restore content columns to lotus_products that were dropped
     * when the translation table was first created.
     * Copy data back from lotus_product_translations (locale='vi').
     */
    public function up(): void
    {
        // 1. Thêm lại các cột nếu chưa có
        Schema::table('lotus_products', function (Blueprint $table) {
            if (!Schema::hasColumn('lotus_products', 'title')) {
                $table->string('title')->nullable()->after('category_id');
            }
            if (!Schema::hasColumn('lotus_products', 'slug')) {
                $table->string('slug')->nullable()->unique()->after('title');
            }
            if (!Schema::hasColumn('lotus_products', 'overview')) {
                $table->longText('overview')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('lotus_products', 'overview_courses')) {
                $table->longText('overview_courses')->nullable()->after('overview');
            }
            if (!Schema::hasColumn('lotus_products', 'overview_future')) {
                $table->longText('overview_future')->nullable()->after('overview_courses');
            }
            if (!Schema::hasColumn('lotus_products', 'author')) {
                $table->string('author')->nullable()->after('overview_future');
            }
            if (!Schema::hasColumn('lotus_products', 'author_title')) {
                $table->string('author_title')->nullable()->after('author');
            }
            if (!Schema::hasColumn('lotus_products', 'author_description')) {
                $table->text('author_description')->nullable()->after('author_title');
            }
            if (!Schema::hasColumn('lotus_products', 'sections')) {
                $table->json('sections')->nullable()->after('author_description');
            }
            if (!Schema::hasColumn('lotus_products', 'highlights')) {
                $table->json('highlights')->nullable()->after('sections');
            }
            if (!Schema::hasColumn('lotus_products', 'sections_title')) {
                $table->string('sections_title')->nullable()->after('highlights');
            }
        });

        // 2. Copy dữ liệu từ bảng translations (locale='vi') về lotus_products
        if (Schema::hasTable('lotus_product_translations')) {
            $translations = DB::table('lotus_product_translations')
                ->where('locale', 'vi')
                ->get();

            foreach ($translations as $tr) {
                $update = [];
                foreach (['title','slug','overview','overview_courses','overview_future',
                          'author','author_title','author_description','sections','highlights','sections_title'] as $col) {
                    if (isset($tr->{$col})) {
                        $update[$col] = $tr->{$col};
                    }
                }
                if (!empty($update)) {
                    DB::table('lotus_products')
                        ->where('id', $tr->lotus_product_id)
                        ->update($update);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $cols = ['title','slug','overview','overview_courses','overview_future',
                     'author','author_title','author_description','sections','highlights','sections_title'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('lotus_products', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
