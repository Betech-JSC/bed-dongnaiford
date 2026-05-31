<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusBanner;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusBannerController extends Controller
{
    use HasCrudActions;

    public $model = LotusBanner::class;
}
