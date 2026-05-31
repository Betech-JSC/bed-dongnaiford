<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusTeam;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusTeamController extends Controller
{
    use HasCrudActions;

    public $model = LotusTeam::class;
}
