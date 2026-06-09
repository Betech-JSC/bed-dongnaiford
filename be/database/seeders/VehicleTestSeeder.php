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
use App\Models\Region;

class VehicleTestSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks and truncate tables to ensure clean seeding
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        
        \Illuminate\Support\Facades\DB::table('vehicle_version_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('vehicle_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('vehicle_category_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('sales_consultant_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('customer_review_translations')->truncate();

        VehicleVersion::truncate();
        Vehicle::truncate();
        VehicleCategory::truncate();
        RegistrationFee::truncate();
        Banner::truncate();
        CustomerReview::truncate();
        SalesConsultant::truncate();
        DealerActivity::truncate();
        Partner::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->command->info('✅ Cleaned vehicle and related tables');

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

        // 2. 5 VEHICLES WITH SPECIFIC DYNAMIC BLOCKS
        $vehiclesData = [
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => true,
                'base_price' => 979000000,
                'image' => 'ranger_hero.png',
                'image_thumbnail' => 'ranger_thumbnail.png',
                'image_featured' => 'ranger_featured.png',
                'images' => ['ranger_hero.png', 'ranger_interior.png'],
                'colors' => [
                    ['name' => 'Vàng Wildtrak Luxe', 'hex' => '#ea580c', 'image_path' => 'ranger_hero.png'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000', 'image_path' => 'ranger_hero.png'],
                    ['name' => 'Trắng Bạch Kim', 'hex' => '#f8fafc', 'image_path' => 'ranger_hero.png'],
                ],
                'vi' => [
                    'title' => 'Ranger Wildtrak',
                    'tagline' => 'Bản lĩnh dẫn đầu phân khúc bán tải cao cấp.',
                    'description' => 'Thiết kế sang trọng đầy công nghệ với ghế bọc da chỉ khâu Wildtrak màu cam nổi bật, động cơ Bi-Turbo 2.0L cực đại kết hợp hộp số 10 cấp điện tử.'
                ],
                'versions' => [
                    [
                        'price' => 979000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động bán thời gian',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '8.0 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Wildtrak 2.0L Bi-Turbo 10AT']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD RANGER WILDTRAK',
                            'tagline' => 'Vua bán tải - Bản lĩnh dẫn đầu.',
                            'button_text' => 'Đăng ký lái thử',
                            'button_link' => '/lien-he?reason=Đăng ký lái thử',
                            'background_image' => 'ranger_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Đặc Biệt Ford Ranger',
                            'description' => 'Tặng gói phụ kiện chính hãng, hỗ trợ lệ phí trước bạ lên đến 50% cùng chương trình vay trả góp lãi suất 6.9%.',
                            'image' => 'ranger_hero.png',
                            'button_text' => 'Nhận báo giá ngay'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Trải nghiệm Ford Ranger 360°',
                            'description' => 'Khám phá ngoại thất hầm hố từ mọi góc nhìn và chọn màu sắc ngoại thất bạn yêu thích nhất.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Thiết kế cơ bắp, dẫn đầu mọi địa hình',
                            'image_1' => 'ranger_hero.png',
                            'image_2' => 'ranger_interior.png',
                            'image_3' => 'ranger_hero.png',
                            'title_2' => 'Khoang lái sang trọng & Ghế bọc da chỉ khâu Wildtrak',
                            'image_large' => 'ranger_interior.png',
                            'image_large_2' => 'ranger_interior_2.png',
                            'image_large_3' => 'ranger_interior_3.png',
                            'title_3' => 'Động cơ cực đại Bi-Turbo & 10 cấp số tự động',
                            'split_image' => 'ranger_hero.png',
                            'split_title' => 'Hiệu năng vượt trội',
                            'split_features' => [
                                ['value' => 'Bi-Turbo 2.0L', 'label' => 'Động cơ Diesel thế hệ mới'],
                                ['value' => '210 mã lực', 'label' => 'Sức mạnh cực đại tối ưu'],
                                ['value' => '10-Cấp số', 'label' => 'Tự động mượt mà tiết kiệm'],
                                ['value' => '6 Chế độ lái', 'label' => 'Quản lý địa hình thông minh']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Phiên bản bán tải tối tân của Ford',
                            'descriptions' => [
                                'Ranger Wildtrak 2026: Động cơ Bi-Turbo cực đại kết hợp hệ dẫn động 2 cầu chủ động bán thời gian và các tính năng hỗ trợ dã ngoại tối tân.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'FeaturesList',
                        'data' => [
                            'features' => [
                                ['title' => 'Hộp số tự động 10 cấp', 'description' => 'Khả năng chuyển số mượt mà, phân phối công suất tối ưu trên mọi cung đường.', 'image' => 'ranger_hero.png'],
                                ['title' => 'Hệ thống hỗ trợ đỗ xe chủ động', 'description' => 'Tự động quét chỗ đỗ xe và đánh lái lùi vào vị trí an toàn cho bạn.', 'image' => 'ranger_interior.png'],
                                ['title' => 'Màn hình cảm ứng SYNC 4A 12"', 'description' => 'Hỗ trợ kết nối Apple CarPlay và Android Auto không dây tiện lợi.', 'image' => 'ranger_interior_2.png']
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Mức tiêu hao nhiên liệu của Ranger Wildtrak là bao nhiêu?', 'a' => 'Mức tiêu hao nhiên liệu thực tế dao động từ 7.6 - 8.2 lít/100km tùy cung đường và tải trọng.', 'is_open' => true],
                                ['q' => 'Xe bán tải Ranger có niên hạn sử dụng không?', 'a' => 'Theo quy định hiện hành tại Việt Nam, xe bán tải Ranger có niên hạn sử dụng là 25 năm.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Khởi đầu hành trình mới cùng Ford Ranger Wildtrak',
                            'phone' => '1800 55 68 58',
                            'btn_text' => 'Liên hệ đặt lái thử',
                            'btn_link' => '/lien-he',
                            'car_image' => 'ranger_hero.png'
                        ]
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 1468000000,
                'image' => 'everest_hero.png',
                'image_thumbnail' => 'everest_thumbnail.png',
                'image_featured' => 'everest_featured.png',
                'images' => ['everest_hero.png', 'everest_interior.png'],
                'colors' => [
                    ['name' => 'Bạc Bạch Kim', 'hex' => '#cbd5e1', 'image_path' => 'everest_hero.png'],
                    ['name' => 'Đen Bóng', 'hex' => '#000000', 'image_path' => 'everest_hero.png'],
                ],
                'vi' => [
                    'title' => 'Everest Titanium Plus',
                    'tagline' => 'Đỉnh cao vận hành, chinh phục mọi địa hình.',
                    'description' => 'Mẫu SUV 7 chỗ hạng sang sở hữu động cơ Bi-Turbo 2.0L cực đại kết hợp hệ dẫn động 2 cầu chủ động thông minh mang lại sức mạnh vượt trội và sự linh hoạt tối đa.'
                ],
                'versions' => [
                    [
                        'price' => 1468000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4WD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '8.0 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Titanium+ 2.0L Bi-Turbo 10AT']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD EVEREST TITANIUM+',
                            'tagline' => 'Dấn bước phiêu lưu. Khẳng định đẳng cấp.',
                            'button_text' => 'Khám phá ưu đãi',
                            'button_link' => '/lien-he',
                            'background_image' => 'everest_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Đặc Quyền Sở Hữu Ford Everest',
                            'description' => 'Nhận ngay gói bảo hiểm thân vỏ 1 năm, thảm lót sàn da 5D cao cấp và hỗ trợ mua trả góp lên tới 80% giá trị xe.',
                            'image' => 'everest_hero.png',
                            'button_text' => 'Tư vấn chi tiết'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Góc nhìn 360° Ford Everest',
                            'description' => 'Trải nghiệm vẻ ngoài bệ vệ, khỏe khoắn đặc trưng từ mọi góc nhìn và tùy biến màu sơn xe.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Vẻ ngoài uy nghi, sang trọng phong cách Mỹ',
                            'image_1' => 'everest_hero.png',
                            'image_2' => 'everest_interior.png',
                            'image_3' => 'everest_hero.png',
                            'title_2' => 'Nội thất 3 hàng ghế bọc da cao cấp & Cửa sổ trời Panorama',
                            'image_large' => 'everest_interior.png',
                            'image_large_2' => 'everest_interior_2.png',
                            'image_large_3' => 'everest_interior_3.png',
                            'title_3' => 'Hệ thống dẫn động 4WD thông minh cùng 6 chế độ lái',
                            'split_image' => 'everest_hero.png',
                            'split_title' => 'Đẳng cấp offroad',
                            'split_features' => [
                                ['value' => 'Bi-Turbo 2.0L', 'label' => 'Động cơ Diesel hiệu năng cao'],
                                ['value' => 'Watts-Linkage', 'label' => 'Hệ thống treo sau êm ái vượt trội'],
                                ['value' => 'Panorama', 'label' => 'Cửa sổ trời toàn cảnh mở điện'],
                                ['value' => '6 Mode', 'label' => 'Địa hình linh hoạt tối ưu']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Lựa chọn phiên bản Ford Everest',
                            'descriptions' => [
                                'Everest Titanium+ 4x4: Phiên bản cao cấp nhất trang bị 2 cầu chủ động thông minh và đầy ắp công nghệ an toàn hỗ trợ người lái.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'FeaturesList',
                        'data' => [
                            'features' => [
                                ['title' => 'Cửa sổ trời toàn cảnh', 'description' => 'Mang lại không gian mở rộng thoáng đãng tràn ngập ánh sáng tự nhiên.', 'image' => 'everest_interior.png'],
                                ['title' => 'Cốp điện mở rảnh tay', 'description' => 'Chỉ cần đá nhẹ chân bên dưới cốp để mở tự động khi mang đồ cồng kềnh.', 'image' => 'everest_hero.png']
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Everest Titanium+ sử dụng hệ dẫn động gì?', 'a' => 'Xe trang bị hệ dẫn động 2 cầu chủ động thông minh 4WD bán thời gian kết hợp khóa vi sai cầu sau.', 'is_open' => true],
                                ['q' => 'Xe 7 chỗ này có hàng ghế thứ 3 gập điện không?', 'a' => 'Hàng ghế thứ 3 trên Everest Titanium+ có hỗ trợ gập điện phẳng hoàn toàn bằng các nút bấm ở khoang cốp sau.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Kiến tạo hành trình tuyệt vời cùng Ford Everest',
                            'phone' => '1800 55 68 58',
                            'btn_text' => 'Đăng ký nhận báo giá lăn bánh',
                            'btn_link' => '/lien-he',
                            'car_image' => 'everest_hero.png'
                        ]
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 954000000,
                'image' => 'territory_hero.png',
                'image_thumbnail' => 'territory_thumbnail.png',
                'image_featured' => 'territory_featured.png',
                'images' => ['territory_hero.png', 'territory_interior.png'],
                'colors' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#e0e0e0', 'image_path' => 'territory_hero.png'],
                    ['name' => 'Đỏ Hỏa Tinh', 'hex' => '#c61918', 'image_path' => 'territory_hero.png'],
                ],
                'vi' => [
                    'title' => 'Territory Titanium X',
                    'tagline' => 'Đỉnh cao sang trọng và tiện nghi bậc nhất.',
                    'description' => 'Mẫu SUV 5 chỗ đô thị năng động với la-zăng 19 inch, ghế da thông hơi cao cấp, màn hình giải trí siêu lớn và công nghệ Co-Pilot 360.'
                ],
                'versions' => [
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
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD TERRITORY TITANIUM X',
                            'tagline' => 'Hiện đại. Sang trọng. Công nghệ tối tân.',
                            'button_text' => 'Nhận chương trình ưu đãi',
                            'button_link' => '/lien-he',
                            'background_image' => 'territory_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Vàng Cho Xe Territory',
                            'description' => 'Hỗ trợ mua xe trả góp lãi suất 5.9%, tặng kèm gói phụ kiện đặc quyền và miễn phí bảo dưỡng xe lần đầu.',
                            'image' => 'territory_hero.png',
                            'button_text' => 'Tư vấn ưu đãi'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Khám phá Territory 360°',
                            'description' => 'Trải nghiệm góc nhìn 360 độ ngoại thất mượt mà, mang tính khí động học cao của dòng SUV đô thị.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Diện mạo trẻ trung, phong cách thể thao đô thị',
                            'image_1' => 'territory_hero.png',
                            'image_2' => 'territory_interior.png',
                            'image_3' => 'territory_hero.png',
                            'title_2' => 'Nội thất hai tông màu sang trọng & Bảng taplo kỹ thuật số kép',
                            'image_large' => 'territory_interior.png',
                            'image_large_2' => 'territory_interior_2.png',
                            'image_large_3' => 'territory_interior_3.png',
                            'title_3' => 'Hệ thống phanh khẩn cấp & Tự động lùi xe thông minh',
                            'split_image' => 'territory_hero.png',
                            'split_title' => 'Tiện nghi kết nối',
                            'split_features' => [
                                ['value' => '1.5L Ecoboost', 'label' => 'Động cơ xăng tăng áp tiết kiệm'],
                                ['value' => '7-Cấp ướt', 'label' => 'Hộp số ly hợp kép vận hành êm'],
                                ['value' => '12" + 12"', 'label' => 'Cặp màn hình hiển thị đỉnh cao'],
                                ['value' => 'Co-Pilot 360', 'label' => 'Gói an toàn chủ động cao cấp']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Các phiên bản Ford Territory 5 chỗ',
                            'descriptions' => [
                                'Territory Titanium X: Mẫu xe gia đình đô thị 5 chỗ sang trọng nhất với mâm 19 inch và ghế da cao cấp đục lỗ thông gió.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'FeaturesList',
                        'data' => [
                            'features' => [
                                ['title' => 'Ghế da đục lỗ thông hơi', 'description' => 'Có chức năng sấy và làm mát ghế đem lại sự thoải mái trong mùa nắng nóng.', 'image' => 'territory_interior.png'],
                                ['title' => 'Lùi xe tự động rảnh tay', 'description' => 'Hỗ trợ bạn đỗ xe vào những chỗ chật hẹp mà không cần chạm tay vào vô lăng.', 'image' => 'territory_hero.png']
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Khoảng sáng gầm xe Territory là bao nhiêu?', 'a' => 'Khoảng sáng gầm xe đạt 190 mm, giúp xe dễ dàng leo lề và đi qua các đoạn đường ngập nước nhẹ.', 'is_open' => true],
                                ['q' => 'Xe Territory dùng nhiên liệu gì?', 'a' => 'Xe sử dụng động cơ xăng tăng áp EcoBoost 1.5L, khuyến nghị sử dụng xăng RON 95.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Bắt đầu cuộc sống hiện đại cùng Ford Territory',
                            'phone' => '1800 55 68 58',
                            'btn_text' => 'Nhận báo giá chi tiết',
                            'btn_link' => '/lien-he',
                            'car_image' => 'territory_hero.png'
                        ]
                    ]
                ]
            ],
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => true,
                'base_price' => 949000000,
                'image' => 'transit_hero.png',
                'image_thumbnail' => 'transit_thumbnail.png',
                'image_featured' => 'transit_featured.png',
                'images' => ['transit_hero.png', 'transit_hero.png'],
                'colors' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff', 'image_path' => 'transit_hero.png'],
                    ['name' => 'Bạc Ánh Kim', 'hex' => '#cbd5e1', 'image_path' => 'transit_hero.png'],
                ],
                'vi' => [
                    'title' => 'Transit Premium',
                    'tagline' => 'Nâng tầm trải nghiệm hành khách cao cấp.',
                    'description' => 'Phiên bản cao cấp trang bị cửa trượt điện tự động, hệ thống điều hòa độc lập phân vùng và cổng sạc USB tại từng hàng ghế.'
                ],
                'versions' => [
                    [
                        'price' => 949000000,
                        'specs' => [
                            'engine' => 'Turbo Diesel 2.2L TDCi',
                            'power' => '135 Hp @ 3750 rpm',
                            'torque' => '375 Nm @ 1500-2500 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '5.981 x 2.059 x 2.481 mm',
                            'clearance' => '165 mm',
                            'fuelEconomy' => '8.6 L/100km'
                        ],
                        'vi' => ['name' => 'Transit Premium 16 chỗ']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD TRANSIT PREMIUM',
                            'tagline' => 'Giải pháp vận chuyển hành khách cao cấp cho doanh nghiệp.',
                            'button_text' => 'Báo giá theo dự án',
                            'button_link' => '/lien-he',
                            'background_image' => 'transit_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Lô & Dự Án Ford Transit',
                            'description' => 'Hỗ trợ đặc biệt chi phí lăn bánh cho doanh nghiệp vận tải, tặng thẻ xăng và gói bảo dưỡng xe định kỳ.',
                            'image' => 'transit_hero.png',
                            'button_text' => 'Tư vấn doanh nghiệp'
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Các phiên bản Ford Transit 16 chỗ',
                            'descriptions' => [
                                'Transit Premium: Ghế ngồi bọc da cao cấp, trang bị cửa trượt điện và màn hình giải trí trung tâm.'
                            ]
                        ]
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 2439000000,
                'image' => 'explorer_hero.png',
                'image_thumbnail' => 'explorer_thumbnail.png',
                'image_featured' => 'explorer_featured.png',
                'images' => ['explorer_hero.png', 'explorer_hero.png'],
                'colors' => [
                    ['name' => 'Xanh Lam Hoàng Gia', 'hex' => '#1e3a8a', 'image_path' => 'explorer_hero.png'],
                    ['name' => 'Đỏ Ruby Mỹ', 'hex' => '#991b1b', 'image_path' => 'explorer_hero.png'],
                ],
                'vi' => [
                    'title' => 'Explorer Limited',
                    'tagline' => 'SUV cỡ lớn hạng sang nhập khẩu nguyên chiếc từ Mỹ.',
                    'description' => 'Sở hữu khối động cơ Ecoboost 2.3L danh tiếng, khoang cabin 3 hàng ghế rộng lớn siêu sang trọng và đầy ắp công nghệ cao cấp.'
                ],
                'versions' => [
                    [
                        'price' => 2439000000,
                        'specs' => [
                            'engine' => '2.3L Ecoboost Xăng tăng áp',
                            'power' => '301 Hp @ 5500 rpm',
                            'torque' => '431 Nm @ 2500 rpm',
                            'transmission' => 'Tự động 10 cấp',
                            'drivetrain' => 'Hai cầu chủ động thông minh',
                            'dimensions' => '5.049 x 2.004 x 1.778 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '9.8 L/100km'
                        ],
                        'vi' => ['name' => 'Explorer Limited 2.3L Ecoboost 10AT']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD EXPLORER LIMITED',
                            'tagline' => 'Đẳng cấp xe Mỹ - Vững vàng vị thế.',
                            'button_text' => 'Hẹn lịch lái thử',
                            'button_link' => '/lien-he',
                            'background_image' => 'explorer_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Gói Độc Quyền Sở Hữu Explorer',
                            'description' => 'Hỗ trợ gói bảo hành mở rộng chính hãng 5 năm, tặng thẻ mua phụ kiện 20 triệu cùng hỗ trợ tài chính tốt nhất.',
                            'image' => 'explorer_hero.png',
                            'button_text' => 'Tư vấn cao cấp'
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Đỉnh cao SUV nhập khẩu Mỹ',
                            'descriptions' => [
                                'Explorer Limited: Sở hữu hệ thống dẫn động 4WD thông minh, 3 hàng ghế chỉnh điện độc lập và hệ thống loa B&O danh tiếng.'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        // Seed vehicles
        foreach ($vehiclesData as $index => $vData) {
            $v = new Vehicle([
                'category_id'     => $vData['category_id'],
                'type'            => $vData['type'],
                'is_best_seller'  => $vData['is_best_seller'],
                'base_price'      => $vData['base_price'],
                'image'           => ['path' => $vData['image']],
                'image_thumbnail' => isset($vData['image_thumbnail']) ? ['path' => $vData['image_thumbnail']] : null,
                'image_featured'  => isset($vData['image_featured'])  ? ['path' => $vData['image_featured']]  : null,
                'images'          => array_map(fn($p) => ['path' => $p], $vData['images']),
                'colors'          => $vData['colors'],
                'layout_blocks'   => $vData['layout_blocks'],
                'status'          => 'ACTIVE',
                'sort_order'      => $index + 1
            ]);
            $v->fill(['vi' => $vData['vi']]);
            $v->save();

            // Seed version
            foreach ($vData['versions'] as $vVerData) {
                $vVer = new VehicleVersion([
                    'vehicle_id' => $v->id,
                    'price' => $vVerData['price'],
                    'specs' => $vVerData['specs'],
                    'status' => 'ACTIVE',
                    'sort_order' => 0
                ]);
                $vVer->fill(['vi' => $vVerData['vi']]);
                $vVer->save();
            }
        }

        $this->command->info('✅ Successfully seeded ' . count($vehiclesData) . ' Ford DNF vehicles & versions with dynamic blocks');

        // 3. CẤU HÌNH PHÍ LĂN BÁNH (Registration Fees)
        $regions = Region::where('level', 1)->take(5)->get();
        if ($regions->isEmpty()) {
            $rDongNai = Region::firstOrCreate(['code' => '48'], [
                'country_id' => 1,
                'level' => 1,
                'name' => 'Đồng Nai',
                'name_with_type' => 'Tỉnh Đồng Nai'
            ]);
            $regions = collect([$rDongNai]);
        }

        foreach ($regions as $region) {
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
                    'service_fee' => 2000000,
                ]
            );
        }

        $this->command->info('✅ Registration fees configured');

        // 4. BANNERS (Banners)
        $banners = [
            [
                'title'       => 'Ford Ranger Wildtrak Mới',
                'subtitle'    => 'Bản lĩnh dẫn đầu phân khúc bán tải​',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/san-pham/ranger-wildtrak',
                'location'    => ['homepage'],
                'image'       => ['path' => 'ranger_hero.png'],
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Khuyến Mãi Đặc Biệt',
                'subtitle'    => 'Ưu Đãi Lệ Phí Trước Bạ & Quà Tặng Cho Khách Hàng Biên Hòa',
                'button_text' => 'Nhận ưu đãi',
                'button_link' => '/lien-he?reason=Nhận%20chương%20trình%20ưu%20đãi',
                'location'    => ['homepage', 'homepage_hero'],
                'image'       => ['path' => 'assets/img-gradient-2.png'],
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Ford Everest Titanium+ 4x4',
                'subtitle'    => 'Dấn bước phiêu lưu - Đỉnh cao SUV 7 chỗ​',
                'button_text' => 'Đăng ký lái thử',
                'button_link' => '/lien-he?reason=Đăng%20ký%20lái%20thử',
                'location'    => ['homepage'],
                'image'       => ['path' => 'everest_hero.png'],
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
        $everestDb = Vehicle::whereTranslation('slug', 'everest-titanium-plus')->first() ?? Vehicle::first();
        $territoryDb = Vehicle::whereTranslation('slug', 'territory-titanium-x')->first() ?? Vehicle::first();

        $reviews = [
            [
                'customer_name' => 'Anh Hoàng Bách (Biên Hòa)',
                'content' => 'Rất hài lòng với chiếc Ford Everest mới mua tại đại lý. Nhân viên tư vấn nhiệt tình, làm thủ tục đăng ký biển số và dự toán chi phí lăn bánh cực nhanh gọn, giao xe đúng hẹn.',
                'rating' => 5,
                'vehicle_id' => $everestDb->id
            ],
            [
                'customer_name' => 'Chị Phương Vy (Long Thành)',
                'content' => 'Gia định mình mua chiếc Territory để đi lại trong phố. Xe 5 chỗ cabin rộng rãi, thiết kế đẹp và nhiều công nghệ hiện đại. Cảm ơn đội ngũ Đồng Nai Ford.',
                'rating' => 5,
                'vehicle_id' => $territoryDb->id
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
                'image' => ['path' => 'assets/img-gradient.png']
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
