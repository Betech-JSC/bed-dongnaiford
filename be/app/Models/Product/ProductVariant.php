<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\BaseModel;
use App\Traits\Searchable;
use App\Traits\Translatable;

use Illuminate\Database\Eloquent\Builder;
use JamstackVietnam\Option\Models\Option;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ProductVariant extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STOCKING = 'STOCKING';
    public const OUT_OF_STOCK = 'OUT_OF_STOCK';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public const CONDITION_LIST = [
        self::STOCKING => 'Còn hàng',
        self::OUT_OF_STOCK => 'Hết hàng',
    ];

    public $with = ['translations'];

    public $fillable = [
        'product_id',
        'status',
        'sku',
        'price',
        'old_price',
        'sale_price',
        'sale_quantity',
        'flash_sale_quantity',

        'condition',
        'images',
        'video_urls',
        'position',
        'is_default',

        'inject_head',
        'inject_body_start',
        'inject_body_end',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public $translatedAttributes = [
        'locale',
        'title',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    protected $searchable = [
        'columns' => [
            'product_variant_translations.title' => 10,
            'product_variant_translations.slug' => 1,
            'product_variant_translations.id' => 1,
        ],
        'joins' => [
            'product_variant_translations' => ['product_variant_translations.product_variant_id', 'product_variants.id'],
        ],
    ];

    //public $appends = ['url'];

    protected $casts = [
        'images' => 'array',
        'video_urls' => 'array'
    ];

    public function rules()
    {
        return [
            'vi.title' => 'required|string|max:255',
        ];
    }

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (strpos(request()->getRequestUri(), '/variants') == false) return;

            if (empty($model->title)) {
                $options = collect(request()->input('options', ['option_id']))->where('option_id', '<>', 0)->values();

                $title = null;
                foreach ($options as $option) {
                    $parentOption = Option::find($option['parent_id'] ?? 0);
                    $option = Option::find($option['option_id'] ?? 0);

                    if ($title != null) {
                        $title .= ', ';
                    }

                    $title = $parentOption->title . ' ' . $option->title;
                }

                $model->title = $title;
            }

            if ($model->is_default && $model->status == false) {
                self::where('product_id', $model->product_id)
                    ->update(['is_default' => false]);
            } else {
                $variantCount = self::where('product_id', $model->product_id)
                    ->where('is_default', true)
                    ->active()
                    ->count();

                if ($variantCount == 0) {
                    $model->is_default = true;
                } else {
                    self::where('product_id', $model->product_id)
                        ->where('id', '<>', $model->id)
                        ->update(['is_default' => false]);
                }
            }
        });
        static::saved(function (self $model) {
            if (strpos(request()->getRequestUri(), '/variants') == false) return;
            $model->saveOptions($model);
        });
    }

    private function saveOptions($model)
    {
        $options = collect(request()->input('options', ['option_id']))->where('option_id', '<>', 0)->values();

        $refs = ProductVariantRefOption::query()
            ->where('product_id', $model->product_id)
            ->where('product_variant_id', $model->id)
            ->pluck('option_id');

        $ids = $refs->diff($options->pluck('option_id'));

        if ($ids->isNotEmpty()) {
            ProductVariantRefOption::query()
                ->where('product_id', $model->product_id)
                ->where('product_variant_id', $model->id)
                ->delete();
        }

        self::withoutEvents(function () use ($model, $options) {
            foreach ($options as $option) {
                ProductVariantRefOption::firstOrCreate([
                    'option_id' => $option['option_id'],
                    'product_variant_id' => $model->id,
                    'product_id' => $model->product_id,
                ]);
            }
        });
    }

    public function getImageDefaultAttribute()
    {
        return $this->images ? [
            'url' => isset($this->images[0]['path']) ? static_url($this->images[0]['path']) : null,
            'alt' => $this->images[0]['alt'] ?? $this->title,
        ] : [];
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function options()
    {
        return $this->belongsToMany(
            Option::class,
            'product_variant_ref_options',
            'product_variant_id',
            'option_id',
            'id',
            'id'
        );
    }

    public function transform($product = null, $selectedVariantId = null)
    {
        $product = $product ?? $this->product;

        $options = $this->getOptions($product);

        $optionValues = Option::transformNested($product->requiredProductOptions, $options)
            ->map(function ($option) {
                $name = $option['nodes']->pluck('title');
                if (count($name) == 0) return false;
                return $option['title'] . ': ' . $name->join(', ');
            })->filter()->values();

        $optionTitle = Option::transformNested($product->requiredProductOptions, $options)
            ->map(function ($option) {
                $name = $option['nodes']->pluck('title');
                if (count($name) == 0) return false;
                return $option['title'] . ' ' . $name->join(', ');
            })->filter()
            ->values()
            ->join(', ');

        $optionHaveImage = $this->getOptionHaveImage($options);

        $images = collect(count($this->images) > 0 ? $this->images : $product->images)->map(function ($item) {
            return [
                'url' => static_url($item['path']) ?? null,
                'path' => $item['path'] ?? null,
                'alt' => $item['alt'] ?? $this->title
            ];
        });

        $isSale = $product->sale_available && $this->sale_price != 0 && $this->flash_sale_quantity > 0;

        $price = $isSale  ? $this->sale_price : $this->price;

        $oldPrice = $isSale && !($this->old_price > 0) ? $this->price : $this->old_price;

        return [
            'id' => $this->id,
            'title' => $this->title,
            // 'image' => [
            //     'url' => isset($this->images[0]['path']) ? static_url($this->images[0]['path']) : null,
            //     'alt' => $this->images[0]['alt'] ?? $this->title,
            // ],
            'image' => $images->first(),
            'images' => $images,
            'product_id' => $this->product_id,
            'sku' => $this->sku,
            'price' => $price,
            'old_price' => $oldPrice,
            'default_price' => $this->price,
            'percent' => $this->getPercent($product),
            'option_name' => $options->pluck('title')->join(', '),
            'option_values' => $optionValues,
            'option_title' => $optionTitle,
            'primary_option' => $optionHaveImage,
            'condition' => $this->condition,
            'selected' => $this->id === (int) $selectedVariantId,
            'options' => $options->map(fn($item) => $item->transform()),
            'video_urls' => collect($this->video_urls)->pluck('link'),
            'sale_quantity' => $this->sale_quantity ?? 0,
            'flash_sale_quantity' => $this->flash_sale_quantity ?? 0,
            'is_flash_sale' => $isSale
        ];
    }

    private function getOptionHaveImage($options)
    {
        $option = $options->whereNotNull('image')->first()?->only('id', 'image');

        $option = $option ?? $options->first();

        $option = $option ?? $options->first()?->only('id', 'image');

        if (empty($option)) return null;

        return [
            'id' => $option['id'],
            'image' => $option['image'],
        ];
    }

    private function getOptions($product)
    {
        $variantId = $this->id;
        $requiredProductOptionIds = $product->requiredProductOptions->pluck('id')->toArray();

        return $product->options
            ->filter(function ($option) use ($requiredProductOptionIds, $variantId) {
                return in_array($option->parent_id, $requiredProductOptionIds) && $option->pivot->product_variant_id === $variantId;
            })
            ->values();
    }

    public function getPercent($product)
    {
        $isSale = $product->sale_available && $this->sale_price != 0 && $this->sale_quantity < $this->flash_sale_quantity || !($this->flash_sale_quantity >= 0);

        $price = $isSale ? $this->sale_price : $this->price;

        $oldPrice = $isSale && !($this->old_price > 0) ? $this->price : $this->old_price;

        if (!$oldPrice || !$price || $oldPrice == 0) return 0;
        return round(100 - ($price * 100) / $oldPrice);
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function scopeOrderByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('is_featured', 'desc')
            ->orderByDesc('id');
    }
}
