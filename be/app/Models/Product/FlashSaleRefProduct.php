<?php

namespace App\Models\Product;

use App\Models\BaseModel;

class FlashSaleRefProduct extends BaseModel
{
    protected $table = 'flash_sale_products';
    public $timestamps = false;
    public $incrementing = false;
    public $primaryKey = null;

    public $fillable = [
        'flash_sale_id',
        'product_id',
    ];
}
