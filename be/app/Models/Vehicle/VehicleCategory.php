<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCategory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'vehicle_categories';

    public $translationModel = VehicleCategoryTranslation::class;
    public $translationForeignKey = 'vehicle_category_id';
    public $with = ['translations'];
    
    public $translatedAttributes = [
        'title',
        'slug',
    ];

    protected $fillable = [
        'image',
        'status',
        'sort_order',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        return [
            'vi.title' => 'required|string|max:255',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
    
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'category_id');
    }
}
