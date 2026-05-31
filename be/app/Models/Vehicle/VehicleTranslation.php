<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class VehicleTranslation extends BaseModel
{
    protected $table = 'vehicle_translations';

    public $timestamps = false;

    protected $fillable = [
        'title',
        'slug',
        'tagline',
        'description',
    ];
}
