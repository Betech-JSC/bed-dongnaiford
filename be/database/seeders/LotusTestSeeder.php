<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lotus\LotusCategory;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusReview;
use App\Models\Lotus\LotusBanner;
use App\Models\Lotus\LotusSponsor;
use App\Models\Lotus\LotusTeam;

class LotusTestSeeder extends Seeder
{
    public function run(): void
    {
        // ── Danh mục ────────────────────────────────
        $catKhoaHoc = LotusCategory::firstOrCreate(['slug' => 'khoa-hoc'], [
            'title'      => 'Khoá Học',
            'icon'       => '📚',
            'sort_order' => 1,
            'status'     => 'ACTIVE',
        ]);

        $catUngDung = LotusCategory::firstOrCreate(['slug' => 'ung-dung-giao-dich'], [
            'title'      => 'Ứng Dụng Giao Dịch',
            'icon'       => '📱',
            'sort_order' => 2,
            'status'     => 'ACTIVE',
        ]);

        $catSach = LotusCategory::firstOrCreate(['slug' => 'sach'], [
            'title'      => 'Sách',
            'icon'       => '📖',
            'sort_order' => 3,
            'status'     => 'ACTIVE',
        ]);

        $this->command->info('✅ Categories created');

        // ── Khoá học ────────────────────────────────
        $products = [
            [
                'category_id'     => $catKhoaHoc->id,
                'title'           => 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo',
                'slug'            => 'ft-17-he-thong-giao-dich',
                'overview'        => '<p>FT-17 là khoá học chuyên sâu về giao dịch lọc cộng hướng đa chỉ báo, giúp trader nắm vững kỹ thuật phân tích thị trường.</p>',
                'overview_courses'=> '<ul><li>Phân tích xu hướng thị trường</li><li>Kỹ thuật lọc tín hiệu</li><li>Quản lý rủi ro</li></ul>',
                'overview_future' => '<p>Sau khoá học bạn có thể giao dịch chuyên nghiệp trên Forex, Vàng, Crypto.</p>',
                'author'          => 'Mr. Zhou Yi (Châu Nhật)',
                'author_title'    => 'Nhà giao dịch Quốc tế',
                'price'           => 30739000,
                'is_hot'          => true,
                'sort_order'      => 1,
                'status'          => 'ACTIVE',
            ],
            [
                'category_id'     => $catKhoaHoc->id,
                'title'           => 'Phân tích cơ bản chuyên sâu',
                'slug'            => 'phan-tich-co-ban-chuyen-sau',
                'overview'        => '<p>Khoá học giúp hiểu rõ về phân tích cơ bản trong đầu tư tài chính.</p>',
                'author'          => 'Ths. Jenny',
                'author_title'    => 'Chuyên gia phân tích',
                'price'           => 15000000,
                'is_hot'          => true,
                'sort_order'      => 2,
                'status'          => 'ACTIVE',
            ],
            [
                'category_id'     => $catKhoaHoc->id,
                'title'           => 'GTV Nghệ thuật giao dịch ngắn hạn',
                'slug'            => 'gtv-nghe-thuat-giao-dich-ngan-han',
                'overview'        => '<p>Nghệ thuật giao dịch ngắn hạn theo phương pháp GTV độc quyền.</p>',
                'author'          => 'Mr. Leon',
                'author_title'    => 'Trader chuyên nghiệp',
                'price'           => 20000000,
                'is_hot'          => true,
                'sort_order'      => 3,
                'status'          => 'ACTIVE',
            ],
            [
                'category_id'     => $catUngDung->id,
                'title'           => 'iLotus - Công cụ giao dịch thị trường',
                'slug'            => 'ilotus-cong-cu-giao-dich',
                'author'          => 'Lotus Institute',
                'author_title'    => 'Official',
                'price'           => 5000000,
                'is_hot'          => false,
                'sort_order'      => 1,
                'status'          => 'ACTIVE',
            ],
            [
                'category_id'     => $catSach->id,
                'title'           => 'Hidden Rules of Money and Power',
                'slug'            => 'hidden-rules-of-money-and-power',
                'author'          => 'Zhou Yi',
                'author_title'    => 'Tác giả',
                'price'           => 299000,
                'is_hot'          => false,
                'sort_order'      => 1,
                'status'          => 'ACTIVE',
            ],
        ];

        foreach ($products as $p) {
            LotusProduct::firstOrCreate(['slug' => $p['slug']], $p);
        }

        $this->command->info('✅ Products created');

        // ── Reviews ─────────────────────────────────
        $product1 = LotusProduct::where('slug', 'ft-17-he-thong-giao-dich')->first();
        $reviews = [
            ['customer_name' => 'colinandmandy94', 'rating' => 5, 'content' => 'Does exactly what it says. Clear to read and understand. This is now the second iPhone we\'ve used it on.', 'product_id' => $product1?->id],
            ['customer_name' => 'trader_pro_2024', 'rating' => 5, 'content' => 'Khoá học rất hay, giúp tôi cải thiện đáng kể hiệu suất giao dịch. Cảm ơn thầy Zhou Yi!', 'product_id' => $product1?->id],
            ['customer_name' => 'nguyen_van_a',    'rating' => 4, 'content' => 'Nội dung phong phú, dễ hiểu. Recommend cho ai mới bắt đầu đầu tư.', 'product_id' => null],
            ['customer_name' => 'thi_truong_forex', 'rating' => 5, 'content' => 'Đã học nhiều khoá nhưng đây là khoá tốt nhất. Áp dụng vào thực tế rất hiệu quả.', 'product_id' => null],
        ];

        foreach ($reviews as $r) {
            LotusReview::firstOrCreate(
                ['customer_name' => $r['customer_name']],
                [...$r, 'status' => 'ACTIVE', 'sort_order' => 0]
            );
        }

        $this->command->info('✅ Reviews created');

        // ── Banners ─────────────────────────────────
        $banners = [
            [
                'title'       => 'Chuẩn hoá chất lượng giao dịch',
                'subtitle'    => 'Học từ các chuyên gia hàng đầu',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/khoa-hoc',
                'location'    => json_encode(['homepage', 'homepage_hero']),
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Khoá học FT-17 - Master Class',
                'subtitle'    => 'Hệ thống giao dịch lọc cộng hướng đa chỉ báo',
                'button_text' => 'Đăng ký ngay',
                'button_link' => '/khoa-hoc/ft-17',
                'location'    => json_encode(['homepage']),
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Hero Courses Banner',
                'subtitle'    => 'Khám phá các khoá học chất lượng',
                'button_text' => 'Xem tất cả',
                'button_link' => '/khoa-hoc',
                'location'    => json_encode(['courses']),
                'sort_order'  => 1,
            ],
        ];

        foreach ($banners as $b) {
            LotusBanner::firstOrCreate(['title' => $b['title']], [...$b, 'status' => 'ACTIVE']);
        }

        $this->command->info('✅ Banners created');

        // ── Team Members ────────────────────────────
        $teams = [
            [
                'name'        => 'Mr. Zhou Yi (Châu Nhật)',
                'job_title'   => 'Founder & CEO',
                'department'  => 'Ban Điều Hành',
                'short_bio'   => 'Nhà giao dịch Quốc tế với hơn 15 năm kinh nghiệm trên thị trường tài chính.',
                'bio'         => '<p>Mr. Zhou Yi là người sáng lập Lotus Institute, với tầm nhìn phát triển cộng đồng trader chuyên nghiệp tại Việt Nam.</p>',
                'email'       => 'zhouyi@lotusinstitute.vn',
                'sort_order'  => 1,
                'status'      => 'ACTIVE',
            ],
            [
                'name'        => 'Ths. Jenny',
                'job_title'   => 'Head of Education',
                'department'  => 'Đào Tạo',
                'short_bio'   => 'Chuyên gia phân tích với bằng Thạc sĩ Tài chính.',
                'bio'         => '<p>Ths. Jenny là trưởng bộ phận đào tạo, chịu trách nhiệm thiết kế chương trình học và quản lý chất lượng đào tạo.</p>',
                'email'       => 'jenny@lotusinstitute.vn',
                'sort_order'  => 2,
                'status'      => 'ACTIVE',
            ],
            [
                'name'        => 'Mr. Leon',
                'job_title'   => 'Senior Trader & Instructor',
                'department'  => 'Đào Tạo',
                'short_bio'   => 'Trader chuyên nghiệp với phương pháp GTV độc quyền.',
                'bio'         => '<p>Mr. Leon là giảng viên cao cấp, chuyên dạy về nghệ thuật giao dịch ngắn hạn.</p>',
                'email'       => 'leon@lotusinstitute.vn',
                'sort_order'  => 3,
                'status'      => 'ACTIVE',
            ],
        ];

        foreach ($teams as $t) {
            LotusTeam::firstOrCreate(['email' => $t['email']], $t);
        }

        $this->command->info('✅ Team members created');

        // ── Sponsors ─────────────────────────────────
        $sponsors = [
            ['name' => 'Forex Broker VN', 'link' => 'https://example.com', 'sort_order' => 1],
            ['name' => 'Gold Trade Pro',  'link' => 'https://example.com', 'sort_order' => 2],
            ['name' => 'Crypto Station',  'link' => 'https://example.com', 'sort_order' => 3],
            ['name' => 'VN Trading Club', 'link' => 'https://example.com', 'sort_order' => 4],
        ];

        foreach ($sponsors as $s) {
            LotusSponsor::firstOrCreate(['name' => $s['name']], [...$s, 'status' => 'ACTIVE']);
        }

        $this->command->info('✅ Sponsors created');
        $this->command->info('🎉 All Lotus test data seeded successfully!');
    }
}
