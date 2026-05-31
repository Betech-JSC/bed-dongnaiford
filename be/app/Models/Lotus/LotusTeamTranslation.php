<?php

namespace App\Models\Lotus;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class LotusTeamTranslation extends BaseModel
{
    use Sluggable;

    public $timestamps  = false;
    public $slugAttribute = 'name';

    public $fillable = [
        'lotus_team_id',
        'locale',
        'name',
        'slug',
        'job_title',
        'short_bio',
        'bio',
    ];

    public function lotusTeam()
    {
        return $this->belongsTo(LotusTeam::class);
    }
}
