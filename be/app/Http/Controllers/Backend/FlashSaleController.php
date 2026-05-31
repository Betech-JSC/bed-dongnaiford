<?php

namespace App\Http\Controllers\Backend;

use App\Models\Product\FlashSale;
use App\Models\Product\Product;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class FlashSaleController extends Controller
{
    use HasCrudActions;
    public $model = FlashSale::class;

    private function getTable()
    {
        return 'Products/FlashSales';
    }
}
