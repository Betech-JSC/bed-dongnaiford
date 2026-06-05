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

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const CATEGORY_LIST = [
        'interior'    => 'Phụ Kiện Nội Thất',
        'exterior'    => 'Phụ Kiện Ngoại Thất',
        'tech'        => 'Công Nghệ & Điện Tử',
        'wheels'      => 'Mâm & Lốp Xe',
        'performance' => 'Phụ Tùng Hiệu Suất',
    ];

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
        'code',
        'category',
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
            'code'       => 'nullable|string|max:50',
            'category'   => 'required|string|in:interior,exterior,tech,wheels,performance',
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

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function getCategoryNameAttribute(): string
    {
        return self::CATEGORY_LIST[$this->category] ?? $this->category;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $slug = $translation->seo_slug ?? $translation->slug;
                if ($slug) {
                    $urls[strtoupper($translation->locale)] = '/accessories/' . $slug;
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
            'category'      => $this->category,
            'category_name' => $this->category_name,
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
