<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Fix lại migration _210006 bị lỗi khi bảng lotus_categories không có cột slug/title.
 * Migration này đánh dấu _210006 là đã chạy (bỏ qua) nếu cột không tồn tại,
 * và chỉ copy data khi cột thực sự có trong bảng.
 */
return new class extends Migration
{
    public function up(): void
    {
        $hasSlug  = Schema::hasColumn('lotus_categories', 'slug');
        $hasTitle = Schema::hasColumn('lotus_categories', 'title');

        // Nếu bảng không có cột slug và title thì bỏ qua
        if (!$hasSlug && !$hasTitle) {
            return;
        }

        $columns = ['id'];
        if ($hasSlug)  $columns[] = 'slug';
        if ($hasTitle) $columns[] = 'title';

        $categories = DB::table('lotus_categories')
            ->select($columns)
            ->get();

        foreach ($categories as $cat) {
            $realSlug  = $hasSlug  ? ($cat->slug  ?? null) : null;
            $realTitle = $hasTitle ? ($cat->title ?? null) : null;

            if (empty($realSlug) && empty($realTitle)) {
                continue;
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
        // Không rollback data
    }
};
