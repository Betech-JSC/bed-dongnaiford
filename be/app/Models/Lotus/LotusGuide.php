<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class LotusGuide extends BaseModel
{
    use SoftDeletes;

    protected $table = 'lotus_guides';

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    public const CATEGORY_LIST = [
        'general'  => 'Tổng quan',
        'posts'    => 'Bài viết',
        'products' => 'Khóa học',
        'media'    => 'Quản lý tệp',
        'settings' => 'Cấu hình hệ thống',
        'users'    => 'Quản trị viên & Phân quyền',
        'other'    => 'Khác',
    ];

    protected $fillable = [
        'title',
        'slug',
        'icon',
        'summary',
        'content',
        'video_url',
        'category',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $model) {
            if (empty($model->slug) && !empty($model->title)) {
                $base = Str::slug($model->title);
                $slug = $base;
                $i    = 1;
                while (static::where('slug', $slug)->where('id', '!=', $model->id ?? 0)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $model->slug = $slug;
            }
        });
    }

    public function rules(): array
    {
        return [
            'title'     => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255',
            'summary'   => 'nullable|string',
            'content'   => 'nullable|string',
            'video_url' => 'nullable|url|max:500',
            'category'  => 'nullable|string',
            'icon'      => 'nullable|string|max:100',
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
