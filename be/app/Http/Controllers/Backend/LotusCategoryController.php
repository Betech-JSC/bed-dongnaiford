<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusCategory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusCategoryController extends Controller
{
    use HasCrudActions;

    public $model = LotusCategory::class;
}
