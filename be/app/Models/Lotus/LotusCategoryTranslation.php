<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class LotusCategoryTranslation extends BaseModel
{
    use Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'lotus_category_id',
        'locale',
        'title',
        'slug',
    ];

    public function lotusCategory()
    {
        return $this->belongsTo(LotusCategory::class);
    }
}
