<?php

namespace App\Models;

use App\Models\BaseModel;

use App\Models\Product\Product;
use App\Models\Product\ProductVariant;

class OrderLine extends BaseModel
{
    protected $table = 'order_lines';

    public $fillable = [
        'id',
        'product_id',
        'order_id',
        'variant_id',

        'title',
        'quantity',
        'price',
        'total_discount',
        'grams',
        'sku',
        'variant_title',

        'requires_shipping',
        'taxable',
        'gift_card',
        'product_exists',
        'properties',
        'tax_lines',
        'fulfillment_status',
        'is_flash_sale',
        'fulfillable_quantity',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'closed_at' => 'datetime',
        'total_discount' => 'int',
        'price' => 'int',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'closed_at',
    ];

    protected static function booted()
    {
        static::saved(function (self $model) {
            if (request()->route() === null) return;

            if ($model->product->sale_available && $model->variant->flash_sale_quantity > 0) {
                if ($model->quantity > $model->variant->flash_sale_quantity) {
                    $model->variant->sale_quantity += $model->variant->flash_sale_quantity;
                    $model->variant->flash_sale_quantity = 0;
                } else {
                    $model->variant->sale_quantity += $model->quantity;
                    $model->variant->flash_sale_quantity -= $model->quantity;
                }
                $model->variant->save();
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id', 'id');
    }

    public function transform(): array
    {
        return [
            'product_id' => $this->product_id,
            'variant_id' => $this->variant_id,
            'order_id' => $this->order_id,
            'title' => $this->title,
            'variant_title' => $this->variant_title,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'total_discount' => $this->total_discount,
            'sku' => $this->sku,
        ];
    }
}
