<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class VehicleCategoryTranslation extends BaseModel
{
    protected $table = 'vehicle_category_translations';
    
    public $timestamps = false;
    
    protected $fillable = ['title', 'slug'];
}
