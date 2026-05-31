<?php

namespace App\Models\Product;

use App\Models\BaseModel;

class ProductRefCategory extends BaseModel
{
    protected $table = 'product_ref_categories';
    public $timestamps = false;
    public $incrementing = false;
    public $primaryKey = null;

    public $fillable = [
        'product_id',
        'product_category_id',
    ];
}
