<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use JamstackVietnam\Agency\Models\Agency;
use JamstackVietnam\Slider\Models\Slider;

class AgencyController extends Controller
{
    public function index()
    {
        $agencies = Agency::query()
            ->active()
            ->SortByPosition()
            ->get()
            ->groupBy('region')
            ->map(function ($item, $key) {
                return [
                    'region_key' => $key,
                    'region_title' =>  __('agency.region.' . $key, [], current_locale()),
                    'agencies' => $item->map(function ($agency) {
                        return [
                            'title' => $agency['title'],
                            'phone' => $agency['info']['phone'],
                            'email' => $agency['info']['email'],
                            'location' => $agency['location'],
                            'link_google_map' => $agency['link_google_map'],
                            'code' => $agency['code'],
                        ];
                    })
                ];
            })
            ->sortBy(
                fn ($item)
                => $item['region_key'] === 'mien_nam' ? 0
                    : ($item['region_key'] === 'mien_trung' ? 1 : 2)
            )
            ->values();

        $data = [
            'agencies' => $agencies
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Contact', $data);
    }
}
