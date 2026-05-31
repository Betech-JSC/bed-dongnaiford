<?php

namespace App\Models\Lotus;

use Illuminate\Database\Eloquent\Model;

class LotusReviewTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'locale',
        'customer_name',
        'content',
        'status_locale',
    ];
}
