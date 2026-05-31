<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        $categories = DB::table('lotus_categories')->pluck('id');

        foreach ($categories as $catId) {
            $exists = DB::table('lotus_category_translations')
                ->where('lotus_category_id', $catId)
                ->where('locale', 'vi')
                ->exists();

            if (!$exists) {
                DB::table('lotus_category_translations')->insert([
                    'lotus_category_id' => $catId,
                    'locale'            => 'vi',
                    'title'             => 'Danh mục ' . $catId,
                    'slug'              => 'danh-muc-' . $catId,
                ]);
            }
        }
    }

    public function down(): void
    {
        // không cần rollback seed data
    }
};
