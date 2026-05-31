<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\BaseModel;

class ProductVariantTranslation extends BaseModel
{
    use HasFactory;

    public $timestamps = false;

    public $fillable = [
        'locale',
        'title',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
