<?php

namespace App\Imports;

use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Rap2hpoutre\FastExcel\FastExcel;

class VehicleImport
{
    /**
     * Process imported file and return summary array
     */
    public function import($filePath): array
    {
        set_time_limit(0);
        ini_set('memory_limit', '-1');

        $rows = (new FastExcel)->import($filePath);

        if ($rows->isEmpty()) {
            return [
                'success' => false,
                'message' => 'File Excel không chứa dữ liệu!',
                'added'   => 0,
                'updated' => 0,
                'errors'  => [],
            ];
        }

        $addedCount = 0;
        $updatedCount = 0;
        $errors = [];

        // Pre-fetch all categories for fast lookup
        $allCategories = VehicleCategory::with('translations')->get();

        DB::transaction(function () use ($rows, $allCategories, &$addedCount, &$updatedCount, &$errors) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2; // Header is row 1

                $normalized = [];
                foreach ($row as $key => $val) {
                    $normalized[trim($key)] = is_string($val) ? trim($val) : $val;
                }

                $id         = $normalized['ID'] ?? $normalized['id'] ?? null;
                $title      = $normalized['Tên xe'] ?? $normalized['Tên dòng xe'] ?? $normalized['Tiêu đề'] ?? '';
                $slugInput  = $normalized['Slug'] ?? $normalized['slug'] ?? '';
                $catString  = $normalized['Phân loại (Category)'] ?? $normalized['Phân loại'] ?? $normalized['Danh mục'] ?? '';
                $type       = strtolower((string) ($normalized['Loại xe (Type)'] ?? $normalized['Loại xe'] ?? 'suv'));
                $basePrice  = $normalized['Giá niêm yết (VNĐ)'] ?? $normalized['Giá niêm yết'] ?? $normalized['Giá'] ?? 0;
                $statusInput= strtoupper((string) ($normalized['Trạng thái'] ?? 'ACTIVE'));
                $sortOrder  = $normalized['Thứ tự hiển thị'] ?? $normalized['Thứ tự'] ?? 0;

                if (empty($title)) {
                    $errors[] = "Dòng {$rowNumber}: Bỏ qua do thiếu 'Tên xe'.";
                    continue;
                }

                // Determine Slug
                $slug = !empty($slugInput) ? Str::slug($slugInput) : Str::slug($title);

                // Determine Type
                if (!in_array($type, ['suv', 'pickup', 'commercial'])) {
                    $type = 'suv';
                }

                // Determine Status
                $status = Vehicle::STATUS_ACTIVE;
                if (in_array($statusInput, ['AN', 'INACTIVE', '0', 'KHONG', 'FALSE'])) {
                    $status = Vehicle::STATUS_INACTIVE;
                }

                // Find existing vehicle by ID or Slug
                $vehicle = null;
                if (!empty($id) && is_numeric($id)) {
                    $vehicle = Vehicle::find((int) $id);
                }
                if (!$vehicle && !empty($slug)) {
                    $vehicle = Vehicle::whereTranslation('slug', $slug)->first();
                }
                if (!$vehicle && !empty($title)) {
                    $vehicle = Vehicle::whereTranslation('title', $title)->first();
                }

                $isNew = false;
                if (!$vehicle) {
                    $vehicle = new Vehicle();
                    $isNew = true;
                }

                // Update model attributes
                $vehicle->type           = $type;
                $vehicle->base_price     = is_numeric($basePrice) ? (float) $basePrice : 0;
                $vehicle->status         = $status;
                $vehicle->sort_order     = is_numeric($sortOrder) ? (int) $sortOrder : 0;
                $vehicle->is_best_seller = $vehicle->is_best_seller ?? false;
                $vehicle->save();

                // Update translations for 'vi'
                $vehicle->update([
                    'vi' => [
                        'title' => $title,
                        'slug'  => $slug,
                    ]
                ]);

                // Match Categories
                if (!empty($catString)) {
                    $catNames = array_map('trim', explode('|', (string) $catString));
                    $catIds = [];

                    foreach ($catNames as $catName) {
                        if (empty($catName)) continue;
                        $matchedCat = $allCategories->first(function ($c) use ($catName) {
                            $viTitle = $c->translate('vi')?->title ?? $c->title;
                            return strcasecmp(trim($viTitle), $catName) === 0 || strcasecmp(trim($c->slug), Str::slug($catName)) === 0;
                        });

                        if ($matchedCat) {
                            $catIds[] = $matchedCat->id;
                        }
                    }

                    if (!empty($catIds)) {
                        $vehicle->categories()->sync(array_unique($catIds));
                    }
                }

                if ($isNew) {
                    $addedCount++;
                } else {
                    $updatedCount++;
                }
            }
        });

        return [
            'success' => true,
            'message' => "Nhập dữ liệu thành công! Đã thêm {$addedCount} xe mới, cập nhật {$updatedCount} xe.",
            'added'   => $addedCount,
            'updated' => $updatedCount,
            'errors'  => $errors,
        ];
    }
}
