<?php

namespace App\Http\Controllers\Backend;

use App\Models\Lotus\LotusSponsor;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LotusSponsorController extends Controller
{
    use HasCrudActions;

    public $model = LotusSponsor::class;
}
