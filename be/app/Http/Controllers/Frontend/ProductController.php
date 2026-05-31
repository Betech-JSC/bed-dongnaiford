<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Lotus\LotusBanner;
use App\Models\Lotus\LotusCategory;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusReview;

class ProductController extends Controller
{
    /**
     * Format product sang dạng chuẩn cho list view — nhất quán với LotusProductController::formatList()
     */
    private function formatProduct(LotusProduct $p): array
    {
        return [
            'id'                => $p->id,
            'category_id'       => $p->category_id,
            'title'             => $p->title,
            'slug'              => $p->slug,
            'image_url'         => $p->image_url,
            'author'            => $p->author,
            'author_title'      => $p->author_title,
            'author_avatar_url' => $p->author_avatar_url,
            'price'             => $p->price,
            'price_sale'        => $p->price_sale,
            'highlights'        => $p->highlights,
        ];
    }

    /**
     * GET /products — Trang Sản phẩm Lotus (khoá học, sách, ứng dụng)
     */
    public function index()
    {
        try {
            // Danh mục Lotus cho sidebar
            $categories = LotusCategory::where('status', LotusCategory::STATUS_ACTIVE)
                ->sortByPosition()
                ->get()
                ->map(fn($cat) => [
                    'key'       => $cat->getTranslation(app()->getLocale())?->slug ?? $cat->slug,
                    'label'     => mb_strtoupper($cat->getTranslation(app()->getLocale())?->title ?? $cat->title, 'UTF-8'),
                    'id'        => $cat->id,
                    'image_url' => $cat->image_url,
                ]);

            // Khoá học
            $courseCat = LotusCategory::whereSlug(LotusCategory::SLUG_COURSES)
                ->where('status', LotusCategory::STATUS_ACTIVE)
                ->first();

            // Sách
            $bookCat = LotusCategory::whereSlug(LotusCategory::SLUG_BOOKS)
                ->where('status', LotusCategory::STATUS_ACTIVE)
                ->first();

            // Ứng dụng iLotus
            $appCat = LotusCategory::whereSlug(LotusCategory::SLUG_APPS)
                ->where('status', LotusCategory::STATUS_ACTIVE)
                ->first();

            // Helper: lấy products theo category
            $getProducts = fn($cat) => $cat
                ? LotusProduct::where('status', LotusProduct::STATUS_ACTIVE)
                    ->where('category_id', $cat->id)
                    ->with('translations')
                    ->sortByPosition()
                    ->get()
                    ->map(fn($p) => $this->formatProduct($p))
                    ->values()
                    ->all()
                : [];

            $data = [
                'categories' => $categories,
                'courses'    => $courseCat ? [
                    'title'    => $courseCat->getTranslation(app()->getLocale())?->title ?? $courseCat->title,
                    'slug'     => $courseCat->getTranslation(app()->getLocale())?->slug ?? $courseCat->slug ?? 'khoa-hoc',
                    'products' => $getProducts($courseCat),
                ] : null,
                'books'      => $bookCat ? [
                    'title'    => $bookCat->getTranslation(app()->getLocale())?->title ?? $bookCat->title,
                    'slug'     => $bookCat->getTranslation(app()->getLocale())?->slug ?? $bookCat->slug ?? 'sach',
                    'products' => $getProducts($bookCat),
                ] : null,
                'apps'       => $appCat ? [
                    'title'    => $appCat->getTranslation(app()->getLocale())?->title ?? $appCat->title,
                    'slug'     => $appCat->getTranslation(app()->getLocale())?->slug ?? $appCat->slug ?? 'ung-dung-giao-dich',
                    'products' => $getProducts($appCat),
                ] : null,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Products/Index', $data);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    /**
     * GET /products/{slug} — Trang chi tiết khoá học / sản phẩm Lotus
     */
    public function show($slug)
    {
        try {
            $product = LotusProduct::query()
                ->where('status', LotusProduct::STATUS_ACTIVE)
                ->with('translations')
                ->whereHas('translations', fn($q) => $q->where('slug', $slug))
                ->first();

            if (!$product) {
                abort(404);
            }

            // Reviews: ưu tiên review_ids nếu admin đã chọn, fallback về product_id
            $reviewQuery = LotusReview::query()
                ->with('translations')
                ->where('status', LotusReview::STATUS_ACTIVE)
                ->sortByPosition();

            if (!empty($product->review_ids)) {
                $reviewQuery->whereIn('id', $product->review_ids);
            } else {
                $reviewQuery->where('product_id', $product->id);
            }

            $reviews = $reviewQuery->get()
                ->map(fn($r) => $r->transform());

            $data = [
                'product' => [
                    'id'                  => $product->id,
                    'category_id'         => $product->category_id,
                    'title'               => $product->title,
                    'slug'                => $product->slug,
                    'image_url'           => $product->image_url,
                    'banner_detail_url'   => $product->banner_detail_url,
                    'overview'            => $product->overview,
                    'overview_courses'    => $product->overview_courses,
                    'overview_future'     => $product->overview_future,
                    'author'              => $product->author,
                    'author_title'        => $product->author_title,
                    'author_avatar_url'   => $product->author_avatar_url,
                    'author_description'  => $product->author_description,
                    'sections'            => collect($product->getTranslation('vi')?->sections ?? [])->map(function($defaultSec, $index) use ($product) {
                        $s = $product->sections[$index] ?? null;
                        
                        $image_url = null;
                        if (!empty($s['image']['path'])) {
                            $image_url = static_url($s['image']['path']);
                        } elseif (!empty($s['image_url'])) {
                            $image_url = $s['image_url'];
                        } elseif (!empty($defaultSec['image']['path'])) {
                            $image_url = static_url($defaultSec['image']['path']);
                        } elseif (!empty($defaultSec['image_url'])) {
                            $image_url = $defaultSec['image_url'];
                        }

                        return [
                            'image_url' => $image_url,
                            'text'      => !empty($s['text']) ? $s['text'] : ($defaultSec['text'] ?? ''),
                        ];
                    })->values()->all(),
                    'sections_title'      => $product->sections_title,
                    'price'               => $product->price,
                    'price_sale'          => $product->price_sale,
                    'highlights'          => $product->highlights,
                ],
                'reviews' => $reviews,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Products/Show', $data);
        } catch (\Throwable $th) {
            \Log::error('ProductController@show: ' . $th->getMessage(), ['slug' => $slug]);
            abort(500);
        }
    }

    /**
     * GET /product-categories/{slug} — Trang danh mục sản phẩm Lotus
     */
    public function categories($slug)
    {
        try {
            // Banner trang danh mục sản phẩm:
            // ưu tiên vị trí mới "products", fallback "courses" để tương thích dữ liệu cũ.
            $banner = LotusBanner::query()
                ->where('status', LotusBanner::STATUS_ACTIVE)
                ->sortByPosition()
                ->whereJsonContains('location', LotusBanner::LOCATION_PRODUCTS)
                ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);

            if (!$banner) {
                $banner = LotusBanner::query()
                    ->where('status', LotusBanner::STATUS_ACTIVE)
                    ->sortByPosition()
                    ->whereJsonContains('location', LotusBanner::LOCATION_COURSES)
                    ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);
            }

            $banner = $banner ? [
                'id'               => $banner->id,
                'title'            => $banner->title,
                'subtitle'         => $banner->subtitle,
                'image_url'        => $banner->image_url,
                'image_mobile_url' => $banner->image_mobile_url,
                'video_url'        => $banner->video_url,
                'button_text'      => $banner->button_text,
                'button_link'      => $banner->button_link,
                'location'         => $banner->location ?? [],
            ] : null;

            $categories = LotusCategory::where('status', LotusCategory::STATUS_ACTIVE)
                ->sortByPosition()
                ->get()
                ->map(fn($cat) => [
                    'key'       => $cat->getTranslation(app()->getLocale())->slug ?? $cat->slug,
                    'label'     => mb_strtoupper($cat->getTranslation(app()->getLocale())->title ?? $cat->title, 'UTF-8'),
                    'id'        => $cat->id,
                    'image_url' => $cat->image_url,
                ]);

            $category = LotusCategory::where('status', LotusCategory::STATUS_ACTIVE)
                ->whereSlug($slug)
                ->first();

            $products = [];

            if ($category) {
                $products = LotusProduct::where('status', LotusProduct::STATUS_ACTIVE)
                    ->where('category_id', $category->id)
                    ->with('translations')
                    ->sortByPosition()
                    ->get()
                    ->map(fn($p) => $this->formatProduct($p))
                    ->values()
                    ->all();
            }

            $data = [
                'banner'       => $banner,
                'category'     => $category ? [
                    'id'        => $category->id,
                    'title'     => $category->title,
                    'slug'      => $category->slug,
                    'image_url' => $category->image_url,
                ] : null,
                'categorySlug' => $slug,
                'categories'   => $categories,
                'products'     => $products,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Products/Category', $data);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
