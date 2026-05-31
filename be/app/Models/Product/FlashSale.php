<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\BaseModel;
use App\Traits\Searchable;

class FlashSale extends BaseModel
{
    use HasFactory,  Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];


    protected $fillable = [
        'title',
        'status',
        'start_time',
        'end_time',
        'flash_sale_price',
        'flash_sale_quantity',
        'product_id'
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    protected static function booted()
    {
        try {
            static::saving(function (self $model) {
                if (strpos(request()->getRequestUri(), '/flash-sales') == false) return;

                $product = $model->product;

                if ($product) {
                    if ($model->flash_sale_quantity > $product->stock_quantity) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'flash_sale_quantity' => "Flash Sale quantity cannot exceed product stock ({$product->stock_quantity}).",
                        ]);
                    }

                    $product->save();
                }
            });

            static::deleting(function (self $model) {

                $product = $model->product;

                if ($product) {

                    $product = $model->product;

                    $product->stock_quantity += $model->flash_sale_quantity;
                    $product->save();
                }
            });
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
