<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\LandingPage;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\Vehicle;
use App\Models\Post\Post;
use JamstackVietnam\Core\Traits\ApiResponse;

class LandingPageApiController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/ldp/lookup-domain
     */
    public function lookupDomain(Request $request): JsonResponse
    {
        $domain = $request->query('domain');
        if (!$domain) {
            return $this->failure(__('Thiếu tham số domain'), 400);
        }

        // Loại bỏ http://, https://, www. và các ký tự chéo nếu có
        $domain = preg_replace('/^https?:\/\/(www\.)?/', '', $domain);
        $domain = preg_replace('/^www\./', '', $domain);
        $domain = rtrim($domain, '/');

        // Tìm Sales Consultant sở hữu domain này
        $consultant = SalesConsultant::query()
            ->where('custom_domain', $domain)
            ->where('status', SalesConsultant::STATUS_ACTIVE)
            ->first();

        if (!$consultant) {
            return $this->success([
                'found' => false
            ]);
        }

        // Lấy slug tiếng Việt làm mặc định
        $salesSlug = $consultant->translate('vi')?->slug ?: $consultant->slug;

        return $this->success([
            'found' => true,
            'sales_slug' => $salesSlug,
        ]);
    }

    /**
     * GET /api/ldp/{sales_slug}/{vehicle_slug}
     */
    public function show(string $sales_slug, string $vehicle_slug): JsonResponse
    {
        $locale = current_locale();

        // 1. Tìm Sales Consultant
        $consultant = SalesConsultant::query()
            ->where('status', SalesConsultant::STATUS_ACTIVE)
            ->whereSlug($sales_slug)
            ->first();

        // Fallback: nếu slug là 'ton' và không tìm thấy, thử tìm với slug 'toan'
        if (!$consultant && $sales_slug === 'ton') {
            $consultant = SalesConsultant::query()
                ->where('status', SalesConsultant::STATUS_ACTIVE)
                ->whereSlug('toan')
                ->first();
        }

        if (!$consultant) {
            return $this->failure(__('Không tìm thấy cố vấn bán hàng'), 404);
        }

        // 2. Tìm dòng xe
        $vehicle = Vehicle::query()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->whereSlug($vehicle_slug)
            ->with([
                'categories',
                'versions' => fn($q) => $q->where('status', 'ACTIVE')->sortByPosition()
            ])
            ->first();

        if (!$vehicle) {
            return $this->failure(__('Không tìm thấy xe'), 404);
        }

        // 3. Tìm Landing Page tương ứng
        $ldp = LandingPage::query()
            ->where('status', LandingPage::STATUS_ACTIVE)
            ->where('sales_consultant_id', $consultant->id)
            ->where(function ($q) use ($vehicle) {
                $q->where('vehicle_id', $vehicle->id)
                  ->orWhereJsonContains('vehicle_ids', (int)$vehicle->id)
                  ->orWhereJsonContains('vehicle_ids', (string)$vehicle->id);
            })
            ->first();

        if (!$ldp) {
            return $this->failure(__('Không tìm thấy Landing Page của cố vấn bán hàng cho dòng xe này'), 404);
        }

        // 4. Giải mã / định dạng danh sách chương trình khuyến mãi
        $promotionsData = $this->resolvePromotions($ldp->promotions);

        // 5. Chuẩn hóa layout_blocks
        $layoutBlocks = $this->resolveLayoutBlocksUrls($ldp->layout_blocks);

        return $this->success([
            'id'                  => $ldp->id,
            'sales_consultant'    => $consultant->toLocalizedDetail($locale),
            'vehicle'             => [
                'id'            => $vehicle->id,
                'title'         => $vehicle->title,
                'slug'          => $vehicle->slug,
                'tagline'       => $vehicle->tagline,
                'base_price'    => $vehicle->base_price,
                'image'         => $vehicle->image,
                'image_url'     => $vehicle->image_url,
                'images'        => $vehicle->images,
                'video_url'     => $vehicle->video_url,
                'video'         => $vehicle->video,
                'versions'      => $vehicle->versions->map(fn($v) => [
                    'id'                  => $v->id,
                    'name'                => $v->name,
                    'price'               => $v->price,
                    'image_url'           => $v->image_url,
                    'image_thumbnail_url' => $v->image_thumbnail_url,
                    'specs'               => $v->specs ?? [],
                    'colors'              => collect($v->colors ?? [])->map(fn($c) => [
                        'name'       => $c['name'] ?? ($c['color_name'] ?? ''),
                        'hex'        => $c['hex'] ?? ($c['color_code'] ?? ''),
                        'image_path' => isset($c['image_path']) ? static_url($c['image_path']) : (isset($c['image']) ? $this->resolveFileUrl($c['image']) : null),
                    ])->toArray()
                ])
            ],
            'title'               => $ldp->title,
            'layout_blocks'      => $layoutBlocks,
            'promotions'          => $promotionsData,
            'seo' => [
                'meta_title'       => $ldp->seo_meta_title ?: $ldp->title,
                'meta_description' => $ldp->seo_meta_description ?: $vehicle->seo_meta_description,
                'meta_keywords'    => $ldp->seo_meta_keywords,
                'meta_robots'      => $ldp->seo_meta_robots ?: 'index, follow',
                'canonical'        => $ldp->seo_canonical,
                'image'            => $ldp->seo_image ? $this->resolveFileUrl($ldp->seo_image) : $vehicle->image_url,
                'seo_schemas'      => $ldp->seo_schemas,
            ]
        ]);
    }

    /**
     * Lấy danh sách khuyến mãi bao gồm khuyến mãi hệ thống và khuyến mãi tự nhập
     */
    private function resolvePromotions($promotions): array
    {
        $resolved = [
            'global' => [],
            'custom' => []
        ];

        if (!is_array($promotions)) return $resolved;

        // Khuyến mãi hệ thống (global)
        if (!empty($promotions['global_promotion_ids']) && is_array($promotions['global_promotion_ids'])) {
            $posts = Post::query()
                ->whereIn('id', $promotions['global_promotion_ids'])
                ->where('status', Post::STATUS_ACTIVE)
                ->get();
                
            $resolved['global'] = $posts->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'image_url' => $p->image ? $this->resolveFileUrl($p->image) : null,
                'description' => $p->description ?? '',
            ])->toArray();
        }

        // Khuyến mãi tự nhập (custom)
        if (!empty($promotions['custom_promotions']) && is_array($promotions['custom_promotions'])) {
            foreach ($promotions['custom_promotions'] as $custom) {
                $resolved['custom'][] = [
                    'title' => $custom['title'] ?? '',
                    'description' => $custom['description'] ?? '',
                    'image_url' => isset($custom['image']) ? $this->resolveFileUrl($custom['image']) : null,
                    'link' => $custom['link'] ?? ''
                ];
            }
        }

        return $resolved;
    }

    private function resolveLayoutBlocksUrls($blocks)
    {
        if (!is_array($blocks)) return $blocks;
        
        foreach ($blocks as $i => $block) {
            if (isset($block['type']) && isset($block['data'])) {
                if ($block['type'] === 'HeroBanner' && isset($block['data']['background_image'])) {
                    $blocks[$i]['data']['background_image'] = $this->resolveFileUrl($block['data']['background_image']);
                }
                if ($block['type'] === 'BookingBanner' && isset($block['data']['car_image'])) {
                    $blocks[$i]['data']['car_image'] = $this->resolveFileUrl($block['data']['car_image']);
                }
                if ($block['type'] === 'Promotions' && isset($block['data']['image'])) {
                    $blocks[$i]['data']['image'] = $this->resolveFileUrl($block['data']['image']);
                }
                if ($block['type'] === 'FeaturesGrid') {
                    if (isset($block['data']['image_1'])) {
                        $blocks[$i]['data']['image_1'] = $this->resolveFileUrl($block['data']['image_1']);
                    }
                    if (isset($block['data']['image_2'])) {
                        $blocks[$i]['data']['image_2'] = $this->resolveFileUrl($block['data']['image_2']);
                    }
                    if (isset($block['data']['image_3'])) {
                        $blocks[$i]['data']['image_3'] = $this->resolveFileUrl($block['data']['image_3']);
                    }
                    if (isset($block['data']['image_large'])) {
                        $blocks[$i]['data']['image_large'] = $this->resolveFileUrl($block['data']['image_large']);
                    }
                    if (isset($block['data']['image_large_2'])) {
                        $blocks[$i]['data']['image_large_2'] = $this->resolveFileUrl($block['data']['image_large_2']);
                    }
                    if (isset($block['data']['image_large_3'])) {
                        $blocks[$i]['data']['image_large_3'] = $this->resolveFileUrl($block['data']['image_large_3']);
                    }
                    if (isset($block['data']['split_image'])) {
                        $blocks[$i]['data']['split_image'] = $this->resolveFileUrl($block['data']['split_image']);
                    }
                }
                if ($block['type'] === 'FeaturesList' && isset($block['data']['features']) && is_array($block['data']['features'])) {
                    foreach ($block['data']['features'] as $fIndex => $feature) {
                        if (isset($feature['image'])) {
                            $blocks[$i]['data']['features'][$fIndex]['image'] = $this->resolveFileUrl($feature['image']);
                        }
                    }
                }
            }
        }
        return $blocks;
    }

    private function resolveFileUrl($file)
    {
        if (empty($file)) return null;
        if (is_array($file)) {
            if (isset($file['path'])) {
                $path = $file['path'];
                if (str_starts_with($path, 'uploads/')) {
                    $path = str_replace('uploads/', '', $path);
                }
                return static_url($path);
            }
            if (isset($file['url'])) {
                return $file['url'];
            }
        }
        if (is_string($file)) {
            if (str_starts_with($file, 'http://') || str_starts_with($file, 'https://') || str_starts_with($file, '/')) {
                return $file;
            }
            $path = $file;
            if (str_starts_with($path, 'uploads/')) {
                $path = str_replace('uploads/', '', $path);
            }
            return static_url($path);
        }
        return $file;
    }
}
