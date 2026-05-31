<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Vehicle\SalesConsultant;

class TeamController extends Controller
{
    /**
     * GET /tu-van-vien/{slug} — Trang chi tiết cố vấn bán hàng
     */
    public function show(string $slug)
    {
        try {
            $locale = current_locale();

            $member = SalesConsultant::query()
                ->where('status', SalesConsultant::STATUS_ACTIVE)
                ->whereSlug($slug, $locale)
                ->firstOrFail();

            // Các cố vấn khác (sidebar)
            $otherMembers = SalesConsultant::query()
                ->where('status', SalesConsultant::STATUS_ACTIVE)
                ->where('id', '!=', $member->id)
                ->sortByPosition()
                ->get()
                ->map(fn($m) => $m->toLocalizedSummary($locale));

            $data = [
                'member' => $member->toLocalizedDetail($locale),
                'other_members' => $otherMembers,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            $translation = $member->translate($locale);
            $seo = [
                'seo_meta_title'       => ($translation?->name ?? $member->name ?? '') . ' - Cố vấn bán hàng tại Ford Đồng Nai',
                'seo_meta_description' => mb_substr(strip_tags($translation?->short_bio ?? $translation?->bio ?? ''), 0, 160),
                'seo_canonical'        => url()->current(),
            ];

            return Inertia::render('Member', $data)
                ->withViewData(['seo' => $seo]);
        } catch (\Throwable $th) {
            \Log::error('TeamController@show: ' . $th->getMessage(), ['slug' => $slug]);
            abort(404);
        }
    }
}
