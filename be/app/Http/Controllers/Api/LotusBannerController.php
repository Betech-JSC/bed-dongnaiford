<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Lotus\LotusBanner;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusBannerController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/lotus/banners
     * GET /api/lotus/banners?location=homepage
     * Trả về danh sách banners active, có thể filter theo vị trí hiển thị
     */
    public function index(Request $request): JsonResponse
    {
        $query = LotusBanner::query()
            ->where('status', LotusBanner::STATUS_ACTIVE)
            ->sortByPosition();

        if ($location = $request->query('location')) {
            $query->whereJsonContains('location', $location);
        }

        $banners = $query->get(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'location', 'button_text', 'button_link'])
            ->map(function ($b) {
                return [
                    'id'               => $b->id,
                    'title'            => $b->title,
                    'subtitle'         => $b->subtitle,
                    'image_url'        => $b->image_url,        // URL desktop
                    'image_mobile_url' => $b->image_mobile_url, // URL mobile (null nếu không có)
                    'video_url'        => $b->video_url,        // URL video (null nếu không có)
                    'location'         => $b->location ?? [],
                    'button_text'      => $b->button_text,
                    'button_link'      => $b->button_link,
                ];
            });

        return $this->success($banners);
    }

}
