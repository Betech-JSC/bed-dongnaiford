<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Lotus\LotusCategory;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusCategoryController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/lotus/categories
     */
    public function index(): JsonResponse
    {
        $categories = LotusCategory::query()
            // 'title' và 'slug' là translatedAttributes → KHÔNG có trong lotus_categories
            // LotusCategory::$with = ['translations'] tự động eager load
            ->where('status', LotusCategory::STATUS_ACTIVE)
            ->sortByPosition()
            ->withCount(['products' => function ($query) {
                $query->where('status', 'ACTIVE');
            }])
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'title'          => $c->title,
                'slug'           => $c->slug,
                'icon'           => $c->icon,
                'image_url'      => $c->image_url, 
                'products_count' => $c->products_count,
            ]);

        return $this->success($categories);
    }
}
