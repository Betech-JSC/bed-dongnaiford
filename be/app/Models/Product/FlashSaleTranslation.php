<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\BaseModel;

class FlashSaleTranslation extends BaseModel
{
    use HasFactory;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'locale',
        'title',

    ];


    public function flashSale()
    {
        return $this->belongsTo(FlashSale::class);
    }
}
