<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class LotusReview extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'lotus_reviews';

    public $translationModel = LotusReviewTranslation::class;
    public $translationForeignKey = 'lotus_review_id';
    public $with = ['translations']; // prevent LazyLoadingViolationException in strict mode
    public $translatedAttributes = [
        'customer_name',
        'content',
    ];

    protected $appends = ['image_url'];

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'product_id',
        'rating',
        'status',
        'sort_order',
        'image',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(LotusProduct::class, 'product_id');
    }

    public function rules(): array
    {
        return [
            'vi.customer_name' => 'required|string|max:100',
            'vi.content'       => 'required|string',
            'rating'           => 'required|integer|min:1|max:5',
            'image'            => 'nullable|array',
        ];
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getImageAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function transform(): array
    {
        return [
            'id'            => $this->id,
            'customer_name' => $this->customer_name,
            'rating'        => $this->rating,
            'content'       => $this->content,
            'product_id'    => $this->product_id,
            'image_url'     => $this->image_url,
        ];
    }

}
