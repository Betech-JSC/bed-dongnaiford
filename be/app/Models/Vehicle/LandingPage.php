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
        'layout_blocks',
        'promotions',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'layout_blocks' => 'array',
        'promotions' => 'array',
        'sort_order' => 'integer',
    ];

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

    protected static function booted()
    {
        static::creating(function ($landingPage) {
            if (empty($landingPage->layout_blocks)) {
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
            'vehicle_id' => [
                'required',
                'integer',
                'exists:vehicles,id',
                Rule::unique('landing_pages', 'vehicle_id')
                    ->where('sales_consultant_id', $salesConsultantId)
                    ->ignore($id),
            ],
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
