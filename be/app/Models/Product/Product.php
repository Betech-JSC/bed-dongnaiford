<?php

namespace App\Models\Product;

use App\Models\Brand\Brand;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\BaseModel;
use App\Models\Inventory;
use App\Traits\Searchable;
use App\Traits\Translatable;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use Illuminate\Support\Str;


class Product extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = [
        'categories',
        'brand',
        'translations',
    ];

    public $fillable = [
        'brand_id',
        'status',
        'is_featured',
        'is_new',
        'is_stock',
        'view_count',
        'position',
        'position_flash_sale',
        'images',
        'video_url',
        'sku',
        'price',
        'old_price',
        'sale_price',
        'sale_quantity',
        'flash_sale_quantity',
        'sale_date',
        'stock_quantity',

        'is_sale',
        'flash_sale_to',
        'flash_sale_from',
        'inject_head',
        'inject_body_start',
        'inject_body_end',
        'harvest_season',
        'product_process',

        'image',
        'banner',
        'image_harvest_season',
        'images_characteristics',
        'images_product_process',
        'images_package_specification',
        'images_preservation_methods',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public $translatedAttributes = [
        'slug',
        'locale',
        'title',
        'title_en',
        'content',
        'description',
        'output',
        'specification',

        'title_overview',
        'content_overview',
        'title_characteristics',
        'content_characteristics',

        'package_included',
        'harvest_season',
        'product_process',
        'product_preservation',
        'content_overview',

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
            'product_translations.title' => 10,
            'product_translations.slug' => 10,
            'product_translations.id' => 1,
            'products.sku' => 1
        ],
        'joins' => [
            'product_translations' => ['product_translations.product_id', 'products.id'],
        ]
    ];

    public $appends = ['url'];

    protected $casts = [
        'images' => 'array',
        'image' => 'array',

        'banner' => 'array',
        'image_harvest_season' => 'array',
        'images_characteristics' => 'array',
        'images_product_process' => 'array',
        'images_package_specification' => 'array',
        'images_preservation_methods' => 'array',
    ];

    public function rules()
    {
        return [
            'vi.title'       => 'required|string|max:255',
            'seo_slug'       => 'nullable|unique:product_translations,slug|max:255',
            'seo_slug'       => 'nullable|unique:product_translations,seo_slug|max:255',
            'flash_sale_to'  => 'nullable',
            'flash_sale_from' => 'nullable',
        ];
    }

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (strpos(request()->getRequestUri(), '/products/store') == false) return;

            $model->view_count = request()->input('view_count') ?? 0;
            $model->checkStatus($model);
        });

        static::saved(function (self $model) {
            if (strpos(request()->getRequestUri(), '/products/store') == false) return;
            $model->saveCategories($model);
            $model->saveRelatedProducts($model);
        });
    }


    private function checkStatus($model)
    {
        $categories = array_column(request()->input('categories', []), 'id');
        $hasCategories = ProductCategory::active()->whereIn('id', $categories)->exists();
    }

    public function getStockStatusAttribute()
    {
        return $this->stock_quantity  > 0 ? 'Còn hàng' : 'Hết hàng';
    }


    public function saveRelatedProducts($model)
    {
        $relatedProducts = array_column(request()->input('related_products', []), 'id');
        $model->relatedProducts()->sync($relatedProducts, 'id');
    }

    public function savePosts($model)
    {
        $posts = array_column(request()->input('posts', []), 'id');
        $model->posts()->sync($posts, 'id');
    }

    public function saveTags($model)
    {
        $tags = array_column(request()->input('tags', []), 'id');
        $model->tags()->sync($tags, 'id');
    }

    public function saveCategories($model)
    {
        $categories = array_column(request()->input('categories', []), 'id');
        $model->categories()->sync($categories, 'id');
    }

    public function flashSales()
    {
        return $this->hasMany(FlashSale::class);
    }

    public function relatedProducts()
    {
        return $this->belongsToMany(
            self::class,
            'related_products',
            'product_id',
            'related_product_id'
        )
            ->withPivot('id')
            ->orderBy('related_products.id', 'ASC');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function categories()
    {
        return $this->belongsToMany(
            ProductCategory::class,
            'product_ref_categories',
            'product_id',
            'product_category_id'
        );
    }

    public static function getRootCategory()
    {
        if (request()->has('categoryId')) {
            return static::active()
                ->whereHas('categories', function ($query) {
                    $query->where('id', request()->input('categoryId'));
                })
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => (string) $item['id'],
                        'label' => $item['title']
                    ];
                });
        }

        return static::active()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (string) $item['id'],
                    'label' => $item['title']
                ];
            });

        return [];
    }

    public function getCategoryAttribute()
    {
        return $this->categories
            ->where('status', ProductCategory::STATUS_ACTIVE)
            ->values()
            ->first()
            ?->transform();
    }

    public function getCategoryIdsAttribute()
    {
        return $this->categories->pluck('id');
    }

    public static function lazySearch($data)
    {
        if ($data['keyword'] && !is_array($data['keyword'])) {
            $results = static::query()->search($data['keyword'])->limit(10)->get();
            if ($results->count() > 0) {
                return $results->merge(static::query()->whereNotIn('id', $results->pluck('id'))->get());
            }
        }

        return static::query()->get();
    }


    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->is_active) {
            foreach ($this->translations as $translation) {
                $slug = $translation->seo_slug ?? $translation->slug;

                $urls[strtoupper($translation->locale)] = route("$translation->locale.products.show", [
                    'slug' => $slug,
                ]);
            }
        }
        return $urls;
    }


    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function getBreadcrumbsAttribute()
    {
        $category = $this->categories
            ->where('status', ProductCategory::STATUS_ACTIVE)
            ->sortBy([['parent_id', 'desc']])
            ->values()
            ->first();

        return ProductCategory::transformAsBreadcrumb($category);
    }

    public function getImageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function transform()
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'value' => $this->id,
            'slug' => $this->seo_slug ?? $this->slug,
            'category' => $this->category,
            'image' => $this->image,
            'sku' => $this->sku,
            'description' => $this->description,
            'output' => $this->output,

            'banner' => $this->getImageDetail($this->banner),

            'image' => $this->getImageDetail($this->image),
            'image_harvest_season' => $this->getImageDetail($this->image_harvest_season),

            'images_characteristics' => $this->getImageDetail($this->images_characteristics),
            'images_product_process' => collect($this->images_product_process)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
            'images_package_specification' => collect($this->images_package_specification)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
            'images_preservation_methods' => collect($this->images_preservation_methods)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
        ];

        return $data;
    }

    public function transformCategory()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'slug' => $this->seo_slug ?? $this->slug,
            'sku' => $this->sku
        ];
    }

    public function transformDetails()
    {
        $images = collect($this->images)
            ->map(function ($item) {
                return [
                    'url' => static_url($item['path']) ?? null,
                    'alt' => $item['alt'] ?? $this->title
                ];
            });

        return  [
            'id' => $this->id,
            'title' => $this->title,
            'title_en' => $this->title_en,
            'sku' => $this->sku,
            'description' => $this->description,
            'category' => $this->category,
            'content' => transform_richtext($this->content),
            'slug' => $this->seo_slug ?? $this->slug,
            'images' => $images,
            'output' => $this->output,
            'price' => $this->price ?? 0,

            'title_overview' => $this->title_overview,
            'content_overview' => $this->content_overview,
            'title_characteristics' => $this->title_characteristics,
            'content_characteristics' => $this->content_characteristics,

            'package_included' => $this->package_included,
            'harvest_season' => $this->harvest_season,
            'product_process' => $this->product_process,
            'product_preservation' => $this->product_preservation,
            'content_overview' => $this->content_overview,

            'banner' => $this->getImageDetail($this->banner),

            'image' => $this->getImageDetail($this->image),
            'image_harvest_season' => $this->getImageDetail($this->image_harvest_season),

            'images_characteristics' => $this->getImageDetail($this->images_characteristics),
            'images_product_process' => collect($this->images_product_process)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
            'images_package_specification' => collect($this->images_package_specification)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
            'images_preservation_methods' => collect($this->images_preservation_methods)->map(function ($item) {
                return $this->getImageDetail($item);
            }),
        ];
    }


    public function scopeActive(Builder $query)
    {
        return $query->where('products.status', self::STATUS_ACTIVE)
            ->where('stock_quantity', '>', 0)
            ->whereHas('categories', function ($query) {
                $query->active();
            });
    }

    public function scopeIsFeatured(Builder $query)
    {
        return $query->where('is_featured', 1);
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->when($filters['keyword'] ?? false, function (Builder $query, $keyword) {
            $query->where('name', 'like', "%{$keyword}%");
        });

        $query->when($filters['categories'] ?? false, function (Builder $query, $categories) {
            $categoryIds = is_array($categories)
                ? $categories
                : explode(',', $categories);

            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('id', $categoryIds);
            });
        });

        $query->when($filters['sort'] ?? false, function (Builder $query, $sort) {
            $direction = strtolower($sort) === 'desc' ? 'desc' : 'asc';
            $query->orderBy('created_at', $direction);
        });

        return $query;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function scopeOrderByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderByDesc('id');
    }

    public function scopeOrderByPositionFlashSale($query)
    {
        return $query->orderByRaw('ISNULL(position_flash_sale) OR position_flash_sale = 0, position_flash_sale ASC')
            ->orderByDesc('id');
    }

    public function scopeOrderByFeatured($query)
    {
        return $query->orderBy('is_featured', 'desc')
            ->orderByDesc('id');
    }

    public function getImageUrlAttribute()
    {
        return isset($this->images[0]['path']) ? static_url($this->images[0]['path']) : null;
    }

    public function related($condition = [])
    {
        $limit = empty($condition['limit']) ? 8 : $condition['limit'];
        $relatedProducts = $this->relatedProducts
            ->where('status', self::STATUS_ACTIVE)
            ->where('stock_quantity', '>', 1)
            ->where('id', '<>', $this->id)
            ->where(function ($item) {
                return $item['categories']->where('status', self::STATUS_ACTIVE)->count() > 0;
            })
            ->values()
            ->take($limit);

        $relatedProductIds = [];

        if ($relatedProducts->count() > 0) {
            $relatedProductIds = $relatedProducts->pluck('id');
        }

        if (count($relatedProducts) < $limit) {
            $addProducts = self::query()
                ->active()
                ->when($this->category['id'] ?? false, function ($query) {
                    $query->whereHas('categories', function ($query) {
                        $query->where('id', $this->category['id']);
                    });
                })
                ->where('id', '<>', $this->id)
                ->whereNotIn('id', $relatedProductIds)
                ->take($limit - count($relatedProducts))
                ->get();

            if (count($addProducts) > 0) {
                $relatedProducts = $relatedProducts->concat($addProducts);
            }
        }

        return $relatedProducts->map(fn($item) => $item->transform());
    }

    public function getActiveFlashSale()
    {
        $currentDateTime = Carbon::now();

        return $this->flashSales()
            ->where('status', FlashSale::STATUS_ACTIVE)
            ->where('start_time', '<=', $currentDateTime)
            ->where('end_time', '>=', $currentDateTime)
            ->where('flash_sale_quantity', '>', 0)
            ->first();
    }

    public function getIsFlashSaleAttribute()
    {
        return $this->isFlashSale();
    }

    public function scopeWhereNotFlashSale($query)
    {
        $currentDateTime = Carbon::now();
        return $query->where('products.status', self::STATUS_ACTIVE)
            ->where('flash_sale_from', '>=', $currentDateTime)
            ->where('flash_sale_to', '<=', $currentDateTime);
    }

    public function scopeSearchTitle($query, $value)
    {
        return $query->whereHas('translations', function (Builder $query) use ($value) {
            $query->where('title', 'LIKE', "%{$value}%");
        })->orWhereHas('translations', function (Builder $query) use ($value) {
            // Xử lý tìm kiếm gần giống (fuzzy search)
            $query->whereRaw("SOUNDEX(title) = SOUNDEX(?)", [$value]);
        });
    }

    public function scopeSearchSlug($query, $title)
    {
        $queryRaw = [];
        $words = collect(explode('-', $title));

        if ($words->count() === 1 || $words->count() > 20) {
            $queryRaw[] = "(case when LOWER(`product_translations`.`title`) LIKE '%-$title-%' then 50 else 0 end)";
            $queryRaw[] = "(case when LOWER(`product_translations`.`title`) LIKE '$title-%' then 50 else 0 end)";
            $queryRaw[] = "(case when LOWER(`product_translations`.`title`) LIKE '%-$title' then 50 else 0 end)";
            $queryRaw[] = "(case when LOWER(`product_translations`.`title`) LIKE '%$title%' then 10 else 0 end)";
        } else {
            $rowWords = $this->combinations($words, count($words));

            foreach ($rowWords as $words) {
                $subQueryRaw1 = '';
                $subQueryRaw2 = '';
                $subQueryRaw3 = '';
                foreach ($words as $index => $word) {
                    if ($index == 0) {
                        $subQueryRaw1 .= "LIKE '%-$word-%'";
                        $subQueryRaw2 .= "LIKE '$word-%'";
                        $subQueryRaw3 .= "LIKE '%-$word-%'";
                    } else if ($index == count($words) - 1) {
                        $subQueryRaw1 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word-%'";
                        $subQueryRaw2 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word-%'";
                        $subQueryRaw3 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word'";
                    } else {
                        $subQueryRaw1 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word-%'";
                        $subQueryRaw2 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word-%'";
                        $subQueryRaw3 .= " AND LOWER(`product_translations`.`title`) LIKE '%-$word-%'";
                    }
                }
                $queryRaw[] = "(case when LOWER(`product_translations`.`title`) " . $subQueryRaw1 . " then " . count($words) * 10 . " else 0 end)";
                $queryRaw[] = "(case when LOWER(`product_translations`.`title`) " . $subQueryRaw2 . " then " . count($words) * 10 . " else 0 end)";
                $queryRaw[] = "(case when LOWER(`product_translations`.`title`) " . $subQueryRaw3 . " then " . count($words) * 10 . " else 0 end)";
            }
        }

        $query
            ->join('product_translations', function ($join) {
                $join->on('products.id', '=', 'product_translations.product_id');
            })
            ->select('products.id', 'products.images', 'products.image', 'products.price')
            ->selectRaw(
                "max(
                        " . join(' + ', $queryRaw) . "
                    ) as priority",
            )
            ->having('priority', '>', 0)
            ->orderBy('priority', 'DESC');

        return $query->groupBy('id');
    }

    public function combinations($arr, $count)
    {
        $combinations = array();
        $combination = array_fill(0, $count, 0);

        while (1) {
            $temp = array();
            for ($i = 0; $i < $count; ++$i)
                $temp[] = $arr[$combination[$i]];
            $combinations[] = $temp;

            $i = $count - 1;
            while ($i >= 0 && $combination[$i] == count($arr) - 1)
                --$i;

            if ($i < 0)
                break;

            ++$combination[$i];

            for ($j = $i + 1; $j < $count; ++$j)
                $combination[$j] = $combination[$i];
        }

        $combinations = collect($combinations)->map(function ($item) {
            return array_unique($item);
        })->filter(function ($item) {
            return count($item) > 1;
        })
            ->values()
            ->toArray();

        return $combinations;
    }
}
