<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private string $botToken;
    private string $chatId;
    private string $baseUrl = 'https://api.telegram.org';

    public function __construct()
    {
        $botToken = config('services.telegram.bot_token', '');
        $chatId = config('services.telegram.chat_id', '');

        if (empty($botToken) && function_exists('settings')) {
            $botToken = (string) (settings('telegram_bot_token') ?? '');
        }

        if (empty($chatId) && function_exists('settings')) {
            $chatId = (string) (settings('telegram_chat_id') ?? '');
        }

        $this->botToken = $botToken;
        $this->chatId = $chatId;
    }

    /**
     * Gửi thông báo Lead nóng cho Sales team qua Telegram
     */
    public function sendHotLeadAlert(array $leadData, string $sessionId): bool
    {
        if (empty($this->botToken) || empty($this->chatId)) {
            Log::warning('Telegram not configured, skipping lead alert', $leadData);
            return false;
        }

        $title = $leadData['title'] ?? null;
        $type = $leadData['type'] ?? 'general';
        
        if (empty($title)) {
            $title = match ($type) {
                'test_drive' => '🚘 ĐĂNG KÝ LÁI THỬ XE',
                'quote', 'new_car_quote' => '💰 YÊU CẦU BÁO GIÁ XE MỚI',
                'repair_quote' => '🔧 BÁO GIÁ SỬA CHỮA & BẢO DƯỠNG',
                'service_booking' => '🛠️ ĐẶT LỊCH HẸN BẢO DƯỠNG',
                'apply' => '💼 HỒ SƠ ỨNG TUYỂN TUYỂN DỤNG',
                'callback' => '📞 YÊU CẦU GỌI LẠI',
                default => '💬 KHÁCH HÀNG ĐĂNG KÝ MỚI',
            };
        }

        $source = $leadData['source'] ?? ($type === 'chatbot' ? '🤖 AI Chatbot Trực Tuyến' : '🌐 Website Đồng Nai Ford');

        $name = $leadData['name'] ?? 'Chưa rõ';
        $phone = $leadData['phone'] ?? 'Chưa có';
        $email = $leadData['email'] ?? null;
        $vehicle = $leadData['vehicle'] ?? null;
        $service = $leadData['service'] ?? null;
        $messageText = $leadData['message'] ?? null;
        $licensePlate = $leadData['license_plate'] ?? null;
        $mileage = $leadData['mileage'] ?? null;
        $appointment = $leadData['appointment'] ?? null;
        $location = $leadData['location'] ?? null;
        $city = $leadData['city'] ?? null;

        // Xây dựng nội dung tin nhắn Telegram
        $message = "🔔 *{$title}*\n\n";
        $message .= "📝 *Nguồn tiếp nhận:* {$source}\n";
        $message .= "👤 *Khách hàng:* {$name}\n";
        $message .= "📞 *Số điện thoại:* `{$phone}`\n";

        if (!empty($email)) {
            $message .= "📧 *Email:* {$email}\n";
        }

        if (!empty($vehicle)) {
            $message .= "🚗 *Dòng xe quan tâm:* {$vehicle}\n";
        }

        if (!empty($licensePlate)) {
            $message .= "🔢 *Biển số xe:* `{$licensePlate}`\n";
        }

        if (!empty($appointment)) {
            $message .= "📅 *Thời gian hẹn:* {$appointment}\n";
        }

        if (!empty($location)) {
            $message .= "📍 *Địa điểm làm dịch vụ:* {$location}\n";
        }

        if (!empty($leadData['payment_method'])) {
            $message .= "💳 *Hình thức mua:* {$leadData['payment_method']}\n";
        }

        if (!empty($city)) {
            $message .= "🏙️ *Tỉnh/Thành nhận xe:* {$city}\n";
        }

        if (!empty($service)) {
            $message .= "🛠️ *Dịch vụ / Gói:* {$service}\n";
        }

        if (!empty($mileage)) {
            $message .= "📈 *Số KM hiện tại:* {$mileage} km\n";
        }

        if (!empty($messageText) && trim($messageText) !== '') {
            $cleanMsg = str_replace(['`', '*', '_'], '', trim($messageText));
            $msgLabel = match($type) {
                'service_booking' => 'Nội dung yêu cầu dịch vụ',
                'repair_quote' => 'Mô tả tình trạng xe / Ghi chú',
                'quote', 'new_car_quote' => 'Ghi chú yêu cầu thêm',
                default => 'Nội dung yêu cầu / Lời nhắn',
            };
            $message .= "\n💬 *{$msgLabel}:*\n_{$cleanMsg}_\n";
        }

        $message .= "\n🆔 *Mã phiên (ID):* `{$sessionId}`\n";
        $message .= "⏰ " . $this->formatTime() . "\n\n";
        $message .= "💡 _Vui lòng kiểm tra và xử lý liên hệ ngay để hỗ trợ khách hàng!_";

        try {
            $response = Http::timeout(10)->post(
                "{$this->baseUrl}/bot{$this->botToken}/sendMessage",
                [
                    'chat_id' => $this->chatId,
                    'text' => $message,
                    'parse_mode' => 'Markdown',
                    'disable_web_page_preview' => true,
                ]
            );

            if ($response->successful()) {
                Log::info('Telegram lead alert sent', ['session' => $sessionId]);
                return true;
            }

            Log::error('Telegram API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error('TelegramService exception', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function formatTime(): string
    {
        return now()->timezone('Asia/Ho_Chi_Minh')->format('H:i d/m/Y');
    }
}
