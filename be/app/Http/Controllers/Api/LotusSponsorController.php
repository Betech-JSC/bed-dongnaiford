<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Lotus\LotusSponsor;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusSponsorController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/lotus/sponsors
     */
    public function index(): JsonResponse
    {
        $sponsors = LotusSponsor::query()
            ->where('status', LotusSponsor::STATUS_ACTIVE)
            ->sortByPosition()
            ->get(['id', 'name', 'logo', 'link'])
            ->map(fn($s) => [
                'id'       => $s->id,
                'name'     => $s->name,
                'logo_url' => $s->logo_url,  // URL string
                'link'     => $s->link,
            ]);

        return $this->success($sponsors);
    }
}
