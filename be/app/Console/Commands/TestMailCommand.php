<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use App\Http\Notifications\CommonNotification;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email? : Địa chỉ email nhận test}';
    protected $description = 'Kiểm tra cấu hình SMTP và gửi thử email test';

    public function handle()
    {
        $targetEmail = $this->argument('email') ?: 'ninjadog654@gmail.com';

        $this->info("=== KIỂM TRA CẤU HÌNH MAIL SMTP ===");
        $mailer = config('mail.default');
        $host = config('mail.mailers.smtp.host');
        $port = config('mail.mailers.smtp.port');
        $encryption = config('mail.mailers.smtp.encryption') ?: '(none)';
        $username = config('mail.mailers.smtp.username');
        $password = config('mail.mailers.smtp.password');
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');

        $this->line("Mailer:       {$mailer}");
        $this->line("Host:         {$host}");
        $this->line("Port:         {$port}");
        $this->line("Encryption:   {$encryption}");
        $this->line("Username:     " . ($username ? $username : '<TRỐNG - CHƯA CẤU HÌNH>'));
        $this->line("Password:     " . ($password ? '****** (Đã cấu hình)' : '<TRỐNG - CHƯA CẤU HÌNH>'));
        $this->line("From:         {$fromAddress} ({$fromName})");
        $this->line("Gửi thử đến:  {$targetEmail}");
        $this->newLine();

        if (empty($username) || empty($password)) {
            $this->error("❌ CẢNH BÁO: MAIL_USERNAME hoặc MAIL_PASSWORD đang để trống trong file .env!");
            $this->warn("Máy chủ SMTP chắc chắn sẽ từ chối gửi email với mã lỗi '530 Authentication required'.");
            $this->warn("Vui lòng cấu hình tài khoản SMTP (ví dụ Gmail App Password) vào file .env trên server.");
            $this->newLine();
        }

        $this->info("Đang thử kết nối và gửi email qua SMTP...");

        try {
            $emailData = [
                'mail_title' => '🧪 [Đồng Nai Ford] Kiểm tra hệ thống gửi Mail thông báo',
                'Trạng thái' => 'Hệ thống gửi mail đang hoạt động bình thường!',
                'Thời gian' => now()->format('H:i:s d/m/Y'),
                'Người nhận' => $targetEmail,
                'url' => url('/admin'),
            ];

            Notification::route('mail', $targetEmail)
                ->notifyNow(new CommonNotification($emailData));

            $this->info("✅ THÀNH CÔNG: Email test đã được gửi đến: {$targetEmail}");
            $this->line("Vui lòng kiểm tra Hộp thư đến (Inbox) và Thư rác (Spam / Junk) của {$targetEmail}.");
            return 0;
        } catch (\Throwable $e) {
            $this->newLine();
            $this->error("❌ GỬI MAIL THẤT BẠI!");
            $this->error("Nguyên nhân: " . $e->getMessage());
            $this->newLine();
            $this->line("Hướng dẫn khắc phục:");
            $this->line("1. Mở file .env trên server và cấu hình đúng các biến:");
            $this->line("   MAIL_MAILER=smtp");
            $this->line("   MAIL_HOST=smtp.gmail.com");
            $this->line("   MAIL_PORT=587");
            $this->line("   MAIL_USERNAME=email_gui@gmail.com");
            $this->line("   MAIL_PASSWORD=mat_khau_ung_dung_16_ky_tu");
            $this->line("   MAIL_ENCRYPTION=tls");
            $this->line("   MAIL_FROM_ADDRESS=email_gui@gmail.com");
            $this->line("   MAIL_FROM_NAME=\"Đồng Nai Ford\"");
            $this->line("2. Chạy: php artisan config:clear");
            $this->line("3. Chạy lại lệnh: php artisan mail:test {$targetEmail}");
            return 1;
        }
    }
}
