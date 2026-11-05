<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UsedVehicle\UsedVehicle;
use Illuminate\Support\Facades\DB;

class UsedVehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Truncate
        UsedVehicle::query()->delete();
        DB::table('used_vehicle_translations')->truncate();

        // 1. Ford Ranger Wildtrak 2021
        $car1 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 10,
            'price' => 745000000,
            'year' => 2021,
            'odo' => 35000,
            'image' => ['path' => 'uploads/ranger_wildtrak.png'],
            'images' => [
                ['path' => 'uploads/ranger_wildtrak.png'],
                ['path' => 'uploads/ranger_hero.png'],
                ['path' => 'uploads/ranger_raptor.png']
            ]
        ]);
        $car1->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Ranger Wildtrak 2.0L 4x4 AT 2021',
            'slug' => 'ford-ranger-wildtrak-2-0l-4x4-at-2021',
            'tagline' => 'Xe một đời chủ, đi giữ gìn, Odo 35,000 km, cam kết không đâm đụng ngập nước.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2021</li><li><strong>Số km đã đi:</strong> 35,000 km</li><li><strong>Hộp số:</strong> Tự động 10 cấp</li><li><strong>Động cơ:</strong> 2.0L Bi-Turbo Diesel</li><li><strong>Màu sắc:</strong> Cam Wildtrak đặc trưng</li></ul><p>Xe cá nhân sử dụng kỹ, bảo dưỡng định kỳ đầy đủ tại Ford Đồng Nai. Đã lên một số đồ chơi cơ bản: nắp thùng cuộn điện, dán phim cách nhiệt cao cấp 3M, thảm lót sàn 3D. Cam kết chất lượng xe bằng văn bản, hỗ trợ trả góp qua ngân hàng lên đến 70% giá trị xe.</p>'
        ]);
        $car1->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Ranger Wildtrak 2.0L 4x4 AT 2021',
            'slug' => 'used-ford-ranger-wildtrak-2-0l-4x4-at-2021',
            'tagline' => 'One owner, well-maintained, Odo 35,000 km, no accident or flood history.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2021</li><li><strong>Mileage:</strong> 35,000 km</li><li><strong>Transmission:</strong> 10-speed Automatic</li><li><strong>Engine:</strong> 2.0L Bi-Turbo Diesel</li><li><strong>Color:</strong> Signature Orange Wildtrak</li></ul><p>Privately owned car, full periodic maintenance history at Dong Nai Ford. Already upgraded with electric roller shutter, premium 3M window film, and 3D floor mats. Certified quality, bank loan support up to 70% of vehicle value.</p>'
        ]);

        // 2. Ford Everest Titanium 2023
        $car2 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 20,
            'price' => 1390000000,
            'year' => 2023,
            'odo' => 12000,
            'image' => ['path' => 'uploads/everest_platinum.png'],
            'images' => [
                ['path' => 'uploads/everest_platinum.png'],
                ['path' => 'uploads/everest_hero.png']
            ]
        ]);
        $car2->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Everest Titanium+ 2.0L Bi-Turbo 4x4 AT 2023',
            'slug' => 'ford-everest-titanium-2-0l-bi-turbo-4x4-at-2023',
            'tagline' => 'Xe siêu lướt 12,000 km, phiên bản 2 cầu cao cấp nhất, màu trắng ngọc trai.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2023</li><li><strong>Số km đã đi:</strong> 12,000 km (siêu lướt)</li><li><strong>Hộp số:</strong> Tự động 10 cấp điện tử (E-Shifter)</li><li><strong>Động cơ:</strong> 2.0L Bi-Turbo Diesel</li><li><strong>Màu ngoại thất:</strong> Trắng ngọc trai</li><li><strong>Màu nội thất:</strong> Đen da cao cấp</li></ul><p>Xe gia đình sử dụng cực kỳ giữ gìn, sơn zin 99%, đầy đủ lịch sử hãng. Trang bị hàng loạt tính năng an toàn chủ động ADAS thông minh, cửa sổ trời toàn cảnh panorama, màn hình giải trí lớn 12-inch Sync 4. Bảo hành chính hãng Ford Việt Nam đến năm 2026. Hỗ trợ thủ tục sang tên đổi chủ nhanh gọn.</p>'
        ]);
        $car2->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Everest Titanium+ 2.0L Bi-Turbo 4x4 AT 2023',
            'slug' => 'used-ford-everest-titanium-2-0l-bi-turbo-4x4-at-2023',
            'tagline' => 'Super gloss 12,000 km, top-of-the-line 4x4 version, elegant pearl white color.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2023</li><li><strong>Mileage:</strong> 12,000 km</li><li><strong>Transmission:</strong> 10-speed Electronic Automatic (E-Shifter)</li><li><strong>Engine:</strong> 2.0L Bi-Turbo Diesel</li><li><strong>Exterior Color:</strong> Pearl White</li><li><strong>Interior Color:</strong> Premium Black Leather</li></ul><p>Very well-maintained family car, 99% original paint, full Ford service history. Equipped with intelligent ADAS safety features, panoramic sunroof, and a large 12-inch Sync 4 screen. Factory warranty valid until 2026. Quick ownership transfer support.</p>'
        ]);

        // 3. Ford Territory Trend 2023
        $car3 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 30,
            'price' => 715000000,
            'year' => 2023,
            'odo' => 22000,
            'image' => ['path' => 'uploads/territory_hero.png'],
            'images' => [
                ['path' => 'uploads/territory_hero.png']
            ]
        ]);
        $car3->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Territory Trend 1.5L AT 2023',
            'slug' => 'ford-territory-trend-1-5l-at-2023',
            'tagline' => 'Odo 22,000 km, không gian nội thất cực rộng, xe gia đình tiện nghi.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2023</li><li><strong>Số km đã đi:</strong> 22,000 km</li><li><strong>Hộp số:</strong> Tự động 7 cấp (ly hợp kép ướt)</li><li><strong>Động cơ:</strong> 1.5L EcoBoost Xăng</li><li><strong>Màu ngoại thất:</strong> Đen</li></ul><p>Dòng C-SUV đô thị hiện đại, vận hành êm ái và tiết kiệm nhiên liệu. Xe được trang bị ghế da pha nỉ, màn hình kép 12-inch sang trọng, phanh tay điện tử, Auto Hold, điều hòa tự động có lọc bụi mịn PM2.5. Bảo hành chính hãng còn hiệu lực. Hỗ trợ vay mua xe trả góp lãi suất ưu đãi.</p>'
        ]);
        $car3->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Territory Trend 1.5L AT 2023',
            'slug' => 'used-ford-territory-trend-1-5l-at-2023',
            'tagline' => 'Odo 22,000 km, extremely spacious interior, comfortable family SUV.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2023</li><li><strong>Mileage:</strong> 22,000 km</li><li><strong>Transmission:</strong> 7-speed Wet Dual-Clutch Automatic</li><li><strong>Engine:</strong> 1.5L EcoBoost Petrol</li><li><strong>Exterior Color:</strong> Black</li></ul><p>Modern urban C-SUV, smooth ride and fuel efficiency. Equipped with premium fabric-leather seats, a high-tech 12-inch dual screen, electric parking brake, Auto Hold, and automatic climate control with PM2.5 air filter. Active factory warranty. Cheap interest bank loan support.</p>'
        ]);

        // 4. Ford Transit 16 Chỗ 2022
        $car4 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 40,
            'price' => 680000000,
            'year' => 2022,
            'odo' => 48000,
            'image' => ['path' => 'assets/transit_premium.jpg'],
            'images' => [
                ['path' => 'assets/transit_premium.jpg'],
                ['path' => 'assets/transit-hero.jpg']
            ]
        ]);
        $car4->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Transit Tiêu Chuẩn 16 Chỗ 2022',
            'slug' => 'ford-transit-tieu-chuan-16-cho-2022',
            'tagline' => 'Xe kinh doanh du lịch chạy giữ gìn, bảo dưỡng định kỳ đầy đủ, máy móc nguyên bản.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2022</li><li><strong>Số km đã đi:</strong> 48,000 km</li><li><strong>Hộp số:</strong> Số sàn 6 cấp</li><li><strong>Động cơ:</strong> 2.2L TDCi Diesel</li><li><strong>Màu ngoại thất:</strong> Bạc</li></ul><p>Xe chuyên phục vụ đưa đón nội bộ gia đình và tour ngắn, dàn lạnh mát sâu, nội thất ghế bọc da sạch sẽ. Đã gắn sẵn cửa lùa điện tự động và camera hành trình. Pháp lý chuẩn chỉnh sang tên ngay.</p>'
        ]);
        $car4->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Transit Standard 16-Seater 2022',
            'slug' => 'used-ford-transit-standard-16-seater-2022',
            'tagline' => 'Tourism business vehicle, well preserved, full periodic maintenance, original engine.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2022</li><li><strong>Mileage:</strong> 48,000 km</li><li><strong>Transmission:</strong> 6-speed Manual</li><li><strong>Engine:</strong> 2.2L TDCi Diesel</li><li><strong>Color:</strong> Silver</li></ul>'
        ]);

        // 5. Ford Explorer Limited 2.3L EcoBoost 2022
        $car5 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 50,
            'price' => 1890000000,
            'year' => 2022,
            'odo' => 26000,
            'image' => ['path' => 'assets/territory-interior.jpg'],
            'images' => [
                ['path' => 'assets/territory-interior.jpg']
            ]
        ]);
        $car5->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Explorer Limited 2.3L EcoBoost 4WD 2022',
            'slug' => 'ford-explorer-limited-2-3l-ecoboost-4wd-2022',
            'tagline' => 'SUV full-size nhập Mỹ nguyên chiếc, đẳng cấp thương gia, full công nghệ an toàn.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2022</li><li><strong>Số km đã đi:</strong> 26,000 km</li><li><strong>Hộp số:</strong> Tự động 10 cấp</li><li><strong>Động cơ:</strong> 2.3L EcoBoost 300 mã lực</li><li><strong>Màu ngoại thất:</strong> Trắng ánh kim</li></ul><p>Xe nhập khẩu nguyên chiếc từ Mỹ, tiện nghi đỉnh cao với hệ thống âm thanh Bang & Olufsen 12 loa, sạc không dây, cửa sổ trời Panorama kép, gói Co-Pilot360 thông minh. Đăng ký tên cá nhân một chủ từ đầu.</p>'
        ]);
        $car5->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Explorer Limited 2.3L EcoBoost 4WD 2022',
            'slug' => 'used-ford-explorer-limited-2-3l-ecoboost-4wd-2022',
            'tagline' => 'US-imported full-size SUV, business-class comfort, complete active safety suite.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2022</li><li><strong>Mileage:</strong> 26,000 km</li><li><strong>Transmission:</strong> 10-speed Automatic</li><li><strong>Engine:</strong> 2.3L EcoBoost 300 hp</li></ul>'
        ]);

        // 6. Ford Ranger Raptor 2.0L Bi-Turbo 2022
        $car6 = UsedVehicle::create([
            'status' => 'ACTIVE',
            'sort_order' => 60,
            'price' => 1080000000,
            'year' => 2022,
            'odo' => 28000,
            'image' => ['path' => 'assets/ranger_raptor.jpg'],
            'images' => [
                ['path' => 'assets/ranger_raptor.jpg']
            ]
        ]);
        $car6->translations()->create([
            'locale' => 'vi',
            'title' => 'Ford Ranger Raptor 2.0L Bi-Turbo 4WD 2022',
            'slug' => 'ford-ranger-raptor-2-0l-bi-turbo-4wd-2022',
            'tagline' => 'Siêu bán tải hiệu năng cao, phuộc Fox Racing danh tiếng, xe đi giữ lướt 28.000 km.',
            'description' => '<h3>Thông tin chi tiết xe:</h3><ul><li><strong>Năm sản xuất:</strong> 2022</li><li><strong>Số km đã đi:</strong> 28,000 km</li><li><strong>Hộp số:</strong> Tự động 10 cấp</li><li><strong>Động cơ:</strong> 2.0L Bi-Turbo Diesel 213 Hp</li><li><strong>Màu ngoại thất:</strong> Xanh Performance</li></ul><p>Hệ thống giảm xóc Fox Racing đỉnh cao, chế độ lái Baja phấn khích trên sa mạc và off-road. Xe không độ chế máy móc, giữ zin 100%, bảo dưỡng chính hãng định kỳ.</p>'
        ]);
        $car6->translations()->create([
            'locale' => 'en',
            'title' => 'Used Ford Ranger Raptor 2.0L Bi-Turbo 4WD 2022',
            'slug' => 'used-ford-ranger-raptor-2-0l-bi-turbo-4wd-2022',
            'tagline' => 'High-performance truck with iconic Fox Racing shocks, pristine 28,000 km mileage.',
            'description' => '<h3>Vehicle Details:</h3><ul><li><strong>Year of manufacture:</strong> 2022</li><li><strong>Mileage:</strong> 28,000 km</li><li><strong>Engine:</strong> 2.0L Bi-Turbo Diesel</li></ul>'
        ]);

        $this->command->info('Used vehicles seeded successfully!');
    }
}
