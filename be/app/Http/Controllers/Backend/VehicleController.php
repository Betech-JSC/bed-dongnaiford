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
}
