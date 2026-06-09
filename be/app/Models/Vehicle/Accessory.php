<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Accessory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'accessories';

    public $translationModel = AccessoryTranslation::class;
    public $translationForeignKey = 'accessory_id';
    public $with = ['translations'];
    protected $appends = ['url'];



    public $translatedAttributes = [
        'title',
        'slug',
        'description',
        'compatibility_text',
        'safety_text',
        'product_desc_text',
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
        'brand_id',
        'code',
        'price',
        'image',
        'images',
        'fit_vehicles',
        'features',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function rules(): array
    {
        $base = [
            'vi.title'   => 'required|string|max:255',
            'brand_id'   => 'nullable|integer|exists:brands,id',
            'code'       => 'nullable|string|max:50',
            'price'      => 'nullable|numeric|min:0',
            'image'      => 'nullable|array',
            'images'     => 'nullable|array',
            'status'     => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];

        return [
            'store'      => $base,
            'storeDraft' => $base,
        ];
    }

    protected static function booted()
    {
        static::saved(function (self $model) {
            if (request()->route() === null) return;
            $model->saveCategories($model);
        });
    }

    public function saveCategories($model)
    {
        $categories = array_column(request()->input('categories', []), 'id');
        $model->categories()->sync($categories, 'id');
    }

    // ── JSON field accessors (same pattern as Vehicle) ──

    private function encodeJsonField($value): ?string
    {
        if (is_null($value)) return null;
        return is_array($value) ? json_encode($value) : $value;
    }

    private function decodeJsonField($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = $this->encodeJsonField($value);
    }

    public function getImageAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    public function setImagesAttribute($value): void
    {
        $this->attributes['images'] = $this->encodeJsonField($value);
    }

    public function getImagesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setFitVehiclesAttribute($value): void
    {
        $this->attributes['fit_vehicles'] = $this->encodeJsonField($value);
    }

    public function getFitVehiclesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setFeaturesAttribute($value): void
    {
        $this->attributes['features'] = $this->encodeJsonField($value);
    }

    public function getFeaturesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    // ── Helpers ──

    public function categories()
    {
        return $this->belongsToMany(
            AccessoryCategory::class,
            'accessory_ref_categories',
            'accessory_id',
            'accessory_category_id'
        );
    }

    public function brand()
    {
        return $this->belongsTo(\App\Models\Brand\Brand::class, 'brand_id');
    }

    public function getCategoryNameAttribute(): string
    {
        return $this->categories->pluck('title')->implode(', ');
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $slug = $translation->seo_slug ?? $translation->slug;
                if ($slug) {
                    if ($translation->locale === 'vi') {
                        $urls['VI'] = '/phu-kien/' . $slug;
                    } else {
                        $urls[strtoupper($translation->locale)] = '/accessories/' . $slug;
                    }
                }
            }
        }
        return $urls;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereSlug($query, $slug)
    {
        return $query->whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug)->orWhere('seo_slug', $slug);
        });
    }

    public function getImageDetail($image): array
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function transform(): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'slug'          => $this->seo_slug ?? $this->slug,
            'code'          => $this->code,
            'categories'    => $this->categories->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
            ]),
            'category_name' => $this->category_name,
            'brand'         => $this->brand ? $this->brand->transform() : null,
            'price'         => $this->price,
            'description'   => $this->description,
            'image'         => $this->getImageDetail($this->image ?? []),
            'images'        => collect($this->images)->map(fn($item) => $this->getImageDetail($item)),
            'fit_vehicles'  => $this->fit_vehicles ?? [],
            'features'      => $this->features ?? [],
        ];
    }

    public function transformDetails(): array
    {
        return array_merge($this->transform(), [
            'compatibility_text' => $this->compatibility_text,
            'safety_text'        => $this->safety_text,
            'product_desc_text'  => transform_richtext($this->product_desc_text),
        ]);
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
