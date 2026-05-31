<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusReview;
use App\Models\Lotus\LotusProduct;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusReviewController extends Controller
{
    use HasCrudActions;

    public $model = LotusReview::class;

    private function beforeIndex($query)
    {
        return $query
            ->with('translations')
            ->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['products'] = LotusProduct::withoutGlobalScopes()
            ->where('status', LotusProduct::STATUS_ACTIVE)
            ->with('translations')
            ->orderBy('sort_order')
            ->get()
            ->map(fn($p) => ['id' => $p->id, 'title' => $p->title]);

        return $data;
    }
}
