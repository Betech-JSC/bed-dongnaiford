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

        // 2. LIST OF 24 VEHICLES
        $vehiclesData = [
            // --- SUV CATEGORY ---
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 739000000,
                'image' => 'assets/territory-promo.png',
                'images' => ['assets/territory-promo.png', 'assets/territory-hero.png'],
                'colors' => [
                    ['name' => 'Đỏ Hỏa Tinh', 'hex' => '#c61918', 'image_path' => 'assets/territory-promo.png'],
                    ['name' => 'Trắng Kim Cương', 'hex' => '#e0e0e0', 'image_path' => 'assets/territory-promo.png'],
                    ['name' => 'Xám Ánh Trăng', 'hex' => '#9e9ea3', 'image_path' => 'assets/territory-promo.png'],
                ],
                'vi' => [
                    'title' => 'Ford Territory Trend 1.5L AT',
                    'slug' => 'territory-trend-1-5l',
                    'tagline' => 'Tiêu chuẩn mới cho SUV gia đình đô thị.',
                    'description' => 'Trang bị động cơ Ecoboost mạnh mẽ, hộp số tự động 7 cấp cùng không gian cabin rộng rãi, lý tưởng cho những chuyến đi trong thành phố.'
                ],
                'versions' => [
                    [
                        'price' => 739000000,
                        'specs' => [
                            'engine' => '1.5L Ecoboost Xăng tăng áp',
                            'power' => '160 Hp @ 5400 rpm',
                            'torque' => '248 Nm @ 1500 rpm',
                            'transmission' => 'Tự động 7 cấp ly hợp kép',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.630 x 1.935 x 1.706 mm',
                            'clearance' => '190 mm',
                            'fuelEconomy' => '7.0 L/100km'
                        ],
                        'vi' => ['name' => 'Territory Trend 1.5L AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 899000000,
                'image' => 'assets/territory-hero.png',
                'images' => ['assets/territory-hero.png'],
                'colors' => [
                    ['name' => 'Xanh Biển Sâu', 'hex' => '#67859f', 'image_path' => 'assets/territory-hero.png'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000', 'image_path' => 'assets/territory-hero.png']
                ],
                'vi' => [
                    'title' => 'Ford Territory Titanium 1.5L AT',
                    'slug' => 'territory-titanium-1-5l',
                    'tagline' => 'Công nghệ thông minh hỗ trợ người lái.',
                    'description' => 'Tích hợp gói công nghệ an toàn cao cấp Co-Pilot 360 mang đến sự an tâm tuyệt đối trên mọi hành trình.'
                ],
                'versions' => [
                    [
                        'price' => 899000000,
                        'specs' => [
                            'engine' => '1.5L Ecoboost Xăng tăng áp',
                            'power' => '160 Hp @ 5400 rpm',
                            'torque' => '248 Nm @ 1500 rpm',
                            'transmission' => 'Tự động 7 cấp ly hợp kép',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.630 x 1.935 x 1.706 mm',
                            'clearance' => '190 mm',
                            'fuelEconomy' => '7.0 L/100km'
                        ],
                        'vi' => ['name' => 'Territory Titanium 1.5L AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 954000000,
                'image' => 'assets/figma_car_territory.png',
                'images' => ['assets/figma_car_territory.png'],
                'colors' => [
                    ['name' => 'Xám Ánh Trăng', 'hex' => '#9e9ea3', 'image_path' => 'assets/figma_car_territory.png']
                ],
                'vi' => [
                    'title' => 'Ford Territory Titanium X 1.5L AT',
                    'slug' => 'territory-titanium-x-1-5l',
                    'tagline' => 'Đỉnh cao sang trọng và tiện nghi bậc nhất.',
                    'description' => 'Mẫu SUV cao cấp nhất với la-zăng 19 inch, ghế da thông hơi cao cấp và màn hình giải trí siêu lớn.'
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
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 1099000000,
                'image' => 'assets/car-everest.png',
                'images' => ['assets/car-everest.png'],
                'colors' => [
                    ['name' => 'Trắng Tuyết', 'hex' => '#fafafa', 'image_path' => 'assets/car-everest.png']
                ],
                'vi' => [
                    'title' => 'Ford Everest Ambient 2.0L AT 4x2',
                    'slug' => 'everest-ambient-2-0l-at',
                    'tagline' => 'Đẳng cấp SUV 7 chỗ đích thực.',
                    'description' => 'Mẫu SUV 7 chỗ đa dụng bền bỉ, tiết kiệm nhiên liệu tối ưu và đầy đủ các tính năng an toàn cơ bản.'
                ],
                'versions' => [
                    [
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
                        'vi' => ['name' => 'Everest Ambient 2.0L Turbo 6AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 1178000000,
                'image' => 'assets/car-everest.png',
                'images' => ['assets/car-everest.png'],
                'colors' => [
                    ['name' => 'Đen Bóng', 'hex' => '#000000', 'image_path' => 'assets/car-everest.png']
                ],
                'vi' => [
                    'title' => 'Ford Everest Sport 2.0L AT 4x2',
                    'slug' => 'everest-sport-2-0l-at',
                    'tagline' => 'Phong cách thể thao, đậm chất cá tính.',
                    'description' => 'Thiết kế thể thao mạnh mẽ với các chi tiết sơn đen bóng ấn tượng ở lưới tản nhiệt, gương chiếu hậu và bộ mâm hợp kim.'
                ],
                'versions' => [
                    [
                        'price' => 1178000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Một cầu sau (RWD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '7.6 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Sport 2.0L Turbo 6AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 1286000000,
                'image' => 'assets/car-everest.png',
                'images' => ['assets/car-everest.png'],
                'colors' => [
                    ['name' => 'Xám Falcon', 'hex' => '#4b5563', 'image_path' => 'assets/car-everest.png']
                ],
                'vi' => [
                    'title' => 'Ford Everest Titanium 2.0L AT 4x2',
                    'slug' => 'everest-titanium-2-0l-at',
                    'tagline' => 'Sự kết hợp hoàn hảo giữa công nghệ và sự sang trọng.',
                    'description' => 'Trang bị ghế da cao cấp, chỉnh điện, hệ thống giải trí SYNC 4 màn hình lớn cùng khả năng cách âm vượt trội.'
                ],
                'versions' => [
                    [
                        'price' => 1286000000,
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
                        'vi' => ['name' => 'Everest Titanium 2.0L Turbo 6AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 1468000000,
                'image' => 'assets/car-everest.png',
                'images' => ['assets/car-everest.png'],
                'colors' => [
                    ['name' => 'Đỏ Cam', 'hex' => '#c2410c', 'image_path' => 'assets/car-everest.png']
                ],
                'vi' => [
                    'title' => 'Ford Everest Titanium+ 2.0L Bi-Turbo 4x4',
                    'slug' => 'everest-titanium-plus-bi-turbo',
                    'tagline' => 'Đỉnh cao vận hành, chinh phục mọi địa hình.',
                    'description' => 'Động cơ Bi-Turbo cực đại kết hợp hệ dẫn động 2 cầu chủ động thông minh 4WD mang lại sức mạnh vượt trội và sự linh hoạt tối đa.'
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
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 1499000000,
                'image' => 'assets/car-everest.png',
                'images' => ['assets/car-everest.png'],
                'colors' => [
                    ['name' => 'Cam Thể Thao', 'hex' => '#ea580c', 'image_path' => 'assets/car-everest.png']
                ],
                'vi' => [
                    'title' => 'Ford Everest Wildtrak 2.0L Bi-Turbo 4x4',
                    'slug' => 'everest-wildtrak-bi-turbo',
                    'tagline' => 'Độc bản phiêu lưu. Phong cách offroad đỉnh cao.',
                    'description' => 'Phiên bản đặc biệt kế thừa ADN thiết kế hầm hố từ dòng bán tải trứ danh Wildtrak, khẳng định phong cách phiêu lưu độc bản.'
                ],
                'versions' => [
                    [
                        'price' => 1499000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4WD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '8.2 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Wildtrak 2.0L Bi-Turbo 10AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 2439000000,
                'image' => 'assets/car-explorer.png',
                'images' => ['assets/car-explorer.png'],
                'colors' => [
                    ['name' => 'Xanh Lam', 'hex' => '#1e3a8a', 'image_path' => 'assets/car-explorer.png'],
                    ['name' => 'Đỏ Ruby', 'hex' => '#991b1b', 'image_path' => 'assets/car-explorer.png']
                ],
                'vi' => [
                    'title' => 'Ford Explorer Limited 2.3L Ecoboost',
                    'slug' => 'ford-explorer-limited-2-3l',
                    'tagline' => 'SUV cỡ lớn hạng sang nhập khẩu nguyên chiếc từ Mỹ.',
                    'description' => 'Sở hữu khối động cơ Ecoboost danh tiếng, khoang cabin 3 hàng ghế rộng lớn siêu sang trọng và đầy ắp công nghệ cao cấp.'
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
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 603000000,
                'image' => 'assets/car-ecosport.png',
                'images' => ['assets/car-ecosport.png'],
                'colors' => [
                    ['name' => 'Đỏ Đồng', 'hex' => '#b45309', 'image_path' => 'assets/car-ecosport.png']
                ],
                'vi' => [
                    'title' => 'Ford EcoSport Trend 1.5L AT',
                    'slug' => 'ecosport-trend-1-5l',
                    'tagline' => 'Chuyên gia đường phố - Nhỏ gọn và đa năng.',
                    'description' => 'Mẫu SUV cỡ nhỏ linh hoạt giúp bạn dễ dàng luồn lách qua những con phố đông đúc ở Biên Hòa.'
                ],
                'versions' => [
                    [
                        'price' => 603000000,
                        'specs' => [
                            'engine' => '1.5L Dragon 3-cylinder',
                            'power' => '120 Hp @ 6300 rpm',
                            'torque' => '151 Nm @ 4500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.096 x 1.765 x 1.665 mm',
                            'clearance' => '175 mm',
                            'fuelEconomy' => '6.1 L/100km'
                        ],
                        'vi' => ['name' => 'EcoSport Trend 1.5L AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 686000000,
                'image' => 'assets/car-ecosport.png',
                'images' => ['assets/car-ecosport.png'],
                'colors' => [
                    ['name' => 'Trắng Sáng', 'hex' => '#f8fafc', 'image_path' => 'assets/car-ecosport.png']
                ],
                'vi' => [
                    'title' => 'Ford EcoSport Titanium 1.5L AT',
                    'slug' => 'ecosport-titanium-1-5l',
                    'tagline' => 'Trang bị thông minh cho cuộc sống hiện đại.',
                    'description' => 'Phiên bản EcoSport cao cấp với cửa sổ trời điều khiển điện, 7 túi khí và hệ thống khởi động thông minh Start/Stop.'
                ],
                'versions' => [
                    [
                        'price' => 686000000,
                        'specs' => [
                            'engine' => '1.5L Dragon 3-cylinder',
                            'power' => '120 Hp @ 6300 rpm',
                            'torque' => '151 Nm @ 4500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.096 x 1.765 x 1.665 mm',
                            'clearance' => '175 mm',
                            'fuelEconomy' => '6.1 L/100km'
                        ],
                        'vi' => ['name' => 'EcoSport Titanium 1.5L AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 819000000,
                'image' => 'assets/car-escape.png',
                'images' => ['assets/car-escape.png'],
                'colors' => [
                    ['name' => 'Xanh Ngọc', 'hex' => '#0d9488', 'image_path' => 'assets/car-escape.png']
                ],
                'vi' => [
                    'title' => 'Ford Escape Titanium 2.0L Ecoboost',
                    'slug' => 'escape-titanium-2-0l',
                    'tagline' => 'Thiết kế khí động học mạnh mẽ và tinh tế.',
                    'description' => 'Thế hệ Escape mới quay trở lại mang phong cách thiết kế mượt mà mang phong cách châu Âu thời thượng.'
                ],
                'versions' => [
                    [
                        'price' => 819000000,
                        'specs' => [
                            'engine' => '2.0L Ecoboost Xăng tăng áp',
                            'power' => '250 Hp @ 5500 rpm',
                            'torque' => '373 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 8 cấp',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.585 x 1.882 x 1.679 mm',
                            'clearance' => '180 mm',
                            'fuelEconomy' => '8.1 L/100km'
                        ],
                        'vi' => ['name' => 'Escape Titanium 2.0L Ecoboost 8AT']
                    ]
                ]
            ],
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 1699000000,
                'image' => 'assets/car-mach-e.png',
                'images' => ['assets/car-mach-e.png'],
                'colors' => [
                    ['name' => 'Xanh Lucid', 'hex' => '#0b3c5d', 'image_path' => 'assets/car-mach-e.png']
                ],
                'vi' => [
                    'title' => 'NEW FORD MUSTANG MACH-E',
                    'slug' => 'new-mustang-mach-e',
                    'tagline' => 'SUV thuần điện mang linh hồn xe cơ bắp Mỹ.',
                    'description' => 'Mẫu xe điện thể thao đột phá mang đậm di sản của dòng xe Mustang huyền thoại.'
                ],
                'versions' => [
                    [
                        'price' => 1699000000,
                        'specs' => [
                            'engine' => 'Động cơ điện Dual-Motor',
                            'power' => '346 Hp / 258 kW',
                            'torque' => '580 Nm',
                            'transmission' => 'Một cấp tự động',
                            'drivetrain' => 'Hai cầu toàn thời gian (AWD)',
                            'dimensions' => '4.713 x 1.881 x 1.597 mm',
                            'clearance' => '147 mm',
                            'fuelEconomy' => '18.7 kWh/100km'
                        ],
                        'vi' => ['name' => 'Mustang Mach-E Premium AWD']
                    ]
                ]
            ],

            // --- BÁN TẢI CATEGORY ---
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => false,
                'base_price' => 669000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Trắng Sáng', 'hex' => '#ffffff', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger XL 2.0L MT 4x4',
                    'slug' => 'ranger-xl-2-0l-mt',
                    'tagline' => 'Người bạn đồng hành thực dụng cho công việc nặng.',
                    'description' => 'Phiên bản số sàn 2 cầu mạnh mẽ, gầm cao tối ưu cho các công trường hoặc chuyên chở hàng hóa nông sản.'
                ],
                'versions' => [
                    [
                        'price' => 669000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4x4)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.2 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger XL 2.0L MT 4x4']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => true,
                'base_price' => 707000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Bạc Tinh Thể', 'hex' => '#cbd5e1', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger XLS 2.0L AT 4x2',
                    'slug' => 'ranger-xls-2-0l-at-4x2',
                    'tagline' => 'Bán tải đô thị đa dụng hàng đầu Việt Nam.',
                    'description' => 'Mẫu xe bán chạy nhất phân khúc nhờ chi phí đầu tư hợp lý, hộp số tự động đi lại êm ái cùng cabin hiện đại.'
                ],
                'versions' => [
                    [
                        'price' => 707000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Một cầu sau (4x2)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.5 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger XLS 2.0L AT 4x2']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => false,
                'base_price' => 776000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Bạc Tinh Thể', 'hex' => '#cbd5e1', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger XLS 2.0L AT 4x4',
                    'slug' => 'ranger-xls-2-0l-at-4x4',
                    'tagline' => 'Tự động 2 cầu - Sẵn sàng cho mọi địa hình.',
                    'description' => 'Mang lại sự kết hợp tuyệt vời giữa hộp số tự động 6 cấp tiện lợi và hệ thống dẫn động 2 cầu vượt trội.'
                ],
                'versions' => [
                    [
                        'price' => 776000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4x4)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.8 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger XLS 2.0L AT 4x4']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => false,
                'base_price' => 864000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Xanh Dương', 'hex' => '#1d4ed8', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger Sport 2.0L AT 4x4',
                    'slug' => 'ranger-sport-2-0l-at',
                    'tagline' => 'Diện mạo thể thao khỏe khoắn đầy lôi cuốn.',
                    'description' => 'Sở hữu vành đúc 18 inch phay xước thể thao, lưới tản nhiệt sơn đen mờ cá tính cùng cụm đèn LED chữ C đặc trưng.'
                ],
                'versions' => [
                    [
                        'price' => 864000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4x4)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.9 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Sport 2.0L AT 4x4']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => true,
                'base_price' => 979000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Vàng Sành Điệu', 'hex' => '#f59e0b', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger Wildtrak 2.0L Bi-Turbo 4x4',
                    'slug' => 'ranger-wildtrak-bi-turbo',
                    'tagline' => 'Bản lĩnh dẫn đầu phân khúc bán tải cao cấp.',
                    'description' => 'Thiết kế sang trọng đầy công nghệ với ghế bọc da chỉ khâu Wildtrak màu cam nổi bật, động cơ Bi-Turbo cực đại.'
                ],
                'versions' => [
                    [
                        'price' => 979000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp',
                            'drivetrain' => 'Hai cầu chủ động bán thời gian',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '8.0 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Wildtrak 2.0L Bi-Turbo 10AT']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => false,
                'base_price' => 1039000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Xám Meteor', 'hex' => '#4b5563', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger Stormtrak 2.0L Bi-Turbo 4x4',
                    'slug' => 'ranger-stormtrak-bi-turbo',
                    'tagline' => 'Đỉnh cao trang bị dã ngoại và phiêu lưu.',
                    'description' => 'Phiên bản bán tải tối tân với giá đỡ thể thao di động đa chức năng và hệ thống đèn LED bổ sung hiệu suất cao trên lưới tản nhiệt.'
                ],
                'versions' => [
                    [
                        'price' => 1039000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4x4)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '8.1 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Stormtrak 2.0L Bi-Turbo 10AT']
                    ]
                ]
            ],
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => true,
                'base_price' => 1299000000,
                'image' => 'assets/car-ranger.png',
                'images' => ['assets/car-ranger.png'],
                'colors' => [
                    ['name' => 'Cam Code Orange', 'hex' => '#ea580c', 'image_path' => 'assets/car-ranger.png']
                ],
                'vi' => [
                    'title' => 'Ford Ranger Raptor 2.0L Bi-Turbo',
                    'slug' => 'ranger-raptor-bi-turbo',
                    'tagline' => 'Chiến binh sa mạc - Vua bán tải hiệu năng cao.',
                    'description' => 'Được chế tác bởi đội ngũ Ford Performance với bộ giảm xóc FOX 2.5" Live Valve đỉnh cao.'
                ],
                'versions' => [
                    [
                        'price' => 1299000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4 Ford Performance',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động thông minh',
                            'dimensions' => '5.381 x 2.028 x 1.922 mm',
                            'clearance' => '272 mm',
                            'fuelEconomy' => '8.9 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Raptor 2.0L Bi-Turbo 10AT']
                    ]
                ]
            ],

            // --- THƯƠNG MẠI CATEGORY ---
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => true,
                'base_price' => 849000000,
                'image' => 'assets/car-transit.png',
                'images' => ['assets/car-transit.png'],
                'colors' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff', 'image_path' => 'assets/car-transit.png']
                ],
                'vi' => [
                    'title' => 'Ford Transit Trend 16 chỗ',
                    'slug' => 'transit-trend-16-cho',
                    'tagline' => 'Đối tác vận chuyển tin cậy hàng đầu Việt Nam.',
                    'description' => 'Mẫu xe 16 chỗ bền bỉ, tiết kiệm nhiên liệu tối ưu và có khoang hành khách rộng rãi bậc nhất.'
                ],
                'versions' => [
                    [
                        'price' => 849000000,
                        'specs' => [
                            'engine' => 'Turbo Diesel 2.2L TDCi',
                            'power' => '135 Hp @ 3750 rpm',
                            'torque' => '375 Nm @ 1500-2500 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '5.981 x 2.059 x 2.481 mm',
                            'clearance' => '165 mm',
                            'fuelEconomy' => '8.5 L/100km'
                        ],
                        'vi' => ['name' => 'Transit Trend 16 chỗ']
                    ]
                ]
            ],
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => false,
                'base_price' => 949000000,
                'image' => 'assets/car-transit.png',
                'images' => ['assets/car-transit.png'],
                'colors' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff', 'image_path' => 'assets/car-transit.png']
                ],
                'vi' => [
                    'title' => 'Ford Transit Premium 16 chỗ',
                    'slug' => 'transit-premium-16-cho',
                    'tagline' => 'Nâng tầm trải nghiệm hành khách cao cấp.',
                    'description' => 'Phiên bản cao cấp trang bị cửa trượt điện tự động, hệ thống điều hòa phân vùng và cổng sạc USB tại từng hàng ghế.'
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
                ]
            ],
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => false,
                'base_price' => 999000000,
                'image' => 'assets/car-tourneo.png',
                'images' => ['assets/car-tourneo.png'],
                'colors' => [
                    ['name' => 'Đen Bóng', 'hex' => '#1e1b4b', 'image_path' => 'assets/car-tourneo.png']
                ],
                'vi' => [
                    'title' => 'Ford Tourneo Trend 2.0L Ecoboost',
                    'slug' => 'tourneo-trend-2-0l',
                    'tagline' => 'Xe đa dụng MPV 7 chỗ - Êm ái đỉnh cao.',
                    'description' => 'Trang bị hệ thống treo khí nén phía sau đem lại độ êm ái hoàn hảo cho các chuyến hành trình của gia đình.'
                ],
                'versions' => [
                    [
                        'price' => 999000000,
                        'specs' => [
                            'engine' => '2.0L Ecoboost Xăng tăng áp',
                            'power' => '203 Hp @ 5500 rpm',
                            'torque' => '300 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.976 x 2.032 x 1.990 mm',
                            'clearance' => '149 mm',
                            'fuelEconomy' => '9.2 L/100km'
                        ],
                        'vi' => ['name' => 'Tourneo Trend 2.0L Ecoboost']
                    ]
                ]
            ],
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => true,
                'base_price' => 1069000000,
                'image' => 'assets/car-tourneo.png',
                'images' => ['assets/car-tourneo.png'],
                'colors' => [
                    ['name' => 'Đen Bóng', 'hex' => '#1e1b4b', 'image_path' => 'assets/car-tourneo.png']
                ],
                'vi' => [
                    'title' => 'Ford Tourneo Titanium 2.0L Ecoboost',
                    'slug' => 'tourneo-titanium-2-0l',
                    'tagline' => 'Khoang thương gia cao cấp di động.',
                    'description' => 'Hàng ghế thứ hai chỉnh điện độc lập dạng thương gia cùng vật liệu cách âm đặc biệt chống ồn tuyệt đối.'
                ],
                'versions' => [
                    [
                        'price' => 1069000000,
                        'specs' => [
                            'engine' => '2.0L Ecoboost Xăng tăng áp',
                            'power' => '203 Hp @ 5500 rpm',
                            'torque' => '300 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.976 x 2.032 x 1.990 mm',
                            'clearance' => '149 mm',
                            'fuelEconomy' => '9.2 L/100km'
                        ],
                        'vi' => ['name' => 'Tourneo Titanium 2.0L Ecoboost']
                    ]
                ]
            ],
        ];

        // Seed vehicles
        foreach ($vehiclesData as $index => $vData) {
            $v = new Vehicle([
                'category_id' => $vData['category_id'],
                'type' => $vData['type'],
                'is_best_seller' => $vData['is_best_seller'],
                'base_price' => $vData['base_price'],
                'image' => ['path' => $vData['image']],
                'images' => array_map(fn($p) => ['path' => $p], $vData['images']),
                'colors' => $vData['colors'],
                'status' => 'ACTIVE',
                'sort_order' => $index + 1
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

        $this->command->info('✅ Successfully seeded ' . count($vehiclesData) . ' Ford DNF vehicles & versions');

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
                'title'       => 'Ford Everest Mới',
                'subtitle'    => 'Dấn bước. Dẫn đầu​',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/san-pham/everest-titanium-plus-bi-turbo',
                'location'    => ['homepage'],
                'image'       => ['path' => 'assets/car-everest.png'],
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Khuyến Mãi Tháng 5',
                'subtitle'    => 'Ưu Đãi Lệ Phí Trước Bạ & Quà Tặng Đặc Biệt',
                'button_text' => 'Nhận ưu đãi',
                'button_link' => '/lien-he?reason=Nhận%20chương%20trình%20ưu%20đãi',
                'location'    => ['homepage', 'homepage_hero'],
                'image'       => ['path' => 'assets/img-gradient-2.png'],
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Ford Raptor Nhập Mỹ',
                'subtitle' => 'Chiến binh sa mạc - Độc bản hiệu năng​',
                'button_text' => 'Hẹn lái thử',
                'button_link' => '/lien-he?reason=Đăng%20ký%20lái%20thử',
                'location'    => ['homepage'],
                'image'       => ['path' => 'assets/car-ranger.png'],
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
        // Find seeded Everest to link to
        $everestDb = Vehicle::whereTranslation('slug', 'everest-titanium-plus-bi-turbo')->first() ?? Vehicle::first();
        $territoryDb = Vehicle::whereTranslation('slug', 'territory-titanium-x-1-5l')->first() ?? Vehicle::first();

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
