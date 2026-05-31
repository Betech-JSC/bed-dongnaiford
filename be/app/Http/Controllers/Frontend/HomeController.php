<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Lotus\LotusBanner;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusTeam;
use App\Models\Lotus\LotusSponsor;
use App\Models\Lotus\LotusReview;
use App\Models\Post\Post;
use App\Models\Lotus\LotusActivity;
use App\Models\Lotus\LotusAward;

class HomeController extends Controller
{
    public function index()
    {
        try {
            $locale = current_locale();

            $bannerHero = LotusBanner::query()
                ->where('status', LotusBanner::STATUS_ACTIVE)
                ->whereJsonContains('location', LotusBanner::LOCATION_HOMEPAGE)
                ->sortByPosition()
                ->get(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link'])
                ->map(fn($banner) => [
                    'id'               => $banner->id,
                    'title'            => $banner->title,
                    'subtitle'         => $banner->subtitle,
                    'image_url'        => $banner->image_url,
                    'image_mobile_url' => $banner->image_mobile_url,
                    'video_url'        => $banner->video_url,
                    'button_text'      => $banner->button_text,
                    'button_link'      => $banner->button_link,
                ]);

            // Banner giới thiệu Học Viện 
            $bannerEdu = LotusBanner::query()
                ->where('status', LotusBanner::STATUS_ACTIVE)
                ->whereJsonContains('location', LotusBanner::LOCATION_HOMEPAGE_EDU)
                ->sortByPosition()
                ->first(['id', 'title', 'image', 'image_mobile', 'video']);

            $bannerEdu = $bannerEdu ? [
                'id'               => $bannerEdu->id,
                'title'            => $bannerEdu->title,
                'image_url'        => $bannerEdu->image_url,
                'image_mobile_url' => $bannerEdu->image_mobile_url,
                'video_url'        => $bannerEdu->video_url,
            ] : null;

            // Banner quảng cáo / Giáo trình quốc tế
            $bannerAdvise = LotusBanner::query()
                ->where('status', LotusBanner::STATUS_ACTIVE)
                ->whereJsonContains('location', LotusBanner::LOCATION_HOMEPAGE_HERO)
                ->sortByPosition()
                ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);

            $bannerAdvise = $bannerAdvise ? [
                'id'               => $bannerAdvise->id,
                'title'            => $bannerAdvise->title,
                'subtitle'         => $bannerAdvise->subtitle,
                'image_url'        => $bannerAdvise->image_url,
                'image_mobile_url' => $bannerAdvise->image_mobile_url,
                'video_url'        => $bannerAdvise->video_url,
                'button_text'      => $bannerAdvise->button_text,
                'button_link'      => $bannerAdvise->button_link,
            ] : null;

            // Đội ngũ nổi bật trên homepage
            $teams = LotusTeam::query()
                ->where('status', LotusTeam::STATUS_ACTIVE)
                ->sortByPosition()
                ->take(6)
                ->get()
                ->map(fn($t) => $t->toLocalizedSummary($locale));

            // Nhà tài trợ / đối tác
            $sponsors = LotusSponsor::query()
                ->where('status', LotusSponsor::STATUS_ACTIVE)
                ->sortByPosition()
                ->get(['id', 'name', 'logo', 'link'])
                ->map(fn($s) => [
                    'id'       => $s->id,
                    'name'     => $s->name,
                    'logo_url' => $s->logo_url,
                    'link'     => $s->link,
                ]);

            // Phản hồi học viên (homepage)
            $reviews = LotusReview::query()
                ->with(['product:id,title,slug', 'translations'])
                ->where('status', LotusReview::STATUS_ACTIVE)
                ->sortByPosition()
                ->take(10)
                ->get()
                ->map(fn($r) => array_merge($r->transform(), [
                    'course_title' => $r->product?->title,
                    'course_slug'  => $r->product?->slug,
                ]));

            // 3 khoá học nổi bật (is_hot) cho trang chủ
            $courses = LotusProduct::query()
                ->where('status', LotusProduct::STATUS_ACTIVE)
                ->where('is_hot', true)
                ->sortByPosition()
                ->take(3)
                ->get(['id', 'category_id', 'title', 'slug', 'image', 'author', 'author_title', 'author_avatar', 'price', 'price_sale'])
                ->map(fn($p) => [
                    'id'                => $p->id,
                    'title'             => $p->title,
                    'slug'              => $p->slug,
                    'image_url'         => $p->image_url,
                    'author'            => $p->author,
                    'author_title'      => $p->author_title,
                    'author_avatar_url' => $p->author_avatar_url,
                    'price'             => $p->price,
                    'price_sale'        => $p->price_sale,
                ]);

            // Hoạt động khóa học
            $activities = LotusActivity::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(fn($a) => $a->transform());

            $generalSettings = settings()->group('general')->all();
            $introduceBlock = [
                'title'       => $generalSettings['homepage_introduce_title'] ?? null,
                'description' => $generalSettings['homepage_introduce_description'] ?? null,
                'image_url'   => isset($generalSettings['homepage_introduce_image'])
                    ? static_url((is_array($generalSettings['homepage_introduce_image']) ? $generalSettings['homepage_introduce_image'] : json_decode($generalSettings['homepage_introduce_image'], true))['path'] ?? null)
                    : null,
                'video_url'   => isset($generalSettings['homepage_introduce_video'])
                    ? static_url((is_array($generalSettings['homepage_introduce_video']) ? $generalSettings['homepage_introduce_video'] : json_decode($generalSettings['homepage_introduce_video'], true))['path'] ?? null)
                    : null,
            ];

            // Bài viết nổi bật
            $posts = Post::query()
                ->active()
                ->where('type', Post::TYPE_POST)
                ->where('is_featured', 1)
                ->orderByPosition()
                ->take(10)
                ->get()
                ->map(fn($item) => $item->transform());

            // Chứng nhận / giải thưởng
            $certificates = LotusAward::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(fn($item) => $item->transform());


            $data = [
                'banner_hero'      => $bannerHero,
                'banner_edu'       => $bannerEdu,
                'banner_advise'    => $bannerAdvise,
                'introduce_block'  => $introduceBlock,
                'activities'       => $activities,
                'courses'          => $courses,
                'teams'            => $teams,
                'sponsors'         => $sponsors,
                'reviews'          => $reviews,
                'posts'            => $posts,
                'certificates'     => $certificates,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Home', $data);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function search()
    {
        try {
            if (request()->wantsJson()) {
                return response()->json([]);
            }

            if (request()->has('keyword') && !request()->has('page')) {
                $searchKeyword = \App\Models\Keyword::firstOrCreate(['keyword' => request()->input('keyword')]);
                $searchKeyword->update(['updated_at' => now()]);
                \App\Models\KeywordRefDate::create(['keyword_id' => $searchKeyword->id]);
            }

            return Inertia::render('Search', []);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function searchV2()
    {
        return response()->json([
            'success' => true,
            'data'    => [],
            'message' => 'ok',
        ], 200);
    }

    public function factory()
    {
        return Inertia::render('Factory', []);
    }
}
