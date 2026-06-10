<?php

namespace App\Http\Controllers\Backend;

use App\Models\MaintenanceSchedule;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class MaintenanceScheduleController extends Controller
{
    use HasCrudActions;

    public $model = MaintenanceSchedule::class;
}
