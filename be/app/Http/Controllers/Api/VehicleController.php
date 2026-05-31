<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use JamstackVietnam\Core\Traits\ApiResponse;

class VehicleController extends Controller
{
    use ApiResponse;

    /**
     * Map vehicle to standard format
     */
    private function formatList(Vehicle $v): array
    {
        return [
            'id'             => $v->id,
            'category_id'    => $v->category_id,
            'title'          => $v->title,
            'slug'           => $v->slug,
            'tagline'        => $v->tagline,
            'image_url'      => $v->image_url,
            'type'           => $v->type,
            'base_price'     => $v->base_price,
            'is_best_seller' => $v->is_best_seller,
            'sort_order'     => $v->sort_order,
        ];
    }

    /**
     * GET /api/vehicles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::query()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->sortByPosition();

        if ($categorySlug = $request->query('category')) {
            $category = VehicleCategory::whereSlug($categorySlug)
                ->where('status', VehicleCategory::STATUS_ACTIVE)
                ->first();

            if (!$category) {
                return $this->success([]);
            }

            $query->where('category_id', $category->id);
        }

        $vehicles = $query->get()
            ->map(fn($v) => $this->formatList($v));

        return $this->success($vehicles);
    }

    /**
     * GET /api/vehicles/featured
     */
    public function featured(): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->where('is_best_seller', true)
            ->sortByPosition()
            ->get()
            ->map(fn($v) => $this->formatList($v));

        return $this->success($vehicles);
    }

    /**
     * GET /api/vehicles/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $vehicle = Vehicle::query()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->whereSlug($slug)
            ->with(['versions' => fn($q) => $q->where('status', 'ACTIVE')->sortByPosition()])
            ->first();

        if (!$vehicle) {
            return $this->error(__('Không tìm thấy xe'), 404);
        }

        return $this->success([
            'id'                     => $vehicle->id,
            'category_id'            => $vehicle->category_id,
            'title'                  => $vehicle->title,
            'slug'                   => $vehicle->slug,
            'tagline'                => $vehicle->tagline,
            'description'            => $vehicle->description,
            'image_url'              => $vehicle->image_url,
            'images'                 => collect($vehicle->images)->map(fn($img) => isset($img['path']) ? static_url($img['path']) : $img),
            'colors'                 => collect($vehicle->colors)->map(fn($color) => [
                'name'       => $color['name'] ?? '',
                'hex'        => $color['hex'] ?? '',
                'image_path' => isset($color['image_path']) ? static_url($color['image_path']) : null,
            ]),
            'images_360_external'    => collect($vehicle->images_360_external)->map(fn($img) => isset($img['path']) ? static_url($img['path']) : $img),
            'image_360_internal_url' => $vehicle->image_360_internal_url,
            'type'                   => $vehicle->type,
            'base_price'             => $vehicle->base_price,
            'versions'               => $vehicle->versions->map(fn($v) => [
                'id'         => $v->id,
                'name'       => $v->name,
                'price'      => $v->price,
                'specs'      => $v->specs ?? [],
                'sort_order' => $v->sort_order,
            ]),
        ]);
    }
}
