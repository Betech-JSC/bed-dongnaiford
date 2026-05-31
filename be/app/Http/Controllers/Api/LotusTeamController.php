<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Lotus\LotusTeam;
use JamstackVietnam\Core\Traits\ApiResponse;

class LotusTeamController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/lotus/teams
     * Danh sách đội ngũ — có thể filter theo department
     * ?department=chuyen-vien
     */
    public function index(Request $request): JsonResponse
    {
        $locale = current_locale();

        $query = LotusTeam::query()
            ->where('status', LotusTeam::STATUS_ACTIVE)
            ->sortByPosition();

        if ($department = $request->query('department')) {
            $query->where('department', $department);
        }

        $teams = $query
            ->get()
            ->map(fn($t) => $t->toLocalizedSummary($locale));

        return $this->success($teams);
    }

    /**
     * GET /api/lotus/teams/{slug}
     * Chi tiết thành viên đội ngũ
     */
    public function show(string $slug): JsonResponse
    {
        $locale = current_locale();

        $member = LotusTeam::query()
            ->where('status', LotusTeam::STATUS_ACTIVE)
            ->whereSlug($slug, $locale)
            ->first();

        if (!$member) {
            return $this->error(__('Không tìm thấy thành viên'), 404);
        }

        return $this->success($member->toLocalizedDetail($locale));
    }
}
