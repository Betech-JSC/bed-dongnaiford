<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccessoryCategory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'accessory_categories';

    public $translationModel = AccessoryCategoryTranslation::class;
    public $translationForeignKey = 'accessory_category_id';
    public $with = ['translations'];
    protected $appends = ['url'];
    
    public $translatedAttributes = [
        'title',
        'slug',
        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
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
    
    public function accessories()
    {
        return $this->hasMany(Accessory::class, 'category_id');
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                if ($translation->locale === 'vi') {
                    $urls['VI'] = '/danh-muc-phu-kien/' . ($translation->seo_slug ?? $translation->slug);
                } else {
                    $urls[strtoupper($translation->locale)] = '/accessory-categories/' . ($translation->seo_slug ?? $translation->slug);
                }
            }
        }
        return $urls;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
