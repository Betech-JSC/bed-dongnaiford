<?php

namespace App\Http\Controllers\Backend;

use App\Models\Post\Post;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class PostController extends Controller
{
    use HasCrudActions;
    public $model = Post::class;

    public $with = [
        'form' => ['relatedPosts']
    ];

    private function beforeIndex($query)
    {
        return $query->where('type', Post::TYPE_POST)
            ->orderBy('id', 'DESC');
    }

    private function beforeStore($request, $rules)
    {
        $request->merge(['type' => Post::TYPE_POST]);

        if ($request->has('related_urls')) {
            $urlsString = $request->input('related_urls');
            $lines = array_filter(array_map('trim', explode("\n", $urlsString)));
            $resolvedIds = [];

            foreach ($lines as $line) {
                $path = parse_url($line, PHP_URL_PATH);
                $slug = trim($path ?: $line, '/');

                if (!empty($slug)) {
                    $decodedSlug = rawurldecode($slug);
                    $encodedSlug = rawurlencode($decodedSlug);

                    $postId = \DB::table('post_translations')
                        ->where(function($q) use ($decodedSlug, $encodedSlug) {
                            $q->where('slug', $decodedSlug)
                              ->orWhere('slug', $encodedSlug)
                              ->orWhere('seo_slug', $decodedSlug)
                              ->orWhere('seo_slug', $encodedSlug);
                        })
                        ->value('post_id');

                    if ($postId) {
                        $resolvedIds[] = ['id' => $postId];
                    }
                }
            }

            $request->merge(['related_posts' => $resolvedIds]);
        }

        return $rules;
    }

    public function generatePostByAI(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:1000',
            'tone' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:10',
            'keywords' => 'nullable|string|max:500',
            'outline' => 'nullable|string|max:2000',
        ]);

        $gemini = new \App\Services\GeminiService();
        $result = $gemini->generateArticle($request->all());

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data']
        ]);
    }

    private function afterForm($item)
    {
        if (is_array($item)) {
            $itemId = $item['id'] ?? null;
        } else {
            $itemId = $item->id ?? null;
        }

        $redirectUrls = '';
        if ($itemId) {
            $post = Post::find($itemId);
            if ($post) {
                $urls = [];
                foreach ($post->translations as $trans) {
                    $slug = $trans->seo_slug ?: $trans->slug;
                    if ($slug) {
                        $urls[] = trim($trans->getRelativeUrlForSlug($slug), '/');
                    }
                }
                
                if (!empty($urls)) {
                    $redirectUrls = \DB::table('redirects')
                        ->whereIn('new_url', $urls)
                        ->pluck('old_url')
                        ->implode("\n");
                }
            }
        }

        if (is_array($item)) {
            $item['redirect_urls'] = $redirectUrls;
        } else {
            $item->redirect_urls = $redirectUrls;
        }

        return $item;
    }

    private function afterStore($request, $resource)
    {
        revalidate_frontend();

        if ($request->has('redirect_urls')) {
            $urlsString = $request->input('redirect_urls');
            $lines = array_filter(array_map('trim', explode("\n", $urlsString)));
            $lines = array_map(function($line) {
                $path = trim(parse_url($line, PHP_URL_PATH), '/');
                $parts = array_map(function($part) {
                    return \Illuminate\Support\Str::slug($part);
                }, explode('/', $path));
                return implode('/', array_filter($parts));
            }, $lines);
            $lines = array_filter($lines);

            $urls = [];
            foreach ($resource->translations as $trans) {
                $slug = $trans->seo_slug ?: $trans->slug;
                if ($slug) {
                    $urls[strtoupper($trans->locale)] = trim($trans->getRelativeUrlForSlug($slug), '/');
                }
            }

            $defaultTarget = $urls['VI'] ?? ($urls['EN'] ?? null);

             if ($defaultTarget) {
                // Get the old_urls before deleting them to clear cache!
                $deletedUrls = \DB::table('redirects')
                    ->whereIn('new_url', array_values($urls))
                    ->whereNotIn('old_url', $lines)
                    ->pluck('old_url');

                foreach ($deletedUrls as $oldUrl) {
                    \Illuminate\Support\Facades\Cache::forget('redirect_lookup_' . md5($oldUrl));
                }

                \DB::table('redirects')
                    ->whereIn('new_url', array_values($urls))
                    ->whereNotIn('old_url', $lines)
                    ->delete();

                foreach ($lines as $line) {
                    $target = $defaultTarget;
                    if (str_starts_with($line, 'en/') || str_contains($line, '/en/')) {
                        $target = $urls['EN'] ?? $defaultTarget;
                    }

                    // TỐI ƯU SEO: Tránh vòng lặp chuyển hướng (redirect to self)
                    if ($line === $target || in_array($line, array_values($urls))) {
                        continue;
                    }

                    \JamstackVietnam\Redirect\Models\Redirect::updateOrCreate(
                        ['old_url' => $line],
                        [
                            'new_url' => $target,
                            'status_code' => 301,
                            'is_active' => true
                        ]
                    );

                    // Xóa cache tương ứng khi cập nhật/thêm redirect
                    \Illuminate\Support\Facades\Cache::forget('redirect_lookup_' . md5($line));
                }
            }
        }

        return $resource;
    }
}
