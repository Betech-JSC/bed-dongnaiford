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
        $this->botToken = config('services.telegram.bot_token', '');
        $this->chatId = config('services.telegram.chat_id', '');
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

        $score = strtoupper($leadData['score'] ?? 'WARM');
        $scoreEmoji = match ($score) {
            'HOT' => '🔥🔥🔥',
            'WARM' => '🟠',
            default => '🔵',
        };

        $name = $leadData['name'] ?? 'Chưa rõ';
        $phone = $leadData['phone'] ?? 'Chưa có';
        $vehicle = $leadData['vehicle'] ?? 'Chưa xác định';

        $message = <<<MSG
{$scoreEmoji} *LEAD MỚI TỪ AI CHATBOT*

👤 *Khách hàng:* {$name}
📞 *SĐT:* `{$phone}`
🚗 *Xe quan tâm:* {$vehicle}
📊 *Mức độ:* {$score}
🆔 *Session:* `{$sessionId}`

⏰ {$this->formatTime()}

💡 _Vui lòng liên hệ khách hàng trong 15 phút để tối ưu tỉ lệ chuyển đổi!_
MSG;

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
