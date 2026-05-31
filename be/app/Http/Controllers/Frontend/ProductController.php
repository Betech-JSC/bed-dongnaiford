<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Vehicle\Banner;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\CustomerReview;

class ProductController extends Controller
{
    /**
     * Format product/vehicle to standard format
     */
    private function formatProduct(Vehicle $p): array
    {
        return [
            'id'                => $p->id,
            'category_id'       => $p->category_id,
            'title'             => $p->title,
            'slug'              => $p->slug,
            'image_url'         => $p->image_url,
            'author'            => $p->tagline ?? 'FORD DNF',
            'author_title'      => '',
            'author_avatar_url' => '',
            'price'             => $p->base_price,
            'price_sale'        => 0,
            'highlights'        => [],
        ];
    }

    /**
     * GET /products — Trang xe Ford
     */
    public function index()
    {
        try {
            // Danh mục xe cho sidebar
            $categoriesList = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
                ->sortByPosition()
                ->get();

            $categories = $categoriesList->map(fn($cat) => [
                'key'       => $cat->slug,
                'label'     => mb_strtoupper($cat->title, 'UTF-8'),
                'id'        => $cat->id,
                'image_url' => isset($cat->image['path']) ? static_url($cat->image['path']) : null,
            ]);

            // Map categories to courses/books/apps props for retro-compatibility with original templates
            $courseCat = $categoriesList->get(0);
            $bookCat = $categoriesList->get(1);
            $appCat = $categoriesList->get(2);

            // Helper: lấy vehicles theo category
            $getProducts = fn($cat) => $cat
                ? Vehicle::where('status', Vehicle::STATUS_ACTIVE)
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
                    'title'    => $courseCat->title,
                    'slug'     => $courseCat->slug,
                    'products' => $getProducts($courseCat),
                ] : [
                    'title'    => 'SUV',
                    'slug'     => 'suv',
                    'products' => [],
                ],
                'books'      => $bookCat ? [
                    'title'    => $bookCat->title,
                    'slug'     => $bookCat->slug,
                    'products' => $getProducts($bookCat),
                ] : [
                    'title'    => 'Bán tải',
                    'slug'     => 'ban-tai',
                    'products' => [],
                ],
                'apps'       => $appCat ? [
                    'title'    => $appCat->title,
                    'slug'     => $appCat->slug,
                    'products' => $getProducts($appCat),
                ] : [
                    'title'    => 'Thương mại',
                    'slug'     => 'thuong-mai',
                    'products' => [],
                ],
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
     * GET /products/{slug} — Trang chi tiết xe Ford DNF
     */
    public function show($slug)
    {
        try {
            $product = Vehicle::query()
                ->where('status', Vehicle::STATUS_ACTIVE)
                ->with(['translations', 'versions'])
                ->whereHas('translations', fn($q) => $q->where('slug', $slug))
                ->first();

            if (!$product) {
                abort(404);
            }

            // Reviews: load customer reviews for this vehicle
            $reviews = CustomerReview::query()
                ->with('translations')
                ->where('status', CustomerReview::STATUS_ACTIVE)
                ->where('vehicle_id', $product->id)
                ->sortByPosition()
                ->get()
                ->map(fn($r) => $r->transform());

            // Build specifications and detail texts to display in tabs
            $overviewHtml = '<p>' . e($product->description) . '</p>';
            $specsHtml = '<table class="table-auto w-full text-left mt-4 border-collapse">';
            $specsHtml .= '<thead><tr class="border-b border-gray-700"><th class="pb-2 font-bold text-yellow-500">Phiên bản</th><th class="pb-2 font-bold text-yellow-500">Giá bán</th></tr></thead>';
            $specsHtml .= '<tbody>';
            foreach ($product->versions as $v) {
                $formattedPrice = number_format($v->price) . ' VND';
                $specsHtml .= "<tr class='border-b border-gray-800'><td class='py-2 font-semibold'>{$v->name}</td><td class='py-2'>{$formattedPrice}</td></tr>";
            }
            $specsHtml .= '</tbody></table>';

            $colorsHtml = '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">';
            foreach ($product->colors ?? [] as $color) {
                $colorsHtml .= "<div class='flex items-center gap-2'><span class='inline-block w-6 h-6 rounded-full border border-white' style='background-color: {$color['hex']};'></span><span>{$color['name']}</span></div>";
            }
            $colorsHtml .= '</div>';

            // Build sections slider from colors
            $sections = collect($product->colors ?? [])->map(fn($color) => [
                'image_url' => isset($color['image_path']) ? static_url($color['image_path']) : null,
                'text'      => $color['name'] ?? '',
            ])->values()->all();

            $data = [
                'product' => [
                    'id'                  => $product->id,
                    'category_id'         => $product->category_id,
                    'title'               => $product->title,
                    'slug'                => $product->slug,
                    'image_url'           => $product->image_url,
                    'banner_detail_url'   => $product->image_url,
                    'overview'            => $overviewHtml,
                    'overview_courses'    => $specsHtml,
                    'overview_future'     => $colorsHtml,
                    'author'              => 'ĐẠI LÝ FORD ĐỒNG NAI',
                    'author_title'        => 'Đồng Nai Ford',
                    'author_avatar_url'   => '/assets/logo.png',
                    'author_description'  => $product->tagline ?? 'Đồng hành cùng bạn trên mọi nẻo đường.',
                    'sections'            => $sections,
                    'sections_title'      => 'Hình ảnh màu sắc xe thực tế',
                    'price'               => $product->base_price,
                    'price_sale'          => 0,
                    'highlights'          => [],
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
     * GET /product-categories/{slug} — Trang danh mục xe Ford DNF
     */
    public function categories($slug)
    {
        try {
            // Banner trang danh mục
            $banner = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->sortByPosition()
                ->whereJsonContains('location', Banner::LOCATION_PRODUCTS)
                ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);

            if (!$banner) {
                $banner = Banner::query()
                    ->where('status', Banner::STATUS_ACTIVE)
                    ->sortByPosition()
                    ->whereJsonContains('location', Banner::LOCATION_COURSES)
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

            $categoriesList = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
                ->sortByPosition()
                ->get();

            $categories = $categoriesList->map(fn($cat) => [
                'key'       => $cat->slug,
                'label'     => mb_strtoupper($cat->title, 'UTF-8'),
                'id'        => $cat->id,
                'image_url' => isset($cat->image['path']) ? static_url($cat->image['path']) : null,
            ]);

            $category = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
                ->whereSlug($slug)
                ->first();

            $products = [];

            if ($category) {
                $products = Vehicle::where('status', Vehicle::STATUS_ACTIVE)
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
                    'image_url' => isset($category->image['path']) ? static_url($category->image['path']) : null,
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
