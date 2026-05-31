<?php

namespace App\Http\Controllers\Backend;

use App\Models\Product\ProductCategory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    use HasCrudActions;
    public $model = ProductCategory::class;

    private function getTable()
    {
        return 'Products/ProductCategories';
    }

    public function index()
    {
        $this->checkAuthorize(__FUNCTION__);

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
            'schema' => $this->getSchema()
        ]);
    }

    private function redirectToForm($id, $message)
    {
        $currentRoute =  request()->route()->getName();
        $currentRoutePaths = explode('.', $currentRoute);
        $currentRoutePaths[count($currentRoutePaths) - 1] = 'index';
        $formRoute = implode('.', $currentRoutePaths);

        return redirect(route($formRoute, ['id' => $id]))->with('success', $message);
    }
}
