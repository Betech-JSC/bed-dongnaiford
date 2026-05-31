<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Lotus\LotusGuide;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusGuideController extends Controller
{
    use HasCrudActions;

    public $model = LotusGuide::class;

    /**
     * Override index() — render documentation portal.
     * Không gọi private trait methods (getSchema, checkAuthorize)
     * mà tự authorize bằng Gate trực tiếp.
     */
    public function index()
    {
        // Authorization: check nếu admin có quyền
        $routeName = str_replace(current_locale() . '.', '', request()->route()->getName());
        if (!current_admin()->hasPermissionTo($routeName)) {
            return abort(403);
        }

        if (request()->wantsJson()) {
            // Fallback: trả về data dạng JSON cho DataTable nếu cần
            $query = LotusGuide::query()->orderBy('id', 'desc');
            return response()->json($query->paginate(20));
        }

        // Load grouped data
        $guides = LotusGuide::where('status', LotusGuide::STATUS_ACTIVE)
            ->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'asc')
            ->get(['id', 'title', 'slug', 'icon', 'summary', 'video_url', 'category', 'sort_order']);

        $grouped = collect(LotusGuide::CATEGORY_LIST)
            ->map(function ($label, $key) use ($guides) {
                $items = $guides->where('category', $key)->values();
                return [
                    'key'   => $key,
                    'label' => $label,
                    'count' => $items->count(),
                    'items' => $items,
                ];
            })
            ->filter(fn($g) => $g['count'] > 0)
            ->values();

        $locale = current_locale();

        return Inertia::render('LotusGuides/Index', [
            'breadcrumbs' => [
                [
                    'url'  => route($locale . '.admin.lotus-guides.index'),
                    'name' => 'models.table_list.lotus-guides',
                ],
            ],
            'schema' => [
                'resource' => 'lotus_guides',
                'columns'  => [],
            ],
            'grouped_guides' => $grouped,
            'category_list'  => LotusGuide::CATEGORY_LIST,
        ]);
    }

    private function beforeIndex($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    private function beforeForm($data)
    {
        $data['category_list'] = collect(LotusGuide::CATEGORY_LIST)
            ->map(fn($label, $key) => ['id' => $key, 'label' => $label])
            ->values();

        return $data;
    }
}
