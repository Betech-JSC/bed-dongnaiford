<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Region\Models\Region;

class Customer extends BaseModel
{
    use HasFactory, SoftDeletes, Searchable;

    public $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'city',
        'district',
        'ward',
        'total_order',
        'email_verified_at',
        'password'
    ];

    protected $searchable = [
        'columns' => [
            'customers.name' => 10,
            'customers.phone' => 5,
            'customers.email' => 5,
        ]
    ];
    public $with = ['regionCity', 'regionDistrict', 'regionWard'];

    protected $appends = ['full_address'];

    public function rules()
    {
        return [
            'phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12'
        ];
    }

    public function regionCity()
    {
        return $this->belongsTo(Region::class, 'city', 'code');
    }

    public function regionDistrict()
    {
        return $this->belongsTo(Region::class, 'district', 'code');
    }
    public function regionWard()
    {
        return $this->belongsTo(Region::class, 'ward', 'code');
    }

    public function getFullAddressAttribute()
    {
        return $this->address . ', ' .
            $this->regionWard?->path_with_type
            ?? $this->regionDistrict?->path_with_type
            ?? $this->regionCity?->path_with_type;
    }
}
