<?php

namespace App\Exports;

use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use Rap2hpoutre\FastExcel\FastExcel;

class VehicleExport
{
    /**
     * Generator for streaming Vehicle export rows
     */
    public function exportGenerator()
    {
        $vehicles = Vehicle::query()
            ->with(['translations', 'categories'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc');

        if ($selectIds = request()->input('selectIds')) {
            $ids = array_filter(explode(',', $selectIds));
            if (!empty($ids)) {
                $vehicles->whereIn('id', $ids);
            }
        }

        foreach ($vehicles->cursor() as $item) {
            $title = $item->translate('vi')?->title ?? $item->title ?? '';
            $slug = $item->translate('vi')?->slug ?? $item->slug ?? '';
            $categoryNames = $item->categories->pluck('title')->implode(' | ');

            yield [
                'ID'                  => $item->id,
                'Tên xe'              => $title,
                'Slug'                => $slug,
                'Phân loại (Category)'=> $categoryNames,
                'Loại xe (Type)'      => $item->type ?? 'suv',
                'Giá niêm yết (VNĐ)'  => (float) ($item->base_price ?? 0),
                'Trạng thái'          => $item->status === Vehicle::STATUS_ACTIVE ? 'HIEN_THI' : 'AN',
                'Thứ tự hiển thị'     => (int) ($item->sort_order ?? 0),
            ];
        }
    }

    /**
     * Download exported vehicle list as Excel file response
     */
    public function download($fileName = 'danh-sach-xe-dong-nai-ford.xlsx')
    {
        return (new FastExcel($this->exportGenerator()))->download($fileName);
    }

    /**
     * Download blank template with header instructions and category references
     */
    public function downloadTemplate($fileName = 'mau-import-xe-dong-nai-ford.xlsx')
    {
        $categories = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($c) => $c->title)
            ->implode(' | ');

        $sampleData = [
            [
                'ID'                  => '',
                'Tên xe'              => 'Ford Everest 2026 Mới',
                'Slug'                => 'ford-everest-2026',
                'Phân loại (Category)'=> $categories ?: 'SUV | Xe 7 Chỗ',
                'Loại xe (Type)'      => 'suv',
                'Giá niêm yết (VNĐ)'  => 1099000000,
                'Trạng thái'          => 'HIEN_THI',
                'Thứ tự hiển thị'     => 1,
            ],
            [
                'ID'                  => '',
                'Tên xe'              => 'Ford Ranger Wildtrak 2026',
                'Slug'                => 'ford-ranger-wildtrak-2026',
                'Phân loại (Category)'=> 'Bán Tải | Pickup',
                'Loại xe (Type)'      => 'pickup',
                'Giá niêm yết (VNĐ)'  => 979000000,
                'Trạng thái'          => 'HIEN_THI',
                'Thứ tự hiển thị'     => 2,
            ],
        ];

        return (new FastExcel($sampleData))->download($fileName);
    }
}
