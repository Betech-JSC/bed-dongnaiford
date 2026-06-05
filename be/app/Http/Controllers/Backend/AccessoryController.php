<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Vehicle\Accessory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class AccessoryController extends Controller
{
    use HasCrudActions;

    public $model = Accessory::class;

    public $with = [
        'form' => ['translations'],
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
                    'categories' => collect(Accessory::CATEGORY_LIST)->map(fn($label, $key) => [
                        'id' => $key,
                        'label' => $label,
                    ])->values(),
                ]
            ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    private function beforeIndex($query)
    {
        return $query
            ->with(['translations'])
            ->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['categories'] = collect(Accessory::CATEGORY_LIST)->map(fn($label, $key) => [
            'id' => $key,
            'label' => $label,
        ])->values();

        return $data;
    }
}
