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
}
