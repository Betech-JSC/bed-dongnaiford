<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusCategory;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusProductController extends Controller
{
    use ApiResponse;

    /**
     * Map product sang format chuẩn cho list view
     */
    private function formatList(LotusProduct $p): array
    {
        return [
            'id'           => $p->id,
            'category_id'  => $p->category_id,
            'title'        => $p->title,
            'slug'         => $p->slug,
            'image_url'    => $p->image_url,         // thumbnail URL
            'author'       => $p->author,
            'author_title' => $p->author_title,
            'author_avatar_url' => $p->author_avatar_url,
            'price'        => $p->price,
            'price_sale'   => $p->price_sale,
        ];
    }

    /**
     * GET /api/lotus/courses?category=khoa-hoc
     */
    public function index(Request $request): JsonResponse
    {
        $query = LotusProduct::query()
            ->where('status', LotusProduct::STATUS_ACTIVE)
            ->sortByPosition();

        if ($categorySlug = $request->query('category')) {
            $category = LotusCategory::whereSlug($categorySlug)
                ->where('status', LotusCategory::STATUS_ACTIVE)
                ->first();

            if (!$category) {
                return $this->success([]);
            }

            $query->where('category_id', $category->id);
        }

        $products = $query
            ->get(['id', 'category_id', 'title', 'slug', 'image', 'author', 'author_title', 'author_avatar', 'price', 'price_sale'])
            ->map(fn($p) => $this->formatList($p));

        return $this->success($products);
    }

    /**
     * GET /api/lotus/courses/featured
     */
    public function featured(): JsonResponse
    {
        $products = LotusProduct::query()
            ->where('status', LotusProduct::STATUS_ACTIVE)
            ->where('is_hot', true)
            ->sortByPosition()
            ->take(3)
            ->get(['id', 'category_id', 'title', 'slug', 'image', 'author', 'author_title', 'author_avatar', 'price', 'price_sale'])
            ->map(fn($p) => $this->formatList($p));

        return $this->success($products);
    }

    /**
     * GET /api/lotus/courses/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $product = LotusProduct::query()
            ->where('status', LotusProduct::STATUS_ACTIVE)
            ->whereSlug($slug)   // searches lotus_product_translations.slug (multilingual)
            ->with(['reviews' => fn($q) => $q->latest()->take(10)])
            ->first([
                'id', 'category_id',
                'image', 'banner_product', 'banner_detail',
                'author_avatar',
                'price',
                'price_sale',
            ]);

        if (!$product) {
            return $this->error(__('Không tìm thấy khoá học'), 404);
        }

        return $this->success([
            'id'                  => $product->id,
            'category_id'         => $product->category_id,
            'title'               => $product->title,
            'slug'                => $product->slug,
            'image_url'           => $product->image_url,
            'banner_product_url'  => $product->banner_product_url,
            'banner_detail_url'   => $product->banner_detail_url,
            'overview'            => $product->overview,
            'overview_courses'    => $product->overview_courses,
            'overview_future'     => $product->overview_future,
            'author'              => $product->author,
            'author_title'        => $product->author_title,
            'author_avatar_url'   => $product->author_avatar_url,
            'author_description'  => $product->author_description,
            'sections'            => collect($product->sections)->map(fn($s) => [
                'image_url' => isset($s['image']['path']) ? static_url($s['image']['path']) : ($s['image_url'] ?? null),
                'text'      => $s['text'] ?? '',
            ])->values()->all(),
            'price'               => $product->price,
            'price_sale'          => $product->price_sale,
            'reviews'             => $product->reviews,
        ]);
    }
}
