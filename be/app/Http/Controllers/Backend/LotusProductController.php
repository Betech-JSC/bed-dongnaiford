<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusCategory;
use App\Models\Lotus\LotusReview;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusProductController extends Controller
{
    use HasCrudActions;

    public $model = LotusProduct::class;

    public $with = [
        'form' => ['category', 'translations'],
    ];

    /**
     * Admin list: load translations để hiển thị title theo locale.
     * Không dùng withoutGlobalScopes() vì Astrotomic không có global scope,
     * và việc bỏ nó sẽ khiến SoftDeletingScope bị vô hiệu.
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
                    'categories' => LotusCategory::where('status', LotusCategory::STATUS_ACTIVE)
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
        $data['categories'] = LotusCategory::where('status', LotusCategory::STATUS_ACTIVE)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($cat) => ['id' => $cat->id, 'title' => $cat->title]);

        // Danh sách reviews để chọn trong form (kèm category_id qua product)
        $data['reviews'] = LotusReview::query()
            ->withoutGlobalScopes()
            ->with(['product:id,category_id', 'translations'])
            ->where('status', LotusReview::STATUS_ACTIVE)
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'product_id'  => $r->product_id,
                'category_id' => optional($r->product)->category_id,
                'label'       => "#{$r->id} — {$r->customer_name} (" . str_repeat('★', $r->rating ?? 0) . ")",
            ]);

        return $data;
    }
}
