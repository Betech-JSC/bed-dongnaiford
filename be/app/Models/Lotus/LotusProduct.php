<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class LotusProduct extends BaseModel
{
    use SoftDeletes, Translatable;

    public $with = ['translations'];
    public $translationModel = LotusProductTranslation::class;
    public $translationForeignKey = 'lotus_product_id';
    public $translatedAttributes = [
        'slug',
        'title',
        'overview',
        'overview_courses',
        'overview_future',
        'author',
        'author_title',
        'author_description',
        'sections',
        'highlights',
        'sections_title',
    ];

    protected $table = 'lotus_products';

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    protected $fillable = [
        'category_id',
        'image',
        'banner_product',
        'banner_detail',
        'author_avatar',
        'review_ids',
        'price',
        'price_sale',
        'status',
        'sort_order',
        'is_hot',
    ];

    protected $casts = [
        'price'      => 'decimal:2',
        'price_sale' => 'decimal:2',
        'is_hot'     => 'boolean',
    ];

    // ─── Auto-generate slug (vi locale) ──────────────────────────────────────
    protected static function booted(): void
    {
        static::saving(function (self $model) {
            // Slug tự sinh được xử lý bởi Translatable khi lưu translation
        });
    }

    // ─── Validation rules ────────────────────────────────────────────────────
    // LƯU Ý: HasCrudActions::getModelRules() chỉ đọc rules() nếu array có key
    // trùng với action name ('store', 'storeDraft'). Nếu không có key đó sẽ
    // FALLBACK về RuleGenerator — sinh rule `json` cho column kiểu JSON trong DB,
    // gây lỗi "phải là một chuỗi JSON" (Inertia gửi PHP array, không phải string).
    public function rules(): array
    {
        $base = [
            'vi.title'       => 'required|string|max:255',
            'price'          => 'nullable|numeric|min:0',
            'price_sale'     => 'nullable|numeric|min:0',
            'image'          => 'nullable|array',
            'banner_product' => 'nullable|array',
            'banner_detail'  => 'nullable|array',
            'author_avatar'  => 'nullable|array',
            'review_ids'     => 'nullable|array',
            'vi.sections'    => 'nullable|array',
            'en.sections'    => 'nullable|array',
            'zh.sections'    => 'nullable|array',
            'vi.highlights'  => 'nullable|array',
            'en.highlights'  => 'nullable|array',
            'zh.highlights'  => 'nullable|array',
        ];

        return [
            'store'      => $base,
            'storeDraft' => $base,
        ];
    }

    // ─── Mutators (write): array → JSON string ───────────────────────────────
    private function encodeJsonField($value): ?string
    {
        if (is_null($value)) return null;
        return is_array($value) ? json_encode($value) : $value;
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = $this->encodeJsonField($value);
    }

    public function setBannerProductAttribute($value): void
    {
        $this->attributes['banner_product'] = $this->encodeJsonField($value);
    }

    public function setBannerDetailAttribute($value): void
    {
        $this->attributes['banner_detail'] = $this->encodeJsonField($value);
    }

    public function setAuthorAvatarAttribute($value): void
    {
        $this->attributes['author_avatar'] = $this->encodeJsonField($value);
    }

    // NOTE: setSectionsAttribute & setHighlightsAttribute REMOVED.
    // 'sections' and 'highlights' are translatedAttributes - Astrotomic routes
    // all set/get to LotusProductTranslation, so mutators on the main model
    // are dead code AND cause a critical bug (Astrotomic's getAttribute with a
    // GET mutator writes PHP arrays into $this->attributes, bypassing mass
    // assignment → array bindings in INSERT → 'Array to string conversion').

    // ─── Accessors (read): JSON string → array ───────────────────────────────
    private function decodeJsonField($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getImageAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        // Nếu là plain string path (không phải JSON), bọc lại thành array
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    public function getBannerProductAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function getBannerDetailAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function getAuthorAvatarAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    // NOTE: getSectionsAttribute & getHighlightsAttribute REMOVED.
    // Astrotomic provides sections/highlights via translation (with 'array' cast
    // on LotusProductTranslation) - the GET mutator on the main model caused
    // Astrotomic to write PHP array directly into $this->attributes, breaking INSERT.

    public function getReviewIdsAttribute($value): array
    {
        return $this->decodeJsonField($value) ?? [];
    }

    public function setReviewIdsAttribute($value): void
    {
        $this->attributes['review_ids'] = is_array($value) ? json_encode($value) : $value;
    }

    // ─── URL convenience accessors ────────────────────────────────────────────
    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function getBannerProductUrlAttribute(): ?string
    {
        return isset($this->banner_product['path']) ? static_url($this->banner_product['path']) : null;
    }

    public function getBannerDetailUrlAttribute(): ?string
    {
        return isset($this->banner_detail['path']) ? static_url($this->banner_detail['path']) : null;
    }

    public function getAuthorAvatarUrlAttribute(): ?string
    {
        return isset($this->author_avatar['path']) ? static_url($this->author_avatar['path']) : null;
    }

    // ─── Relationships ────────────────────────────────────────────────────────
    public function category()
    {
        return $this->belongsTo(LotusCategory::class, 'category_id');
    }

    public function reviews()
    {
        return $this->hasMany(LotusReview::class, 'product_id');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────
    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    /**
     * Override the Translatable trait's scopeWhereSlug.
     * The trait also checks 'seo_slug', but lotus_product_translations does NOT have that column.
     */
    public function scopeWhereSlug($query, $slug)
    {
        return $query->whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });
    }
}
