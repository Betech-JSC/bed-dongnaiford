<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash');
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    /**
     * Gửi message tới Gemini API và nhận response
     */
    public function chat(string $userMessage, array $conversationHistory = []): array
    {
        if (empty($this->apiKey)) {
            return [
                'reply' => 'Xin lỗi, hệ thống trợ lý AI đang được cấu hình. Vui lòng liên hệ Hotline 0918 90 90 60 để được tư vấn trực tiếp.',
                'lead_data' => null,
            ];
        }

        try {
            $systemPrompt = $this->getSystemPrompt();

            $contents = [];

            // Add conversation history
            foreach ($conversationHistory as $msg) {
                $contents[] = $msg;
            }

            // Add current user message
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $userMessage]],
            ];

            $response = Http::timeout(30)->post(
                "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                [
                    'system_instruction' => [
                        'parts' => [['text' => $systemPrompt]],
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 1024,
                        'topP' => 0.9,
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [
                    'reply' => 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể gọi trực tiếp Hotline 0918 90 90 60 để được hỗ trợ nhanh nhất!',
                    'lead_data' => null,
                ];
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Extract lead data from response (nếu bot phát hiện)
            $leadData = $this->extractLeadData($text, $userMessage);

            // Clean response (remove any JSON/metadata bot might have added)
            $cleanReply = $this->cleanResponse($text);

            return [
                'reply' => $cleanReply,
                'lead_data' => $leadData,
            ];
        } catch (\Throwable $e) {
            Log::error('GeminiService exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'reply' => 'Xin lỗi, tôi đang gặp sự cố. Bạn vui lòng gọi Hotline 0918 90 90 60 hoặc chat qua Zalo để được hỗ trợ nhé!',
                'lead_data' => null,
            ];
        }
    }

    /**
     * System Prompt chuyên biệt cho Ford Đồng Nai
     */
    private function getSystemPrompt(): string
    {
        return <<<'PROMPT'
Bạn là Trợ lý AI tư vấn của **Ford Đồng Nai** (Đại lý Tấn Phát Đạt) — đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai.

## THÔNG TIN SHOWROOM
- Địa chỉ: Số B04, Khu thương mại Amata, Khu phố 29, Phường Long Bình, TP. Biên Hòa, Đồng Nai
- Hotline kinh doanh: 0918 90 90 60
- Hotline dịch vụ: 1800 55 68 58
- ĐT: (0251) 3857 130 – (0251) 3857 131
- Email: marketing@dongnaiford.com.vn
- Giờ làm việc: T2–T7, 7:30–17:30
- Website: dongnaiford.com.vn

## BẢNG GIÁ XE FORD (Giá niêm yết VNĐ, chưa bao gồm phí lăn bánh)

### NEW TERRITORY (SUV 5 Chỗ)
- Territory Titanium X 1.5L AT: 954.000.000đ
- Territory Titanium 1.5L AT: 899.000.000đ
- Territory Trend 1.5L AT: 822.000.000đ
- Territory Ambiente 1.5L AT: 739.000.000đ

### FORD EVEREST (SUV 7 Chỗ)
- Everest Titanium+ 2.0L Bi-Turbo 4x4: 1.545.000.000đ
- Everest Titanium 2.0L Turbo 4x2: 1.300.000.000đ
- Everest Sport 2.0L Turbo 4x2: 1.099.000.000đ
- Everest Ambiente 2.0L Turbo 4x2: 1.009.000.000đ

### FORD MUSTANG MACH-E (SUV Điện)
- Mustang Mach-E Premium AWD: 1.995.000.000đ

### NEW RANGER (Bán tải)
- Ranger Wildtrak 2.0L Bi-Turbo 4x4: 979.000.000đ
- Ranger XLS 2.0L AT 4x2: 659.000.000đ
- Ranger XL 2.0L MT 4x2: 559.000.000đ

### FORD TRANSIT (Xe thương mại 16 chỗ)
- Transit SVP Luxury: 1.080.000.000đ
- Transit Luxury: 970.000.000đ
- Transit Mid: 890.000.000đ
- Transit Tiêu chuẩn: 845.000.000đ

### FORD RAPTOR (Bán tải hiệu năng cao)
- Raptor 2.0L Bi-Turbo 4x4: 1.299.000.000đ

## DỊCH VỤ
- Bảo dưỡng nhanh 60 phút
- Bảo dưỡng định kỳ theo km
- Nhận & Giao xe tận nơi (miễn phí trong 50km)
- Phụ kiện & phụ tùng chính hãng
- Hỗ trợ trả góp lên đến 80% giá trị xe, lãi suất ưu đãi

## CHÍNH SÁCH
- Bảo hành chính hãng 3 năm hoặc 100.000km
- Cứu hộ 24/7: 1800 55 68 58
- Hỗ trợ đăng ký, đăng kiểm, bảo hiểm trọn gói

## QUY TẮC TƯ VẤN
1. Luôn trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp
2. Trả lời ngắn gọn (2-4 câu), dễ hiểu, đúng trọng tâm
3. Khi khách hỏi giá → Cung cấp giá niêm yết + gợi ý liên hệ Hotline để nhận ưu đãi tốt nhất
4. Khi khách có dấu hiệu muốn mua (hỏi giá cụ thể, lái thử, trả góp, giao xe) → Hỏi lịch sự: "Anh/chị cho em xin Họ tên và Số điện thoại để đội ngũ tư vấn viên liên hệ hỗ trợ chi tiết nhé!"
5. KHÔNG bịa thông tin không có trong dữ liệu trên
6. Nếu không biết → Gợi ý liên hệ Hotline 0918 90 90 60

## NHẬN DIỆN LEAD
Khi khách cung cấp thông tin liên hệ (tên, SĐT), hãy thêm dòng ẩn cuối response:
[LEAD_DATA]{"name":"Tên khách","phone":"SĐT","vehicle":"Xe quan tâm","score":"hot|warm|cold"}[/LEAD_DATA]

Phân loại:
- HOT: Đã cho SĐT + muốn lái thử/mua/trả góp/báo giá
- WARM: Hỏi giá cụ thể nhiều lần, so sánh chi tiết nhưng chưa cho SĐT
- COLD: Chỉ hỏi han chung chung
PROMPT;
    }

    /**
     * Trích xuất lead data từ response của AI
     */
    private function extractLeadData(string $response, string $userMessage): ?array
    {
        // Check for embedded lead data tag
        if (preg_match('/\[LEAD_DATA\](.*?)\[\/LEAD_DATA\]/s', $response, $matches)) {
            $json = json_decode($matches[1], true);
            if ($json && isset($json['score'])) {
                return $json;
            }
        }

        // Fallback: detect phone numbers in user message
        if (preg_match('/(?:0\d{9,10}|\+84\d{9,10})/', $userMessage, $phoneMatch)) {
            return [
                'phone' => $phoneMatch[0],
                'score' => 'warm',
            ];
        }

        return null;
    }

    /**
     * Xóa metadata/tags ẩn khỏi response trước khi gửi cho user
     */
    private function cleanResponse(string $text): string
    {
        // Remove LEAD_DATA tags
        $text = preg_replace('/\[LEAD_DATA\].*?\[\/LEAD_DATA\]/s', '', $text);

        return trim($text);
    }
}
