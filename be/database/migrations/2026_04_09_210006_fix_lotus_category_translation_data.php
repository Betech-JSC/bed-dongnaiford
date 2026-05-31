<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Cập nhật lotus_category_translations với slug/title thật từ lotus_categories.
 * Migration _210005 chỉ seed placeholder (danh-muc-X), migration này fix lại.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Lấy slug & title thật từ bảng chính
        $categories = DB::table('lotus_categories')
            ->select('id', 'slug', 'title')
            ->get();

        foreach ($categories as $cat) {
            $realSlug  = $cat->slug ?? null;
            $realTitle = $cat->title ?? null;

            if (empty($realSlug) && empty($realTitle)) {
                continue; // không có data thật, giữ placeholder
            }

            DB::table('lotus_category_translations')
                ->where('lotus_category_id', $cat->id)
                ->where('locale', 'vi')
                ->update(array_filter([
                    'slug'  => $realSlug  ?: null,
                    'title' => $realTitle ?: null,
                ], fn($v) => $v !== null));
        }
    }

    public function down(): void
    {
        // Không rollback - không thể khôi phục về placeholder
    }
};
