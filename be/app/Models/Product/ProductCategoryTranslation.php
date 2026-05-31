<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class ProductCategoryTranslation extends BaseModel
{
    use HasFactory, Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'locale',
        'menu_title',
        'title',
        'slug',
        'banner',
        'banner_mobile',
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

    protected $casts = [
        'banner' => 'array',
        'banner_mobile' => 'array'
    ];

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function translations()
    {
        return $this->hasMany(ProductCategoryTranslation::class, 'product_category_id');
    }
}
