<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\BaseModel;
use App\Traits\Searchable;
use App\Traits\Translatable;


class ProductCategory extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations', 'nodes'];

    public $appends = ['url'];

    public $fillable = [
        'parent_id',
        'status',

        'image',
        'image_mobile',
        'position',
        'menu_position',
        'footer_position',
        'featured_position',
        'homepage_position',
        'view_count',

        'inject_head',
        'inject_body_start',
        'inject_body_end',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public $translatedAttributes = [
        'locale',
        'menu_title',
        'title',
        'title_en',
        'slug',
        'banner',
        'description',


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
            'product_category_translations.title' => 10,
            'product_category_translations.id' => 5,
        ],
        'joins' => [
            'product_category_translations' => ['product_category_translations.product_category_id', 'product_categories.id'],
        ],
    ];

    protected $casts = [
        'image' => 'array',
        'image_mobile' => 'array'
    ];

    public function rules()
    {
        return [
            'vi.title' => 'required|string|max:255',
            'seo_slug' => 'nullable|unique:product_translations,slug|max:255',
            'seo_slug' => 'nullable|unique:product_translations,seo_slug|max:255',
        ];
    }

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (strpos(request()->getRequestUri(), '/product-categories') == false) return;
            $model->view_count = request()->input('view_count') ?? 0;
        });
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_ref_categories',
            'product_category_id',
            'product_id',
        );
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function nodes()
    {
        return $this->children()
            ->orderBy('parent_id')
            ->sortByPosition();
    }

    public static function getRoot()
    {
        // Lấy locale từ request (mặc định là 'en' nếu không có)
        $locale = request()->input('locale', 'en');

        // Truy vấn lấy các danh mục gốc (parent_id = 0), áp dụng lọc theo locale cho các bản dịch
        $data = static::query()
            ->with(['nodes' => function ($query) use ($locale) {
                // Nạp các bản dịch cho nodes, lọc theo locale
                $query->with(['translations' => function ($query) use ($locale) {
                    $query->where('locale', $locale);  // Lọc theo locale từ request
                }]);

                // Tiếp tục nạp các cấp con (nodes của nodes)
                $query->with('nodes');
            }])
            ->where('parent_id', 0)  // Chỉ lấy các node gốc (parent_id = 0)
            ->orderBy('position')    // Sắp xếp theo position nếu cần
            ->get();

        return $data;
    }

    public static function getCategoriesJson()
    {
        // Lấy dữ liệu từ cơ sở dữ liệu
        $data = static::query()
            ->sortByPosition()
            ->with('nodes') // Giả sử nodes là mối quan hệ cha-con trong mô hình
            ->orderBy('parent_id')
            ->whereParent()
            ->get();

        // Hàm đệ quy để tạo cấu trúc cây
        $categories = self::buildTree($data);

        return $categories;
    }

    // Hàm đệ quy để xây dựng cây
    private static function buildTree($items, $parentId = 0)
    {
        return $items->filter(function ($item) use ($parentId) {
            return $item->parent_id == $parentId;
        })->map(function ($item) use ($items, $parentId) {
            $children = self::buildTree($items, $item->id);

            return [
                'key' => (string) $item->id,
                'label' => $item->title,
                'data' => $item->description ?? $item->title,  // Nếu không có description, lấy title
                'children' => $children->isNotEmpty() ? $children : [],  // Nếu có con, trả về; nếu không, trả về mảng rỗng
            ];
        });
    }


    public static function getFlattenCategories()
    {
        $data = static::getRoot();
        return ProductCategory::pluckAndFlatten(collect($data)->toArray());
    }

    public static function pluckAndFlatten($element)
    {
        $flatArray = array();
        foreach ($element as $key => $node) {
            if (array_key_exists('nodes', $node)) {
                $flatArray = array_merge($flatArray, ProductCategory::pluckAndFlatten(collect($node['nodes'])->toArray()));
                unset($node['nodes']);
                $flatArray[] = $node;
            } else {
                $flatArray[] = $node;
            }
        }


        return $flatArray;
    }

    public static function getRootProduct()
    {
        return static::orderBy('parent_id')
            ->get();
    }

    public static function getDataDetail()
    {
        if (request()->has('id')) {
            return static::with('products')->find(request()->input('id'));
        }

        return null;
    }

    public static function getNested()
    {
        $items = static::orderBy('parent_id')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'parent_id' => $item->parent_id,
                ];
            })
            ->values()->toArray();

        return collect(self::buildCategoryTree($items));
    }


    public static function buildCategoryTree(array $categories): array
    {
        $categoryMap = [];

        // Group categories by parent_id
        foreach ($categories as $category) {
            $categoryId = $category['id'];
            $parentId = $category['parent_id'];

            if (!isset($categoryMap[$parentId])) {
                $categoryMap[$parentId] = [];
            }

            $categoryMap[$parentId][$categoryId] = $category;
        }

        // Build category tree recursively
        $result = [];

        $buildTree = function ($parentId, $parentTitle = '', $level = 0) use (&$categoryMap, &$result, &$buildTree) {
            if (isset($categoryMap[$parentId])) {
                foreach ($categoryMap[$parentId] as $categoryId => $category) {
                    $categoryTitle = ($parentTitle ? $parentTitle . ' >> ' : '') . $category['title'];
                    $category['title'] = $categoryTitle;
                    $result[] = $category;
                    $buildTree($categoryId, $categoryTitle, $level + 1);
                }
            }
        };

        $buildTree(0);

        return $result;
    }


    public static function getRootWithChildren()
    {
        return static::orderBy('parent_id')
            ->with('children.children.children.children')
            ->whereParent()
            ->get();
    }

    public static function transformAsBreadcrumb($category)
    {
        if ($category) {
            return collect(self::flatAncestors($category))
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'slug' => $item->seo_slug ?? $item->slug,
                        'url' => $item->url,
                    ];
                })
                ->reverse()->values();
        }
        return [];
    }

    public static function flatAncestors($model): array
    {
        if (!$model) return [];

        $result[] = $model;
        if (!empty($model->parent)) {
            $result = array_merge($result, self::flatAncestors($model->parent));
        }

        return $result;
    }

    public static function flatDescendants($model): array
    {
        if (!$model) return [];

        $result[] = $model;
        foreach ($model->activeNodes as $child) {
            $result[] = $child;
            if (!empty($child->activeNodes)) {
                $result = array_merge($result, self::flatDescendants($child));
            }
        }

        return $result;
    }

    public static function transformNested($parents, $children)
    {
        return $parents->map(function ($parent) use ($children) {
            $nodes = $children
                ->filter(fn($item) => $item['parent_id'] === $parent->id)
                ->map(fn($item) => $item->transformNode())
                ->unique()
                ->values();

            return [
                'id' => $parent->id,
                'title' => $parent->title,
                'slug' => $parent->seo_slug ?? $parent->slug,
                'nodes' => $nodes,
                'image' => $this->getImageDetail($this->image),
                'image_mobile' => $this->getImageDetail($this->image_mobile),
                'default_parent' => $this->default_parent
            ];
        });
    }

    public function transformNode($conditions = ['options' => []]): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'image' => $this->getImageDetail($this->image),
            'image_mobile' => $this->getImageDetail($this->image_mobile),
            'default_parent' => $this->default_parent
        ];

        if ($conditions['options'] && count($conditions['options']) > 0) {
            $data['active'] = in_array($this->id, $conditions['options']);
        }

        if ($this->parent_id === 0) {
            $nodes = $this->nodes->where('is_filter', true)
                ->sortBy('position')
                ->values();
            $data['nodes'] = $nodes->map(function ($item) use ($conditions) {
                $optionIds = $conditions['options'] ?? [];
                return $item->transformNode(['options' => $optionIds]);
            });
        }

        return $data;
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'slug' => $this->seo_slug ?? $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->getImageDetail($this->image),
            'image_mobile' => $this->getImageDetail($this->image_mobile),
        ];
    }

    public function transformNav($conditions = [])
    {
        $products = [];

        if (isset($conditions['position']) && $conditions['position'] == 'top-homepage') {
            $nodes = $this->nodes
                ->where('status', self::STATUS_ACTIVE)
                ->sortBy(
                    fn($item)
                    => $item['homepage_position'] === NULL || $item['homepage_position'] === 0
                        ? PHP_INT_MAX
                        : $item['homepage_position']
                )
                ->take(5)
                ->values()
                ->map(fn($item) => $item->transform());
        } else if (isset($conditions['position']) && $conditions['position'] == 'menu-header') {
            $products = $this->products
                ->where('status', self::STATUS_ACTIVE)
                ->sortBy([['id', 'desc']])
                ->take(5)
                ->values()
                ->map(fn($item) => $item->transform());

            $nodes = $this->nodes
                ->where('status', self::STATUS_ACTIVE)
                ->where('menu_position', '>', 0)
                ->sortBy(['menu_position', 'ASC'])
                ->values()
                ->map(fn($item) => $item->transformNav(['position' => 'menu-header']));
        } else if (isset($conditions['position']) && $conditions['position'] == 'menu-footer') {
            $nodes = $this->nodes
                ->where('status', self::STATUS_ACTIVE)
                ->where('footer_position', '>', 0)
                ->sortBy(['footer_position', 'ASC'])
                ->values()
                ->map(fn($item) => $item->transformNav(['position' => 'menu-footer']));
        } else {
            $nodes = $this->nodes
                ->where('status', self::STATUS_ACTIVE)
                ->values()
                ->map(fn($item) => $item->transformNav());
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'url' => $this->url,
            'nodes' => $nodes,
            'products' => $products,
            'image' => $this->getImageDetail($this->image),
            'image_mobile' => $this->getImageDetail($this->image_mobile),
            'default_parent' => $this->default_parent
        ];
    }

    public function transformDetails($conditions = ['banner' => false])
    {
        return [
            'id' => $this->id,
            'slug' => $this->seo_slug ?? $this->slug,
            'title' => $this->title,
            'image' => $this->getImageDetail($this->image),
            'description' => $this->description,
            'banner' => $this->getBanner($conditions),
            'breadcrumbs' => $this->transformAsBreadcrumb($this),
            'default_parent' => $this->default_parent
        ];
    }

    public function getImageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function getBanner($conditions = ['banner' => false])
    {
        $banner = collect($this->banner)->map(function ($item) {
            return [
                'image_url' => isset($item['image']['path']) ? static_url($item['image']['path']) : null,
                'image_mobile_url' => isset($item['image_mobile']['path']) ? static_url($item['image_mobile']['path']) : null,
                'link' => isset($item['link']) ? $item['link'] : null
            ];
        });

        if ($banner->count() == 0 && $conditions['banner']) {
            $banner = $this->parent->banner
                ?? $this->parent->parent->banner
                ?? $this->parent->parent->parent->banner
                ?? [];

            $banner = collect($banner)->map(function ($item) {
                return [
                    'image_url' => isset($item['image']['path']) ? static_url($item['image']['path']) : null,
                    'image_mobile_url' => isset($item['image_mobile']['path']) ? static_url($item['image_mobile']['path']) : null,
                    'link' => isset($item['link']) ? $item['link'] : null
                ];
            });
        }

        return $banner;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereParent($query)
    {
        return $query->whereNull('parent_id')
            ->orWhere('parent_id', 0);
    }


    public function scopeWhereHomepage($query)
    {
        return $query->where(function ($query) {
            $query->whereNotNull('homepage_position')->where('homepage_position', '>', 0);
        })
            ->orderBy('homepage_position', 'asc')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereFeatured($query)
    {
        return $query->where(function ($query) {
            $query->whereNotNull('featured_position')->where('featured_position', '>', 0);
        })
            ->orderBy('featured_position', 'asc')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereMenuHeader($query)
    {
        return $query->where(function ($query) {
            $query->where('parent_id', 0)
                ->whereNotNull('menu_position')->where('menu_position', '>', 0);
        })
            ->orderBy('menu_position', 'asc')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereMenuFooter($query)
    {
        return $query->where(function ($query) {
            $query->where('parent_id', 0)
                ->whereNotNull('footer_position')
                ->where('footer_position', '>', 0);
        })
            ->orderBy('footer_position', 'asc')
            ->orderBy('id', 'desc');
    }

    public function getDefaultParentAttribute()
    {
        if (!empty($this->parent)) {
            return $this->parent->transform();
        }
        return null;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];

        if ($this->status == self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                // Lấy ID của category hiện tại
                $categoryId = $this->id;  // Hoặc bạn có thể lấy từ một thuộc tính khác tùy vào cấu trúc của bạn

                // Tạo URL với tham số 'categories' là ID động
                $urls[strtoupper($translation->locale)] = route("$translation->locale.products.index", [
                    'categories' => $categoryId,  // Thêm ID category vào URL
                ]);
            }
        }

        return $urls;
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
