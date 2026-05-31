<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleVersion extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'vehicle_versions';

    public $translationModel = VehicleVersionTranslation::class;
    public $translationForeignKey = 'vehicle_version_id';
    public $with = ['translations'];

    public $translatedAttributes = [
        'name',
    ];

    protected $fillable = [
        'vehicle_id',
        'price',
        'specs',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        return [
            'vehicle_id'  => 'required|exists:vehicles,id',
            'vi.name'     => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'specs'       => 'nullable|array',
            'status'      => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order'  => 'nullable|integer',
        ];
    }

    public function setSpecsAttribute($value): void
    {
        $this->attributes['specs'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getSpecsAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
