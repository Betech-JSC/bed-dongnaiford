<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Lotus\LotusReview;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusReviewController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/lotus/reviews
     * GET /api/lotus/reviews?product_id=1
     * Trả về danh sách reviews active, đã dịch theo locale hiện tại
     */
    public function index(Request $request): JsonResponse
    {
        $query = LotusReview::query()
            ->where('status', LotusReview::STATUS_ACTIVE)
            ->sortByPosition();

        if ($productId = $request->query('product_id')) {
            $query->where('product_id', $productId);
        }

        $reviews = $query->get()->map(fn($r) => $r->transform());

        return $this->success($reviews);
    }
}
