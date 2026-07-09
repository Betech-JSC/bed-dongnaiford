<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle\LandingPage;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\Vehicle;
use Illuminate\Support\Facades\DB;

class LandingPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Xóa các bản ghi cũ
        LandingPage::query()->delete();
        DB::table('landing_page_translations')->truncate();

        // Lấy danh sách sales consultants và vehicles hoạt động
        $consultants = SalesConsultant::where('status', 'ACTIVE')->get();
        $vehicles = Vehicle::where('status', 'ACTIVE')->get();

        if ($consultants->isEmpty() || $vehicles->isEmpty()) {
            $this->command->warn('Không có Sales Consultant hoặc Vehicle hoạt động để tạo Landing Page.');
            return;
        }

        // Tạo một vài Landing Page mẫu
        $count = 0;
        foreach ($consultants->take(2) as $index => $consultant) {
            // Lấy dòng xe tương ứng
            $vehicle = $vehicles->get($index) ?? $vehicles->first();

            if (!$vehicle) continue;

            $ldp = LandingPage::create([
                'sales_consultant_id' => $consultant->id,
                'vehicle_id' => $vehicle->id,
                'status' => 'ACTIVE',
                'sort_order' => ($index + 1) * 10,
                'promotions' => [
                    'global_promotion_ids' => [],
                    'custom_promotions' => [
                        [
                            'title' => 'Tặng gói phụ kiện cao cấp 30 triệu',
                            'description' => 'Bao gồm dán phim cách nhiệt 3M chính hãng, lót sàn da 5D cao cấp, camera hành trình và phủ ceramic bảo vệ sơn xe.',
                            'image' => null,
                            'link' => ''
                        ],
                        [
                            'title' => 'Hỗ trợ lệ phí trước bạ đặc quyền',
                            'description' => 'Ưu đãi trừ thẳng vào giá xe khi đăng ký hợp đồng và làm thủ tục trong tháng này.',
                            'image' => null,
                            'link' => ''
                        ]
                    ]
                ],
                'layout_blocks' => $vehicle->layout_blocks // Tự sao chép layout từ xe gốc
            ]);

            $ldp->translations()->create([
                'locale' => 'vi',
                'title' => 'Ưu đãi xe ' . $vehicle->title . ' tốt nhất từ Cố vấn ' . $consultant->name,
                'seo_meta_title' => 'Mua xe ' . $vehicle->title . ' giá tốt nhất - Cố vấn ' . $consultant->name,
                'seo_meta_description' => 'Chương trình khuyến mãi cực hot dòng xe ' . $vehicle->title . ' tại Đồng Nai Ford. Liên hệ ngay Cố vấn ' . $consultant->name . ' để nhận báo giá lăn bánh đặc quyền.',
                'seo_meta_keywords' => $vehicle->title . ', khuyến mãi ' . $vehicle->title . ', dong nai ford, ' . $consultant->name
            ]);

            $count++;
        }

        $this->command->info("Đã seed thành công {$count} Landing Page!");
    }
}
