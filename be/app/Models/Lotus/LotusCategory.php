<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class LotusCategory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'lotus_categories';

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public const SLUG_COURSES = 'khoa-hoc';
    public const SLUG_BOOKS   = 'sach';
    public const SLUG_APPS    = 'ung-dung-giao-dich';

    public $with = ['translations'];

    protected $fillable = [
        'icon',
        'image',
        'sort_order',
        'status',
    ];

    // Các cột được lưu vào bảng lotus_category_translations
    public $translatedAttributes = [
        'title',
        'slug',
    ];

    public function rules(): array
    {
        return [
            'vi.title' => 'required|string|max:255',
            'image'    => 'nullable|array',
        ];
    }

    // Mutator: array → JSON string
    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = is_array($value) ? json_encode($value) : $value;
    }

    // Accessor: JSON string → array
    public function getImageAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) return json_decode($value, true);
        return is_array($value) ? $value : null;
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function products()
    {
        return $this->hasMany(LotusProduct::class, 'category_id');
    }

    public function getDefaultLocale(): ?string
    {
        return 'vi';
    }

    /**
     * Override: lotus_category_translations không có cột seo_slug.
     */
    public function scopeWhereSlug($query, $slug)
    {
        return $query->whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public static function getList()
    {
        return static::where('status', self::STATUS_ACTIVE)
            ->sortByPosition()
            ->get()
            ->map(fn($cat) => ['id' => $cat->id, 'title' => $cat->title]);
    }
}
