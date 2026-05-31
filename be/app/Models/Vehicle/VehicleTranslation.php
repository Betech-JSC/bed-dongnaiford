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
        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];
}
