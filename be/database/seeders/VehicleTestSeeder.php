<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\RegistrationFee;
use App\Models\Vehicle\Banner;
use App\Models\Vehicle\CustomerReview;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\DealerActivity;
use App\Models\Vehicle\Partner;
use App\Models\Vehicle\Award;
use App\Models\Region;

class VehicleTestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. NHÓM XE (Categories)
        $catSUV = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 1]);
        $catSUV->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
            'en' => ['title' => 'SUV', 'slug' => 'suv-en'],
        ]);
        $catSUV->save();

        $catPickup = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 2]);
        $catPickup->fill([
            'vi' => ['title' => 'Bán tải', 'slug' => 'ban-tai'],
            'en' => ['title' => 'Pickup', 'slug' => 'pickup'],
        ]);
        $catPickup->save();

        $catCommercial = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 3]);
        $catCommercial->fill([
            'vi' => ['title' => 'Thương mại', 'slug' => 'thuong-mai'],
            'en' => ['title' => 'Commercial', 'slug' => 'commercial'],
        ]);
        $catCommercial->save();

        $this->command->info('✅ Vehicle categories created');

        // 2. DÒNG XE & PHIÊN BẢN (Vehicles & Versions)
        // 2.1. Territory
        $vTerritory = new Vehicle([
            'category_id' => $catSUV->id,
            'type' => 'suv',
            'is_best_seller' => true,
            'base_price' => 739000000,
            'image' => ['path' => '/assets/territory-hero.png'],
            'images' => [['path' => '/assets/territory-hero.png']],
            'colors' => [
                ['name' => 'Đỏ Hỏa Tinh', 'hex' => '#c61918', 'image_path' => 'red'],
                ['name' => 'Trắng Kim Cương', 'hex' => '#e0e0e0', 'image_path' => 'white'],
                ['name' => 'Xám Ánh Trăng', 'hex' => '#9e9ea3', 'image_path' => 'gray'],
                ['name' => 'Xanh Biển Sâu', 'hex' => '#67859f', 'image_path' => 'blue'],
                ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000', 'image_path' => 'black']
            ],
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $vTerritory->fill([
            'vi' => [
                'title' => 'NEW TERRITORY',
                'slug' => 'new-territory',
                'tagline' => 'Cơ hội vàng. Sẵn sàng rước xế.',
                'description' => 'Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc. Ford Territory là lựa chọn hoàn hảo cho gia đình trẻ năng động.'
            ]
        ]);
        $vTerritory->save();

        // Versions for Territory
        $versionsTerritory = [
            [
                'price' => 954000000,
                'specs' => [
                    'engine' => '1.5L Ecoboost Xăng tăng áp',
                    'power' => '160 Hp @ 5400-5700 rpm',
                    'torque' => '248 Nm @ 1500-3000 rpm',
                    'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                    'drivetrain' => 'Cầu trước (FWD)',
                    'dimensions' => '4.630 x 1.935 x 1.706 mm',
                    'clearance' => '190 mm',
                    'fuelEconomy' => '7.0 L/100km'
                ],
                'vi' => ['name' => 'Territory Titanium X 1.5L AT']
            ],
            [
                'price' => 899000000,
                'specs' => [
                    'engine' => '1.5L Ecoboost Xăng tăng áp',
                    'power' => '160 Hp @ 5400-5700 rpm',
                    'torque' => '248 Nm @ 1500-3000 rpm',
                    'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                    'drivetrain' => 'Cầu trước (FWD)',
                    'dimensions' => '4.630 x 1.935 x 1.706 mm',
                    'clearance' => '190 mm',
                    'fuelEconomy' => '7.0 L/100km'
                ],
                'vi' => ['name' => 'Territory Titanium 1.5L AT']
            ],
            [
                'price' => 739000000,
                'specs' => [
                    'engine' => '1.5L Ecoboost Xăng tăng áp',
                    'power' => '160 Hp @ 5400-5700 rpm',
                    'torque' => '248 Nm @ 1500-3000 rpm',
                    'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                    'drivetrain' => 'Cầu trước (FWD)',
                    'dimensions' => '4.630 x 1.935 x 1.706 mm',
                    'clearance' => '190 mm',
                    'fuelEconomy' => '7.0 L/100km'
                ],
                'vi' => ['name' => 'Territory Trend 1.5L AT']
            ],
        ];

        foreach ($versionsTerritory as $ver) {
            $vVer = new VehicleVersion([
                'vehicle_id' => $vTerritory->id,
                'price' => $ver['price'],
                'specs' => $ver['specs'],
                'status' => 'ACTIVE',
                'sort_order' => 0
            ]);
            $vVer->fill(['vi' => $ver['vi']]);
            $vVer->save();
        }

        // 2.2. Everest
        $vEverest = new Vehicle([
            'category_id' => $catSUV->id,
            'type' => 'suv',
            'is_best_seller' => true,
            'base_price' => 1099000000,
            'image' => ['path' => 'https://s3-alpha-sig.figma.com/img/6bc8/acc6/b8b79419ceb119c50c418b5618bcb8b1'],
            'images' => [['path' => 'https://s3-alpha-sig.figma.com/img/6bc8/acc6/b8b79419ceb119c50c418b5618bcb8b1']],
            'colors' => [
                ['name' => 'Đỏ Cam', 'hex' => '#c2410c', 'image_path' => 'orange'],
                ['name' => 'Xám Falcon', 'hex' => '#4b5563', 'image_path' => 'gray'],
                ['name' => 'Trắng Tuyết', 'hex' => '#fafafa', 'image_path' => 'white']
            ],
            'status' => 'ACTIVE',
            'sort_order' => 2
        ]);
        $vEverest->fill([
            'vi' => [
                'title' => 'NEW EVEREST',
                'slug' => 'new-everest',
                'tagline' => 'Dấn bước. Dẫn đầu​.',
                'description' => 'Được thiết kế để chinh phục mọi thử thách, Ford Everest thế hệ mới kết hợp khả năng vận hành mạnh mẽ ưu việt, nội thất sang trọng đỉnh cao và hệ thống an toàn thông minh bậc nhất.'
            ]
        ]);
        $vEverest->save();

        $verEverest = new VehicleVersion([
            'vehicle_id' => $vEverest->id,
            'price' => 1099000000,
            'specs' => [
                'engine' => 'Single-Turbo Diesel 2.0L i4',
                'power' => '170 Hp @ 3500 rpm',
                'torque' => '405 Nm @ 1750-2500 rpm',
                'transmission' => 'Tự động 6 cấp',
                'drivetrain' => 'Một cầu sau (RWD)',
                'dimensions' => '4.914 x 1.923 x 1.842 mm',
                'clearance' => '200 mm',
                'fuelEconomy' => '7.5 L/100km'
            ],
            'status' => 'ACTIVE',
            'sort_order' => 0
        ]);
        $verEverest->fill(['vi' => ['name' => 'Everest Ambient 2.0L Turbo 6AT']]);
        $verEverest->save();

        // 2.3. Ranger Raptor
        $vRaptor = new Vehicle([
            'category_id' => $catPickup->id,
            'type' => 'pickup',
            'is_best_seller' => true,
            'base_price' => 1299000000,
            'image' => ['path' => 'https://s3-alpha-sig.figma.com/img/db5c/e33b/b3043860266e5eef639a45cd28ba3cc0'],
            'images' => [['path' => 'https://s3-alpha-sig.figma.com/img/db5c/e33b/b3043860266e5eef639a45cd28ba3cc0']],
            'colors' => [
                ['name' => 'Cam Code Orange', 'hex' => '#ea580c', 'image_path' => 'orange'],
                ['name' => 'Xám Meteor', 'hex' => '#374151', 'image_path' => 'gray'],
                ['name' => 'Đen Bóng', 'hex' => '#000000', 'image_path' => 'black']
            ],
            'status' => 'ACTIVE',
            'sort_order' => 3
        ]);
        $vRaptor->fill([
            'vi' => [
                'title' => 'NEW RAPTOR',
                'slug' => 'new-raptor',
                'tagline' => 'Độc bản hiệu năng. Chiến binh sa mạc.',
                'description' => 'Được phát triển bởi bộ phận Ford Performance, NEW Ranger Raptor 2026 sở hữu động cơ Bi-Turbo cực đại kết hợp hệ thống treo FOX đỉnh cao.'
            ]
        ]);
        $vRaptor->save();

        $verRaptor = new VehicleVersion([
            'vehicle_id' => $vRaptor->id,
            'price' => 1299000000,
            'specs' => [
                'engine' => 'Bi-Turbo Diesel 2.0L i4 Ford Performance',
                'power' => '210 Hp @ 3750 rpm',
                'torque' => '500 Nm @ 1750-2000 rpm',
                'transmission' => 'Tự động 10 cấp điện tử',
                'drivetrain' => 'Hai cầu chủ động bán thời gian thông minh',
                'dimensions' => '5.381 x 2.028 x 1.922 mm',
                'clearance' => '272 mm',
                'fuelEconomy' => '8.9 L/100km'
            ],
            'status' => 'ACTIVE',
            'sort_order' => 0
        ]);
        $verRaptor->fill(['vi' => ['name' => 'Ranger Raptor 2.0L Bi-Turbo 10AT']]);
        $verRaptor->save();

        $this->command->info('✅ Ford vehicles & versions created');

        // 3. CẤU HÌNH PHÍ LĂN BÁNH (Registration Fees)
        // Đồng Nai (Code: 75 hoặc tương ứng, lấy theo region đầu tiên)
        $regions = Region::where('level', 1)->take(5)->get();
        if ($regions->isEmpty()) {
            // Seed a fallback region if empty
            $rDongNai = Region::firstOrCreate(['code' => '48'], [
                'country_id' => 1,
                'level' => 1,
                'name' => 'Đồng Nai',
                'name_with_type' => 'Tỉnh Đồng Nai'
            ]);
            $regions = collect([$rDongNai]);
        }

        foreach ($regions as $index => $region) {
            $taxPercent = ($region->name == 'Hà Nội' || $region->name == 'Hồ Chí Minh') ? 12.00 : 10.00;
            $plateFee = ($region->name == 'Hà Nội' || $region->name == 'Hồ Chí Minh') ? 20000000 : 1000000;
            
            RegistrationFee::firstOrCreate(
                ['region_id' => $region->id],
                [
                    'registration_tax_percent' => $taxPercent,
                    'license_plate_fee' => $plateFee,
                    'inspection_fee' => 340000,
                    'road_maintenance_fee' => 1560000,
                    'civil_insurance_fee' => 480700,
                    'service_fee' => 2000000, // 2 triệu phí dịch vụ hỗ trợ đăng ký
                ]
            );
        }

        $this->command->info('✅ Registration fees configured');

        // 4. BANNERS (Banners)
        $banners = [
            [
                'title'       => 'Ford Everest Mới',
                'subtitle'    => 'Dấn bước. Dẫn đầu​',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/products/new-everest',
                'location'    => ['homepage'],
                'image'       => ['path' => 'https://s3-alpha-sig.figma.com/img/51d8/107c/5660736a8051e7bf365dbc9706b20b6f'],
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Khuyến Mãi Tháng 5',
                'subtitle'    => 'Ưu Đãi Lệ Phí Trước Bạ & Quà Tặng Đặc Biệt',
                'button_text' => 'Nhận ưu đãi',
                'button_link' => '/contact?reason=Nhận%20chương%20trình%20ưu%20đãi',
                'location'    => ['homepage', 'homepage_hero'],
                'image'       => ['path' => 'https://s3-alpha-sig.figma.com/img/36fa/383c/25017866e7fcb87834442bd95d253515'],
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Ford Raptor Nhập Mỹ',
                'subtitle' => 'Chiến binh sa mạc - Độc bản hiệu năng​',
                'button_text' => 'Hẹn lái thử',
                'button_link' => '/contact?reason=Đăng%20ký%20lái%20thử',
                'location'    => ['homepage'],
                'image'       => ['path' => 'https://s3-alpha-sig.figma.com/img/cb5f/178a/ea3b60a6dc2c4dbc569d3a5319f244fe'],
                'sort_order'  => 3,
            ],
        ];

        foreach ($banners as $b) {
            Banner::create([
                'title' => $b['title'],
                'subtitle' => $b['subtitle'],
                'button_text' => $b['button_text'],
                'button_link' => $b['button_link'],
                'location' => $b['location'],
                'image' => $b['image'],
                'status' => 'ACTIVE',
                'sort_order' => $b['sort_order']
            ]);
        }

        $this->command->info('✅ Banners created');

        // 5. ĐỘI NGŨ TƯ VẤN BÁN HÀNG (Sales Consultants)
        $consultants = [
            [
                'name' => 'Nguyễn Minh Tuấn',
                'job_title' => 'Trưởng nhóm kinh doanh',
                'department' => 'Phòng Kinh Doanh',
                'phone' => '0901234567',
                'email' => 'tuan.nm@dongnaiford.com.vn',
                'facebook_url' => 'https://facebook.com/tuanford',
                'zalo_url' => 'https://zalo.me/0901234567',
                'sort_order' => 1,
            ],
            [
                'name' => 'Trần Thị Thảo',
                'job_title' => 'Tư vấn bán hàng cao cấp',
                'department' => 'Phòng Kinh Doanh',
                'phone' => '0909876543',
                'email' => 'thao.tt@dongnaiford.com.vn',
                'facebook_url' => 'https://facebook.com/thaoford',
                'zalo_url' => 'https://zalo.me/0909876543',
                'sort_order' => 2,
            ]
        ];

        foreach ($consultants as $sc) {
            $consultant = new SalesConsultant([
                'department' => $sc['department'],
                'phone' => $sc['phone'],
                'email' => $sc['email'],
                'facebook_url' => $sc['facebook_url'],
                'zalo_url' => $sc['zalo_url'],
                'status' => 'ACTIVE',
                'sort_order' => $sc['sort_order']
            ]);
            $consultant->fill([
                'vi' => [
                    'name' => $sc['name'],
                    'job_title' => $sc['job_title'],
                    'slug' => str($sc['name'])->slug()
                ]
            ]);
            $consultant->save();
        }

        $this->command->info('✅ Sales consultants created');

        // 6. Ý KIẾN KHÁCH HÀNG (Customer Reviews)
        $reviews = [
            [
                'customer_name' => 'Anh Hoàng Bách (Biên Hòa)',
                'content' => 'Rất hài lòng với chiếc Ford Everest mới mua tại đại lý. Nhân viên tư vấn nhiệt tình, làm thủ tục đăng ký biển số và dự toán chi phí lăn bánh cực nhanh gọn, giao xe đúng hẹn.',
                'rating' => 5,
                'vehicle_id' => $vEverest->id
            ],
            [
                'customer_name' => 'Chị Phương Vy (Long Thành)',
                'content' => 'Gia đình mình mua chiếc Territory để đi lại trong phố. Xe 5 chỗ cabin rộng rãi, thiết kế đẹp và nhiều công nghệ hiện đại. Cảm ơn đội ngũ Đồng Nai Ford.',
                'rating' => 5,
                'vehicle_id' => $vTerritory->id
            ],
        ];

        foreach ($reviews as $rev) {
            $review = new CustomerReview([
                'vehicle_id' => $rev['vehicle_id'],
                'rating' => $rev['rating'],
                'status' => 'ACTIVE',
                'sort_order' => 0
            ]);
            $review->fill([
                'vi' => [
                    'customer_name' => $rev['customer_name'],
                    'content' => $rev['content']
                ]
            ]);
            $review->save();
        }

        $this->command->info('✅ Customer reviews created');

        // 7. HOẠT ĐỘNG ĐẠI LÝ (Dealer Activities)
        $activities = [
            ['title' => 'Lễ bàn giao xe Ford Everest thế hệ mới cho khách hàng Biên Hòa', 'sort_order' => 1],
            ['title' => 'Chương trình Ngày hội lái thử xe Ford cùng các quà tặng đặc biệt', 'sort_order' => 2],
            ['title' => 'Chiến dịch chăm sóc và bảo dưỡng xe miễn phí lưu động', 'sort_order' => 3],
        ];

        foreach ($activities as $act) {
            DealerActivity::create([
                'title' => $act['title'],
                'status' => 'ACTIVE',
                'sort_order' => $act['sort_order'],
                'image' => ['path' => '/assets/img-gradient.png']
            ]);
        }

        $this->command->info('✅ Dealer activities created');

        // 8. ĐỐI TÁC NGÂN HÀNG / BẢO HIỂM (Partners)
        $partners = [
            ['name' => 'Ngân hàng VIB (Ưu đãi lãi vay mua xe)', 'link' => 'https://vib.com.vn', 'sort_order' => 1],
            ['name' => 'Ngân hàng Techcombank', 'link' => 'https://techcombank.com', 'sort_order' => 2],
            ['name' => 'Bảo hiểm Liberty (Bảo hiểm thân vỏ chính hãng)', 'link' => 'https://libertycar.com', 'sort_order' => 3],
        ];

        foreach ($partners as $part) {
            Partner::create([
                'name' => $part['name'],
                'link' => $part['link'],
                'status' => 'ACTIVE',
                'sort_order' => $part['sort_order']
            ]);
        }

        $this->command->info('✅ Partners created');
        $this->command->info('🎉 All Ford DNF database seeders completed successfully!');
    }
}
