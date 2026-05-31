<?php

namespace App\Http\Controllers\Backend;

use App\Models\Order;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Carbon\Carbon;

class OrderController extends Controller
{
    use HasCrudActions;
    public $model = Order::class;

    public $appends = [
        'form' => ['formatted_created_at']
    ];

    public $with = [
        'form' => ['orderLines', 'orderLines.product']
    ];

    private function getTable()
    {
        return 'Products/Orders';
    }

    private function beforeIndex($query)
    {
        if (request()->has('filters.customer_id')) {
            $query->where('customer_id', request()->input('filters.customer_id'));
        }
        if (request()->has('filters.status') && request()->input('filters.status') != 9) {
            $query->where('status', request()->input('filters.status'));
        }
        if (request()->has('filters.sort') && request()->input('filters.sort') != 'all') {
            switch (request()->input('filters.sort')) {
                case 'to_day':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case 'last_7':
                    $query->whereDate('created_at', '>=', Carbon::today()->subDays(7));
                    break;
                case 'last_30':
                    $query->whereDate('created_at', '>=', Carbon::today()->subDays(30));
                    break;
                case 'last_90':
                    $query->whereDate('created_at', '>=', Carbon::today()->subDays(90));
                    break;
            }
        }
        return $query->orderBy('id', 'desc');
    }
}
