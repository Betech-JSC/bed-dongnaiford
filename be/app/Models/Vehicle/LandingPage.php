<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rule;

class LandingPage extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'landing_pages';

    public $translationModel = LandingPageTranslation::class;
    public $translationForeignKey = 'landing_page_id';
    public $with = ['translations'];

    protected $fillable = [
        'sales_consultant_id',
        'vehicle_id',
        'vehicle_ids',
        'layout_blocks',
        'promotions',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'vehicle_ids' => 'array',
        'layout_blocks' => 'array',
        'promotions' => 'array',
        'sort_order' => 'integer',
    ];

    protected $appends = ['vehicles_list'];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public $translatedAttributes = [
        'title',
        'seo_meta_title',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function setVehicleIdsAttribute($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true);
        }
        if (is_array($value)) {
            $ids = array_map(function ($item) {
                if (is_array($item) && isset($item['id'])) {
                    return (int) $item['id'];
                }
                return (int) $item;
            }, $value);
            $ids = array_values(array_filter($ids));
            $this->attributes['vehicle_ids'] = json_encode($ids);
            if (!empty($ids)) {
                $currentVehicleId = (int)($this->attributes['vehicle_id'] ?? 0);
                if (!$currentVehicleId || !in_array($currentVehicleId, $ids)) {
                    $this->attributes['vehicle_id'] = $ids[0];
                }
            }
        } else {
            $this->attributes['vehicle_ids'] = null;
        }
    }

    public function getVehiclesListAttribute()
    {
        $ids = $this->vehicle_ids;
        if (empty($ids) && $this->vehicle_id) {
            $ids = [(int)$this->vehicle_id];
        }
        if (empty($ids)) {
            return [];
        }
        return Vehicle::whereIn('id', (array)$ids)->get()->map(fn($v) => [
            'id' => $v->id,
            'title' => $v->title,
            'slug' => $v->slug,
        ])->toArray();
    }

    protected static function booted()
    {
        static::saving(function ($landingPage) {
            $ids = $landingPage->vehicle_ids;
            if (is_array($ids) && count($ids) > 0) {
                $currentVehicleId = (int)($landingPage->vehicle_id ?? 0);
                if (!$currentVehicleId || !in_array($currentVehicleId, array_map('intval', $ids))) {
                    $landingPage->vehicle_id = (int)$ids[0];
                }
            }
            if (empty($landingPage->layout_blocks) && $landingPage->vehicle_id) {
                $vehicle = Vehicle::find($landingPage->vehicle_id);
                if ($vehicle) {
                    $landingPage->layout_blocks = $vehicle->layout_blocks;
                }
            }
        });
    }

    public function salesConsultant()
    {
        return $this->belongsTo(SalesConsultant::class, 'sales_consultant_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function rules(): array
    {
        $salesConsultantId = request()->input('sales_consultant_id');
        $id = request()->route('id') ?? request()->input('id') ?? $this->id;

        $base = [
            'sales_consultant_id' => 'required|integer|exists:sales_consultants,id',
            'vehicle_ids' => 'required|array|min:1',
            'vehicle_id' => 'nullable|integer',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
            'layout_blocks' => 'nullable|array',
            'promotions' => 'nullable|array',
            'vi.title' => 'required|string|max:255',
        ];

        return [
            'store' => $base,
            'update' => $base,
        ];
    }
}
