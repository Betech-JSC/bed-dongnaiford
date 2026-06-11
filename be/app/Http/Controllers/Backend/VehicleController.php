<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\CustomerReview;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleController extends Controller
{
    use HasCrudActions;

    public $model = Vehicle::class;

    public $with = [
        'form' => ['category', 'translations', 'versions', 'versions.translations'],
    ];

    /**
     * Admin list: load translations to display title by locale.
     */
    public function index()
    {
        try {
            $this->checkAuthorize();

            if (request()->wantsJson()) {
                return $this->table();
            }

            return Inertia::render($this->folder() . '/Index', [
                'breadcrumbs' => [
                    [
                        'url' => route($this->getResource() . '.index'),
                        'name' => 'models.table_list.' . $this->getTable(),
                    ]
                ],
                'schema' => $this->getSchema(),
                'data' => [
                    'categories' => VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
                        ->orderBy('sort_order')
                        ->get()
                        ->map(fn($cat) => ['id' => $cat->id, 'title' => $cat->title]),
                ]
            ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    private function beforeIndex($query)
    {
        return $query
            ->with(['translations', 'category'])
            ->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['categories'] = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($cat) => ['id' => $cat->id, 'title' => $cat->title]);

        // List reviews to select in form
        $data['reviews'] = CustomerReview::query()
            ->withoutGlobalScopes()
            ->with(['vehicle:id,category_id', 'translations'])
            ->where('status', CustomerReview::STATUS_ACTIVE)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'product_id'  => $r->vehicle_id,
                'category_id' => optional($r->vehicle)->category_id,
                'label'       => "#{$r->id} — {$r->customer_name} (" . str_repeat('★', $r->rating ?? 0) . ")",
            ]);

        return $data;
    }

    private function beforeStore(Request $request, array $rules): array
    {
        if ($request->has('image_thumbnail')) {
            $request->merge([
                'image' => $request->input('image_thumbnail')
            ]);
        }

        // List of all keys that must be validated as arrays
        $arrayKeys = [
            'images',
            'colors',
            'images_360_external',
            'images_360_internal',
            'image',
            'image_thumbnail',
            'image_featured',
            'versions',
            'layout_blocks',
        ];

        foreach ($arrayKeys as $key) {
            if ($request->has($key)) {
                $val = $request->input($key);
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $request->merge([$key => $decoded]);
                    } else {
                        $request->merge([$key => empty($val) ? [] : [$val]]);
                    }
                } elseif (is_null($val)) {
                    $request->merge([$key => []]);
                }
            }
        }

        // Sort 360 images by filename in natural ascending order
        if ($request->has('images_360_external')) {
            $request->merge([
                'images_360_external' => $this->sort360Images($request->input('images_360_external', []))
            ]);
        }
        if ($request->has('images_360_internal')) {
            $request->merge([
                'images_360_internal' => $this->sort360Images($request->input('images_360_internal', []))
            ]);
        }
        if ($request->has('colors')) {
            $colors = $request->input('colors', []);
            if (is_array($colors)) {
                foreach ($colors as $index => $color) {
                    if (isset($color['images_360']) && is_array($color['images_360'])) {
                        $colors[$index]['images_360'] = $this->sort360Images($color['images_360']);
                    }
                    if (isset($color['images_360_internal']) && is_array($color['images_360_internal'])) {
                        $colors[$index]['images_360_internal'] = $this->sort360Images($color['images_360_internal']);
                    }
                }
                $request->merge(['colors' => $colors]);
            }
        }

        return $rules;
    }

    private function afterStore($request, $resource)
    {
        DB::transaction(function () use ($request, $resource) {
            $versionsData = $request->input('versions', []);
            $keepIds = [];

            foreach ($versionsData as $index => $data) {
                $versionId = $data['id'] ?? null;

                $versionPayload = [
                    'price'      => $data['price'] ?? 0,
                    'status'     => $data['status'] ?? 'ACTIVE',
                    'sort_order' => $data['sort_order'] ?? ($index + 1),
                    'specs'      => $data['specs'] ?? null,
                    'image'      => $data['image'] ?? null,
                ];

                // Map translations for locales 'vi' and 'en'
                foreach (['vi', 'en'] as $locale) {
                    if (isset($data[$locale]) && is_array($data[$locale])) {
                        $versionPayload[$locale] = [
                            'name' => $data[$locale]['name'] ?? null,
                        ];
                    } elseif (isset($data['translations']) && is_array($data['translations'])) {
                        $translation = collect($data['translations'])->firstWhere('locale', $locale);
                        if ($translation) {
                            $versionPayload[$locale] = [
                                'name' => $translation['name'] ?? null,
                            ];
                        }
                    }
                }

                if ($versionId) {
                    $version = $resource->versions()->find($versionId);
                    if ($version) {
                        $version->update($versionPayload);
                        $keepIds[] = $version->id;
                    }
                } else {
                    $version = $resource->versions()->create($versionPayload);
                    $keepIds[] = $version->id;
                }
            }

            $resource->versions()->whereNotIn('id', $keepIds)->delete();
        });
    }

    private function sort360Images(array $images): array
    {
        usort($images, function ($a, $b) {
            $pathA = is_array($a) ? ($a['path'] ?? '') : (string) $a;
            $pathB = is_array($b) ? ($b['path'] ?? '') : (string) $b;

            $fileA = basename($pathA);
            $fileB = basename($pathB);

            return strnatcasecmp($fileA, $fileB);
        });
        return $images;
    }
}
