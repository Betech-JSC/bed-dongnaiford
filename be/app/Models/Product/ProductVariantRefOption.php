<?php

namespace App\Models\Product;

use App\Models\BaseModel;

class ProductVariantRefOption extends BaseModel
{
    protected $table = 'product_variant_ref_options';
    public $timestamps = false;
    public $incrementing = false;
    public $primaryKey = null;

    public $fillable = [
        'product_variant_id',
        'product_id',
        'option_id',
        'position',
        'is_required',
    ];

    public static function storeProductOption()
    {
        $optionRefs = ProductVariantRefOption::query()->get();
        foreach ($optionRefs as $optionRef) {
            if (!empty($optionRef->option)) {
                $data = [
                    'option_id' => $optionRef->option->parent_id,
                    'product_id' => $optionRef->product_id,
                    'product_variant_id' => NULL,
                ];

                ProductVariantRefOption::updateOrCreate($data, array_merge($data, [
                    'is_required' => true
                ]));
            }
        }
    }
}
