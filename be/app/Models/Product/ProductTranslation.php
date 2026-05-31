<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class ProductTranslation extends BaseModel
{
    use HasFactory, Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'slug',
        'locale',
        'title',
        'title_en',
        'description',

        'specification',
        "info_other",
        'summary',
        'content',
        'ingredient',
        'promotion',
        'output',

        'title_overview',
        'content_overview',
        'title_characteristics',
        'content_characteristics',

        'package_included',
        'harvest_season',
        'product_process',
        'product_preservation',
        'content_overview',

        'image',
        'banner',
        'image_harvest_season',
        'images_characteristics',
        'images_product_process',
        'images_package_specification',
        'images_preservation_methods',

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
        'questions' => 'array',
        'image' => 'array',
        'banner' => 'array',
        'image_harvest_season' => 'array',
        'images_characteristics' => 'array',
        'images_product_process' => 'array',
        'images_package_specification' => 'array',
        'images_preservation_methods' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
