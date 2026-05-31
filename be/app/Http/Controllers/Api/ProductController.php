<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Core\Traits\ApiResponse;
use JamstackVietnam\Rating\Models\Rating;
use App\Models\Product\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        if (request()->has('products')) {
            $products = request()->input('products');
            $items = Product::query()
                ->active()
                ->filter(['products' => $products])
                ->get()
                ->map(fn($item) => $item->transform());

            return $this->success($items);
        }

        return $this->empty();
    }

    public function rating($productId): JsonResponse
    {
        $items = Rating::query()
            ->active()
            ->where('product_id', $productId)
            ->orderBy('id', 'desc')
            ->paginate(5)
            ->onEachSide(0)
            ->through(function ($item) {
                return $item->transform();
            })->withQueryString();

        return $this->success($items);
    }

    public function instantSearch($keyword): JsonResponse
    {
        $products = Product::query()
            ->active()
            ->searchSlug(Str::slug($keyword))
            ->take(10)
            ->get()
            ->map(fn($item) => $item->transform());

        $data = [
            'products' => $products,
            'keyword' => $keyword
        ];

        return $this->success($data);
    }

    public function flashSale(): JsonResponse
    {
        $products = Product::query()
            ->whereFlashSale()
            ->take(20)
            ->get()
            ->map(fn($item) => $item->transform());

        $data = [
            'products' => $products
        ];

        return $this->success($data);
    }
}
