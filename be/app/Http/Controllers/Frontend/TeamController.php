<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Lotus\LotusTeam;

class TeamController extends Controller
{
    /**
     * GET /giang-vien/{slug} — Trang chi tiết giảng viên
     */
    public function show(string $slug)
    {
        try {
            $locale = current_locale();

            $member = LotusTeam::query()
                ->where('status', LotusTeam::STATUS_ACTIVE)
                ->whereSlug($slug, $locale)
                ->firstOrFail();

            // Các thành viên khác (sidebar)
            $otherMembers = LotusTeam::query()
                ->where('status', LotusTeam::STATUS_ACTIVE)
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

            return Inertia::render('Member', $data);
        } catch (\Throwable $th) {
            \Log::error('TeamController@show: ' . $th->getMessage(), ['slug' => $slug]);
            abort(404);
        }
    }
}
