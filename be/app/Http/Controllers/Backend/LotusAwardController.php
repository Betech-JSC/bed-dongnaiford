<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusAward;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusAwardController extends Controller
{
    use HasCrudActions;

    public $model = LotusAward::class;
}
