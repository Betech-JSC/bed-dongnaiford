<?php

namespace App\Http\Controllers\Backend;

use App\Imports\ProductImport;
use App\Models\Product\Product;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    use HasCrudActions {
        store as traitStore;
    }
    public $model = Product::class;

    private function getTable()
    {
        return 'Products/Products';
    }

    public $with = [
        'index' => ['translations'],
        'form' => ['categories', 'relatedProducts']
    ];

    public function store(Request $request, $id = null)
    {
        Log::info('--- ProductController Store/Update Request ---');
        Log::info('ID: ' . $id);
        Log::info('Data:', $request->all());

        return $this->traitStore($request, $id);
    }
}
