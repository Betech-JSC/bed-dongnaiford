<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\CustomerReview;
use App\Models\Vehicle\Accessory;
use App\Exports\VehicleExport;
use App\Imports\VehicleImport;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleController extends Controller
{
    use HasCrudActions;

    public $model = Vehicle::class;

    public function export()
    {
        $this->checkAuthorize();
        return (new VehicleExport)->download();
    }

    public function exportTemplate()
    {
        $this->checkAuthorize();
        return (new VehicleExport)->downloadTemplate();
    }

    public function import(Request $request)
    {
        $this->checkAuthorize();

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');
        $importer = new VehicleImport();
        $result = $importer->import($file->getPathname());

        if (request()->wantsJson()) {
            return response()->json($result);
        }

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message'] ?? 'Import thất bại!');
    }

    private $originalVehicleTitle = null;

    public $with = [
        'form' => ['categories', 'translations', 'versions', 'versions.translations'],
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
            ->with(['translations', 'categories'])
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
            ->with(['vehicle:id', 'vehicle.categories', 'translations'])
            ->where('status', CustomerReview::STATUS_ACTIVE)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'product_id'  => $r->vehicle_id,
                'category_id' => optional($r->vehicle)->category_id,
                'label'       => "#{$r->id} — {$r->customer_name} (" . str_repeat('★', $r->rating ?? 0) . ")",
            ]);

        // Load all active accessories for selection in the form
        $data['accessories'] = Accessory::query()
            ->where('status', Accessory::STATUS_ACTIVE)
            ->with(['translations', 'categories'])
            ->orderBy('sort_order')
            ->get()
            ->map(fn($acc) => [
                'id'           => $acc->id,
                'title'        => $acc->title,
                'code'         => $acc->code,
                'category'     => $acc->category,
                'fit_vehicles' => $acc->fit_vehicles ?? [],
                'image'        => $acc->image,
            ]);

        $data['accessory_categories'] = \App\Models\Vehicle\AccessoryCategory::where('status', 'ACTIVE')
            ->sortByPosition()
            ->get()
            ->map(fn($cat) => ['id' => $cat->id, 'title' => $cat->title]);

        $data['brands'] = \App\Models\Brand\Brand::where('status', 'ACTIVE')
            ->sortByPosition()
            ->get()
            ->map(fn($b) => ['id' => $b->id, 'title' => $b->title]);

        $data['all_vehicles'] = Vehicle::query()
            ->with(['translations', 'accessories'])
            ->orderBy('sort_order')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'title' => $v->translate('vi')->title ?? $v->title ?? "Xe #{$v->id}",
                'layout_blocks' => $v->layout_blocks,
                'accessories' => $v->accessories()->pluck('accessories.id')->toArray(),
            ]);

        return $data;
    }

    private function afterForm($item)
    {
        $selectedAccessoryIds = [];
        if (is_object($item) && $item->id) {
            $selectedAccessoryIds = $item->accessories()->pluck('accessories.id')->toArray();
        }

        if (is_object($item)) {
            $item->accessories = $selectedAccessoryIds;
        } elseif (is_array($item)) {
            $item['accessories'] = $selectedAccessoryIds;
        }

        return $item;
    }

    private function beforeStore(Request $request, array $rules): array
    {
        // Get the original title before updating
        $id = request()->route('id') ?? request()->input('id');
        if ($id) {
            $vehicle = Vehicle::find($id);
            if ($vehicle) {
                $this->originalVehicleTitle = $vehicle->translate('vi')->title ?? $vehicle->title;
            }
        }

        if ($request->has('image_thumbnail')) {
            $request->merge([
                'image' => $request->input('image_thumbnail')
            ]);
        }

        // List of all keys that must be validated as arrays
        $arrayKeys = [
            'category_ids',
            'images',
            'colors',
            'images_360_external',
            'images_360_internal',
            'image',
            'image_thumbnail',
            'image_featured',
            'video',
            'versions',
            'layout_blocks',
            'accessories',
            'brochure_file',
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

        if ($request->has('versions')) {
            $versions = $request->input('versions', []);
            if (is_array($versions)) {
                foreach ($versions as $vIdx => $ver) {
                    if (isset($ver['colors']) && is_array($ver['colors'])) {
                        foreach ($ver['colors'] as $cIdx => $color) {
                            if (isset($color['images_360']) && is_array($color['images_360'])) {
                                $versions[$vIdx]['colors'][$cIdx]['images_360'] = $this->sort360Images($color['images_360']);
                            }
                            if (isset($color['images_360_internal']) && is_array($color['images_360_internal'])) {
                                $versions[$vIdx]['colors'][$cIdx]['images_360_internal'] = $this->sort360Images($color['images_360_internal']);
                            }
                        }
                    }
                }
                $request->merge(['versions' => $versions]);
            }
        }

        return $rules;
    }

    private function afterStore($request, $resource)
    {
        DB::transaction(function () use ($request, $resource) {
            // Sync categories
            $categoryIds = $request->input('category_ids', []);
            if (is_array($categoryIds)) {
                $cleanCategoryIds = collect($categoryIds)
                    ->map(function ($item) {
                        if (is_array($item)) {
                            return $item['id'] ?? null;
                        }
                        if (is_object($item)) {
                            return $item->id ?? null;
                        }
                        return is_numeric($item) ? (int) $item : null;
                    })
                    ->filter(fn($id) => !is_null($id) && $id > 0)
                    ->values()
                    ->toArray();

                $resource->categories()->sync($cleanCategoryIds);
            }

            $versionsData = $request->input('versions', []);
            $keepIds = [];

            foreach ($versionsData as $index => $data) {
                $versionId = $data['id'] ?? null;

                $versionPayload = [
                    'price'           => $data['price'] ?? 0,
                    'status'          => $data['status'] ?? 'ACTIVE',
                    'sort_order'      => $data['sort_order'] ?? ($index + 1),
                    'specs'           => $data['specs'] ?? null,
                    'image'           => $data['image'] ?? null,
                    'image_thumbnail' => $data['image_thumbnail'] ?? null,
                    'colors'          => $data['colors'] ?? null,
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

            // Sync accessories Many-to-Many
            $selectedIds = $request->input('accessories', []);
            if (is_array($selectedIds)) {
                $cleanAccessoryIds = collect($selectedIds)
                    ->map(function ($item) {
                        if (is_array($item)) {
                            return $item['id'] ?? null;
                        }
                        if (is_object($item)) {
                            return $item->id ?? null;
                        }
                        return is_numeric($item) ? (int) $item : null;
                    })
                    ->filter(fn($id) => !is_null($id) && $id > 0)
                    ->values()
                    ->toArray();

                $resource->accessories()->sync($cleanAccessoryIds);
            }
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

    public function listSimple(Request $request)
    {
        $this->checkAuthorize();
        $vehicles = Vehicle::with('translations')
            ->orderBy('sort_order')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'title' => $v->translate('vi')->title ?? $v->title ?? "Xe #{$v->id}",
                'layout_blocks' => $v->layout_blocks,
                'accessories' => $v->accessories()->pluck('accessories.id')->toArray(),
            ]);

        return response()->json([
            'success' => true,
            'data' => $vehicles
        ]);
    }

    public function copyData(Request $request)
    {
        $this->checkAuthorize();

        $request->validate([
            'source_vehicle_id'    => 'required|exists:vehicles,id',
            'target_vehicle_ids'   => 'required|array|min:1',
            'target_vehicle_ids.*' => 'exists:vehicles,id',
            'copy_features'        => 'nullable|boolean',
            'copy_accessories'     => 'nullable|boolean',
            'mode'                 => 'nullable|string|in:replace,append',
        ]);

        $sourceVehicleId  = (int) $request->input('source_vehicle_id');
        $targetVehicleIds = array_map('intval', $request->input('target_vehicle_ids', []));
        $copyFeatures     = $request->boolean('copy_features', true);
        $copyAccessories  = $request->boolean('copy_accessories', true);
        $mode             = $request->input('mode', 'append');

        $sourceVehicle = Vehicle::with(['accessories'])->find($sourceVehicleId);
        if (!$sourceVehicle) {
            return response()->json(['success' => false, 'message' => 'Xe nguồn không tồn tại'], 404);
        }

        // Extract source features
        $sourceBlocks = $sourceVehicle->layout_blocks ?? [];
        $sourceFeaturesBlock = collect($sourceBlocks)->firstWhere('type', 'FeaturesList');
        $sourceFeatures = $sourceFeaturesBlock['data']['features'] ?? [];
        $sourceCategories = $sourceFeaturesBlock['data']['categories'] ?? ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];

        // Extract source accessory IDs
        $sourceAccessoryIds = $sourceVehicle->accessories()->pluck('accessories.id')->toArray();

        $updatedCount = 0;

        DB::transaction(function () use ($targetVehicleIds, $copyFeatures, $copyAccessories, $mode, $sourceFeatures, $sourceCategories, $sourceAccessoryIds, &$updatedCount) {
            foreach ($targetVehicleIds as $targetId) {
                $targetVehicle = Vehicle::find($targetId);
                if (!$targetVehicle) continue;

                // 1. Handle Copy Features
                if ($copyFeatures) {
                    $targetBlocks = $targetVehicle->layout_blocks ?? [];
                    if (!is_array($targetBlocks)) $targetBlocks = [];

                    $featuresBlockIndex = null;
                    foreach ($targetBlocks as $idx => $block) {
                        if (($block['type'] ?? '') === 'FeaturesList') {
                            $featuresBlockIndex = $idx;
                            break;
                        }
                    }

                    if ($mode === 'replace') {
                        $newFeatures = $sourceFeatures;
                        $newCategories = $sourceCategories;
                    } else { // append mode
                        $existingBlock = $featuresBlockIndex !== null ? $targetBlocks[$featuresBlockIndex] : null;
                        $existingFeatures = $existingBlock['data']['features'] ?? [];
                        $existingCategories = $existingBlock['data']['categories'] ?? ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];

                        // Merge categories uniquely
                        $newCategories = array_values(array_unique(array_merge($existingCategories, $sourceCategories)));

                        // Merge features avoiding exact duplicate title
                        $existingTitles = array_map(fn($f) => mb_strtolower($f['title'] ?? ''), $existingFeatures);
                        $newFeatures = $existingFeatures;
                        foreach ($sourceFeatures as $sf) {
                            $sfTitle = mb_strtolower($sf['title'] ?? '');
                            if (!in_array($sfTitle, $existingTitles)) {
                                $newFeatures[] = $sf;
                                $existingTitles[] = $sfTitle;
                            }
                        }
                    }

                    $newBlockData = [
                        'type' => 'FeaturesList',
                        'data' => [
                            'features' => $newFeatures,
                            'categories' => $newCategories,
                        ]
                    ];

                    if ($featuresBlockIndex !== null) {
                        $targetBlocks[$featuresBlockIndex] = $newBlockData;
                    } else {
                        $targetBlocks[] = $newBlockData;
                    }

                    $targetVehicle->layout_blocks = $targetBlocks;
                    $targetVehicle->save();
                }

                // 2. Handle Copy Accessories
                if ($copyAccessories) {
                    if ($mode === 'replace') {
                        $targetVehicle->accessories()->sync($sourceAccessoryIds);
                    } else { // append mode
                        $targetVehicle->accessories()->syncWithoutDetaching($sourceAccessoryIds);
                    }
                }

                $updatedCount++;
            }
        });

        revalidate_frontend();

        return response()->json([
            'success' => true,
            'message' => "Đã sao chép thành công dữ liệu cho {$updatedCount} dòng xe!",
            'updated_count' => $updatedCount
        ]);
    }
}
