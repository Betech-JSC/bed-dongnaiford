<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use JamstackVietnam\Agency\Models\Agency;
use JamstackVietnam\Job\Models\Job;

class ServiceAgencyJobSeeder extends Seeder
{
    public function run(): void
    {
        // 1. SERVICES
        $services = [
            [
                'email' => 'service@dongnaiford.com.vn',
                'image' => ['path' => '/service-support-customer.jpg'],
                'benefit_image' => ['path' => '/service-support-customer.jpg'],
                'sliders' => [
                    ['path' => '/service-support-customer.jpg'],
                    ['path' => '/service-delivery.jpg']
                ],
                'position' => 1,
                'vi' => [
                    'title' => 'Chăm sóc khách hàng',
                    'slug' => 'customer-care',
                    'description' => 'Dịch vụ chăm sóc khách hàng 24/7 với đội ngũ tư vấn chuyên nghiệp, nhiệt tình.',
                    'content' => '<p>Đội ngũ chăm sóc khách hàng của Đồng Nai Ford luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.</p>'
                ],
                'en' => [
                    'title' => 'Customer Care',
                    'slug' => 'customer-care-en'
                ]
            ],
            [
                'email' => 'express@dongnaiford.com.vn',
                'image' => ['path' => '/service-fixed-car.jpg'],
                'benefit_image' => ['path' => '/service-fixed-car.jpg'],
                'sliders' => [['path' => '/service-fixed-car.jpg']],
                'position' => 2,
                'vi' => [
                    'title' => 'Bảo dưỡng nhanh',
                    'slug' => 'express-maintenance',
                    'description' => 'Dịch vụ bảo dưỡng nhanh chóng trong 45 phút, không cần hẹn trước.',
                    'content' => '<p>Chúng tôi cam kết hoàn thành bảo dưỡng định kỳ trong vòng 45 phút.</p>'
                ]
            ],
            [
                'email' => 'periodic@dongnaiford.com.vn',
                'image' => ['path' => '/service-delivery.jpg'],
                'benefit_image' => ['path' => '/service-delivery.jpg'],
                'sliders' => [['path' => '/service-delivery.jpg']],
                'position' => 3,
                'vi' => [
                    'title' => 'Bảo dưỡng định kỳ',
                    'slug' => 'periodic-maintenance',
                    'description' => 'Chương trình bảo dưỡng định kỳ theo lịch của nhà sản xuất với chi phí minh bạch.',
                    'content' => '<p>Bảo dưỡng định kỳ theo chuẩn Ford toàn cầu.</p>'
                ]
            ],
            [
                'email' => 'pickup@dongnaiford.com.vn',
                'image' => ['path' => '/showroom_bg.png'],
                'benefit_image' => ['path' => '/showroom_bg.png'],
                'sliders' => [['path' => '/showroom_bg.png']],
                'position' => 4,
                'vi' => [
                    'title' => 'Nhận và giao xe tận nơi',
                    'slug' => 'pickup-delivery',
                    'description' => 'Miễn phí nhận và giao xe tận nhà trong bán kính 10km cho khách hàng bảo dưỡng.',
                    'content' => '<p>Dịch vụ tiện lợi giúp bạn tiết kiệm thời gian.</p>'
                ]
            ],
        ];

        foreach ($services as $serviceData) {
            $service = new Service([
                'email' => $serviceData['email'],
                'image' => $serviceData['image'],
                'benefit_image' => $serviceData['benefit_image'],
                'sliders' => $serviceData['sliders'],
                'position' => $serviceData['position'],
                'status' => 'ACTIVE',
            ]);
            $service->fill($serviceData);
            $service->save();
        }

        $this->command->info('✅ Services created: ' . count($services));

        // 2. AGENCIES
        $agencies = [
            [
                'region' => 'Đồng Nai',
                'province_id' => '48',
                'is_headquarter' => true,
                'is_featured' => true,
                'position' => 1,
                'longitude' => 106.8419,
                'latitude' => 10.9638,
                'link_google_map' => 'https://maps.google.com/?q=10.9638,106.8419',
                'image' => ['path' => '/showroom_bg.png'],
                'images' => [
                    ['path' => '/showroom_bg.png'],
                    ['path' => '/showroom_map.png']
                ],
                'vi' => [
                    'title' => 'Showroom Đồng Nai Ford - Biên Hòa',
                    'slug' => 'showroom-dong-nai-ford-bien-hoa',
                    'full_address' => 'Khu thương mại Amata, Đường Biên Hòa - Vũng Tàu, Long Bình, TP. Biên Hòa, Đồng Nai',
                    'phones' => [['number' => '(0251) 3857 130', 'type' => 'main']],
                    'info' => [
                        'email' => 'contact@dongnaiford.com.vn',
                        'working_time' => 'Thứ 2 - Chủ nhật: 8:00 - 18:00'
                    ],
                    'content' => '<p>Showroom chính thức của Ford tại Đồng Nai với cơ sở vật chất hiện đại, đội ngũ chuyên nghiệp.</p>'
                ]
            ],
            [
                'region' => 'Đồng Nai',
                'province_id' => '48',
                'is_headquarter' => false,
                'is_featured' => false,
                'position' => 2,
                'longitude' => 106.9524,
                'latitude' => 10.9804,
                'link_google_map' => 'https://maps.google.com/?q=10.9804,106.9524',
                'image' => ['path' => '/showroom_bg.png'],
                'vi' => [
                    'title' => 'Xưởng Dịch Vụ Đồng Nai Ford - Long Thành',
                    'slug' => 'xuong-dich-vu-long-thanh',
                    'full_address' => 'KCN Long Thành, Huyện Long Thành, Đồng Nai',
                    'phones' => [['number' => '(0251) 3857 140', 'type' => 'main']],
                    'info' => [
                        'email' => 'service@dongnaiford.com.vn',
                        'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30'
                    ],
                    'content' => '<p>Xưởng dịch vụ chuyên nghiệp với trang thiết bị hiện đại.</p>'
                ]
            ],
        ];

        foreach ($agencies as $agencyData) {
            $agency = new Agency([
                'region' => $agencyData['region'],
                'province_id' => $agencyData['province_id'],
                'is_headquarter' => $agencyData['is_headquarter'],
                'is_featured' => $agencyData['is_featured'],
                'position' => $agencyData['position'],
                'longitude' => $agencyData['longitude'],
                'latitude' => $agencyData['latitude'],
                'link_google_map' => $agencyData['link_google_map'],
                'image' => $agencyData['image'],
                'images' => $agencyData['images'] ?? null,
                'status' => 'ACTIVE',
            ]);
            $agency->fill($agencyData);
            $agency->save();
        }

        $this->command->info('✅ Agencies created: ' . count($agencies));

        // 3. JOBS
        $jobs = [
            [
                'position' => 1,
                'quantity' => 3,
                'expected_time' => now()->addDays(30),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Tư vấn bán hàng (Sales Consultant)',
                    'slug' => 'tuvan-ban-hang-sales-consultant',
                    'working_position' => 'Tư vấn bán hàng',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30, Chủ Nhật: 8:00 - 12:00',
                    'description' => 'Tư vấn và bán các sản phẩm xe Ford cho khách hàng cá nhân và doanh nghiệp.',
                    'content' => '<h2>Mô tả công việc</h2><p>Gia nhập đội ngũ bán hàng chuyên nghiệp của Đồng Nai Ford.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Cao đẳng trở lên</li><li>Ưu tiên có kinh nghiệm bán hàng ô tô</li><li>Kỹ năng giao tiếp tốt, nhiệt tình</li><li>Có bằng lái xe B2</li></ul><h3>Quyền lợi</h3><ul><li>Lương cơ bản + Hoa hồng hấp dẫn (15,000,000 - 25,000,000 VNĐ)</li><li>Bảo hiểm đầy đủ theo luật</li><li>Được đào tạo chuyên sâu về sản phẩm Ford</li><li>Môi trường làm việc chuyên nghiệp</li></ul>'
                ]
            ],
            [
                'position' => 2,
                'quantity' => 2,
                'expected_time' => now()->addDays(45),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Kỹ thuật viên bảo dưỡng sửa chữa',
                    'slug' => 'ky-thuat-vien-bao-duong-sua-chua',
                    'working_position' => 'Kỹ thuật viên',
                    'work_address' => 'Xưởng dịch vụ Ford - Long Thành, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30',
                    'description' => 'Thực hiện công việc bảo dưỡng, sửa chữa xe Ford theo quy trình chuẩn.',
                    'content' => '<h2>Mô tả công việc</h2><p>Trở thành kỹ thuật viên chuyên nghiệp được đào tạo bởi Ford.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Trung cấp nghề trở lên chuyên ngành Cơ khí, Ô tô</li><li>Am hiểu về cơ khí ô tô</li><li>Có khả năng làm việc nhóm</li></ul><h3>Quyền lợi</h3><ul><li>Lương thỏa thuận theo năng lực (12,000,000 - 18,000,000 VNĐ)</li><li>Bảo hiểm xã hội đầy đủ</li><li>Được đào tạo kỹ thuật Ford chính hãng</li></ul>'
                ]
            ],
            [
                'position' => 3,
                'quantity' => 1,
                'expected_time' => now()->addDays(60),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Nhân viên Marketing',
                    'slug' => 'nhan-vien-marketing',
                    'working_position' => 'Nhân viên Marketing',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 6: 8:00 - 17:00',
                    'description' => 'Triển khai các chiến dịch marketing online và offline cho showroom.',
                    'content' => '<h2>Mô tả công việc</h2><p>Cơ hội phát triển sự nghiệp trong ngành ô tô.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Đại học chuyên ngành Marketing, Truyền thông</li><li>Có kinh nghiệm làm marketing 1-2 năm</li><li>Thành thạo Facebook Ads, Google Ads</li></ul><h3>Quyền lợi</h3><ul><li>Lương: 10-15 triệu + KPI (10,000,000 - 15,000,000 VNĐ)</li><li>Môi trường sáng tạo</li><li>Được tiếp cận ngân sách marketing lớn</li></ul>'
                ]
            ],
        ];

        foreach ($jobs as $jobData) {
            $job = new Job([
                'position' => $jobData['position'],
                'quantity' => $jobData['quantity'],
                'expected_time' => $jobData['expected_time'],
                'published_at' => $jobData['published_at'],
                'status' => 'ACTIVE',
            ]);
            $job->fill($jobData);
            $job->save();
        }

        $this->command->info('✅ Jobs created: ' . count($jobs));
        $this->command->info('🎉 Services, Agencies, Jobs seeding completed!');
    }
}
