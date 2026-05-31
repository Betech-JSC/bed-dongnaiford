<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusActivity;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusActivityController extends Controller
{
    use HasCrudActions;

    public $model = LotusActivity::class;
}
