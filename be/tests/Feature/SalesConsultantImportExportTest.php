<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use App\Models\Vehicle\SalesConsultant;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Rap2hpoutre\FastExcel\FastExcel;

class SalesConsultantImportExportTest extends TestCase
{
    use DatabaseTransactions;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create or get Admin
        $this->admin = Admin::first() ?? Admin::create([
            'name' => 'Test Admin',
            'email' => 'admin-test@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'status' => 1,
        ]);

        // 2. Ensure Admin has Super Admin role
        $role = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'admin']);
        $this->admin->assignRole($role);
    }

    public function test_admin_can_import_sales_consultants_from_excel()
    {
        // 1. Create mock data for Excel
        $data = [
            [
                'Họ tên' => 'Lê Quốc Tuấn',
                'Số điện thoại/Zalo' => '0984993997',
                'Số zalo' => '0984993997',
                'PHÒNG' => '1',
                'Facebook' => 'Quốc Tuấn',
                'Fanpage' => 'Ford Đồng Nai - Quốc Tuấn 0984.993.997',
                'Website' => 'ford-dongnai.net'
            ],
            [
                'Họ tên' => 'Nguyễn Thị Yến',
                'Số điện thoại/Zalo' => '0967 826 166',
                'Số zalo' => '0967826166',
                'PHÒNG' => '2',
                'Facebook' => 'Yến Yến',
                'Fanpage' => 'Yến Yến - Ford Đồng Nai 0967826166',
                'Website' => 'https://forddongnai.com.vn'
            ]
        ];

        // 2. Export mock data to a temp file
        $tempFile = tempnam(sys_get_temp_dir(), 'import_test') . '.xlsx';
        (new FastExcel($data))->export($tempFile);

        // 3. Prepare UploadedFile instance
        $uploadedFile = new UploadedFile(
            $tempFile,
            'import_test.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            null,
            true
        );

        // 4. Send request to import route
        $response = $this->actingAs($this->admin, 'admin')
            ->post('/admin/sales-consultants/import', [
                'file' => $uploadedFile
            ]);

        // 5. Assert redirection and success
        $response->assertStatus(302);
        
        // 6. Assert records are created in DB
        $tuan = SalesConsultant::where('phone', '0984993997')->first();
        $this->assertNotNull($tuan);
        $this->assertEquals('Lê Quốc Tuấn', $tuan->translate('vi')?->name);
        $this->assertEquals('le-quoc-tuan', $tuan->translate('vi')?->slug);
        $this->assertEquals('https://zalo.me/0984993997', $tuan->zalo_url);
        $this->assertEquals('1', $tuan->department);
        $this->assertEquals('Quốc Tuấn', $tuan->facebook_url);
        $this->assertEquals('Ford Đồng Nai - Quốc Tuấn 0984.993.997', $tuan->fanpage_url);
        $this->assertEquals('ford-dongnai.net', $tuan->custom_domain);

        $yen = SalesConsultant::where('phone', '0967 826 166')->first();
        $this->assertNotNull($yen);
        $this->assertEquals('Nguyễn Thị Yến', $yen->translate('vi')?->name);
        $this->assertEquals('https://zalo.me/0967826166', $yen->zalo_url);
        $this->assertEquals('2', $yen->department);
        $this->assertEquals('forddongnai.com.vn', $yen->custom_domain);

        // Clean up temp file
        @unlink($tempFile);
    }

    public function test_admin_can_export_sales_consultants()
    {
        // 1. Create a SalesConsultant record
        $consultant = new SalesConsultant([
            'phone' => '0123456789',
            'zalo_url' => 'https://zalo.me/0123456789',
            'facebook_url' => 'https://facebook.com/test',
            'fanpage_url' => 'https://facebook.com/testpage',
            'custom_domain' => 'test-consultant.com',
            'department' => '3',
            'status' => 'ACTIVE'
        ]);
        $consultant->fill([
            'vi' => [
                'name' => 'Nguyễn Văn Test',
                'slug' => 'nguyen-van-test',
                'job_title' => 'Cố vấn bán hàng'
            ]
        ]);
        $consultant->save();

        // 2. Send request to export route
        $response = $this->actingAs($this->admin, 'admin')
            ->get('/admin/sales-consultants/export');

        // 3. Assert file download response
        $response->assertStatus(200);
        $response->assertHeader('content-disposition', 'attachment; filename=localhost_sales_consultants_' . date('Y_m_d') . '.xlsx');
    }
}
