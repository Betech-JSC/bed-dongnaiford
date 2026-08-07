<?php

namespace App\Models\Post;

use JamstackVietnam\Blog\Models\PostTranslation as BasePost;


class PostTranslation extends BasePost
{
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LOCALE_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];
    public $fillable = [
        'slug',
        'locale',
        'status_locale',
        'title',
        'author',
        'description',
        'content',
        'sliders',

        'seo_meta_title',
        'seo_focus_keyword',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function getRelativeUrlForSlug($slug)
    {
        $post = \App\Models\Post\Post::find($this->post_id);
        if (!$post) {
            return $slug;
        }

        if ($post->type === 'SERVICE') {
            return $this->locale === 'vi' ? "dich-vu/{$slug}" : "services/{$slug}";
        }
        
        return $this->locale === 'vi' ? "tin-tuc/{$slug}" : "posts/{$slug}";
    }

    protected static function booted()
    {
        static::updating(function ($translation) {
            if ($translation->isDirty('slug') || $translation->isDirty('seo_slug')) {
                $oldSlug = $translation->getOriginal('seo_slug') ?: $translation->getOriginal('slug');
                $newSlug = $translation->seo_slug ?: $translation->slug;
                
                if ($oldSlug && $newSlug && $oldSlug !== $newSlug) {
                    $oldUrl = $translation->getRelativeUrlForSlug($oldSlug);
                    $newUrl = $translation->getRelativeUrlForSlug($newSlug);
                    
                    if (\Illuminate\Support\Facades\Schema::hasTable('redirects')) {
                        $oldUrl = trim($oldUrl, '/');
                        $newUrl = trim($newUrl, '/');
                        
                        if ($oldUrl !== $newUrl) {
                            \JamstackVietnam\Redirect\Models\Redirect::updateOrCreate(
                                ['old_url' => $oldUrl],
                                [
                                    'new_url' => $newUrl,
                                    'status_code' => 301,
                                    'is_active' => true
                                ]
                            );
                        }
                    }
                }
            }
        });
    }
}
