<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanLegacyMediaUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:clean-legacy-urls
                            {--from=cms.dnf.betech-digital.com : Domain cũ cần thay thế}
                            {--to=cms.dongnaiford.com.vn : Domain mới chính thức}
                            {--dry-run : Chỉ quét kiểm tra, không ghi vào database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quét và thay thế các URL domain staging cũ trong database sang domain chính thức';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $from = (string) $this->option('from');
        $to = (string) $this->option('to');
        $isDryRun = (bool) $this->option('dry-run');

        $this->info("Bắt đầu quét URL từ '{$from}' sang '{$to}'...");
        if ($isDryRun) {
            $this->warn('--- CHẾ ĐỘ DRY-RUN: Không có dữ liệu nào bị thay đổi trong database ---');
        }

        $tables = [
            'vehicles' => ['layout_blocks', 'image', 'image_thumbnail', 'image_featured', 'images', 'colors'],
            'vehicle_translations' => ['seo_image'],
            'landing_pages' => ['layout_blocks', 'banner_image'],
            'landing_page_translations' => ['seo_image'],
            'sales_consultants' => ['avatar', 'cover_image', 'gallery'],
            'banners' => ['image', 'image_mobile'],
            'configs' => ['value'],
        ];

        $totalReplacements = 0;
        $summary = [];

        DB::beginTransaction();

        try {
            foreach ($tables as $table => $columns) {
                if (!DB::getSchemaBuilder()->hasTable($table)) {
                    continue;
                }

                $countInTable = 0;
                $rows = DB::table($table)->get();

                foreach ($rows as $row) {
                    $updates = [];
                    foreach ($columns as $column) {
                        if (!isset($row->$column) || $row->$column === null) {
                            continue;
                        }

                        $original = $row->$column;
                        if (is_string($original) && str_contains($original, $from)) {
                            $replaced = str_replace($from, $to, $original);
                            $occurrences = substr_count($original, $from);
                            $countInTable += $occurrences;
                            $updates[$column] = $replaced;
                        }
                    }

                    if (!empty($updates) && !$isDryRun) {
                        DB::table($table)->where('id', $row->id)->update($updates);
                    }
                }

                $totalReplacements += $countInTable;
                $summary[] = [
                    'table' => $table,
                    'occurrences' => $countInTable,
                ];
            }

            if ($isDryRun) {
                DB::rollBack();
            } else {
                DB::commit();
            }

            $this->table(['Bảng dữ liệu', 'Số URL đã phát hiện'], $summary);
            $this->info("Tổng số URL phát hiện: {$totalReplacements}");

            if ($isDryRun) {
                $this->info("Để thực thi cập nhật vào Database, hãy chạy lệnh bỏ cờ --dry-run:");
                $this->comment("php artisan media:clean-legacy-urls");
            } else {
                $this->info("✅ Đã cập nhật thành công toàn bộ {$totalReplacements} URL vào Database!");
            }

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("Lỗi khi xử lý: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
