<?php

namespace App\Models\Lotus;

use Illuminate\Database\Eloquent\Model;

class LotusProductTranslation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'locale',
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

    protected $casts = [
        'sections'   => 'array',
        'highlights' => 'array',
    ];
}
