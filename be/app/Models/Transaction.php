<?php

namespace App\Models;

use App\Models\BaseModel;

class Transaction extends BaseModel
{

    public $fillable = [
        'getway',
        'transaction_date',
        'account_number',
        'sub_account',
        'amount_in',
        'amount_out',
        'accumulated',
        'code',
        'transaction_content',
        'reference_number',
        'body',
    ];
}
