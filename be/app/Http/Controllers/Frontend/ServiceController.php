<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Service;
use JamstackVietnam\Slider\Models\Slider;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::query()
            ->active()
            ->sortByPosition()
            ->get()
            ->map(fn($item) => $item->transform());

        $banner = Slider::getByPosition('BANNER_SERVICE');

        $data = [
            'services' => $services,
            'banner' => $banner
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Services/Index', $data);
    }

    public function show($slug)
    {
        $service = Service::query()
            ->active()
            ->whereSlug($slug)
            ->firstOrFail();

        $service->increment('view_count');

        $services = Service::query()
            ->active()
            ->where('id', '<>', $service->id)
            ->sortByPosition()
            ->get()
            ->map(fn($item) => $item->transform());

        $data = [
            'services' => $services,
            'service' => $service->transformDetails(),
            'seo' => $service->transformSeo()
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Services/Show', $data)
            ->withViewData(['seo' => $data['seo']]);
    }
}
