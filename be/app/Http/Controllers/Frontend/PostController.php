<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use App\Models\Vehicle\Banner;
use Inertia\Inertia;
use Illuminate\Routing\Controller;


class PostController extends Controller
{
    public $model = Post::class;

    public function index()
    {
        try {
            $posts = Post::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->filter(request()->all())
                ->paginate(9)
                ->onEachSide(0)
                ->through(function ($item) {
                    return $item->transform();
                })
                ->withQueryString();

            $categories = PostCategory::query()
                ->active()
                ->get()
                ->map(fn($item) => $item->transform());

            $topPosts = Post::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->orderByPosition()
                ->orderBy('id', 'desc')
                ->take(4)
                ->get()
                ->map(fn($item) => $item->transform());

            $banners = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->whereJsonContains('location', Banner::LOCATION_NEWS)
                ->sortByPosition()
                ->get()
                ->map(fn($b) => [
                    'id'              => $b->id,
                    'title'           => $b->title,
                    'subtitle'        => $b->subtitle,
                    'image_url'       => $b->image_url,
                    'image_mobile_url'=> $b->image_mobile_url,
                    'video_url'       => $b->video_url,
                    'button_text'     => $b->button_text,
                    'button_link'     => $b->button_link,
                ]);

            $data = [
                'categories' => $categories,
                'top_posts'  => $topPosts,
                'posts'      => $posts,
                'banners'    => $banners,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Posts/Index', $data);
        } catch (\Throwable $th) {
            \Log::error('PostController@index: ' . $th->getMessage());
            abort(500);
        }
    }

    public function show($slug)
    {
        try {
            $post = $this->model::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->whereSlug($slug)
                ->firstOrFail();

            $post->increment('view_count');

            $relatedPosts = $post->related();

            $data = [
                'post'          => $post->transformDetails(),
                'related_posts' => $relatedPosts,
                'seo'           => $post->transformSeo(),
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Posts/Show', $data)
                ->withViewData(['seo' => $post->transformSeo()]);
        } catch (\Throwable $th) {
            \Log::error('PostController@show: ' . $th->getMessage(), ['slug' => $slug]);
            abort(404);
        }
    }


    public function relatedPosts($postId)
    {
        $post = Post::query()
            ->where('type', Post::TYPE_POST)
            ->setEagerLoads([])
            ->with('relatedPosts', 'categories')
            ->find($postId);

        $items = $post->relatedPosts()
            ->active()
            ->get()
            ->map(fn($item) => $item->transform());

        if ($items->count() == 0) {
            $category = $post->categories
                ->where('status', PostCategory::STATUS_ACTIVE)
                ->values()
                ->first();

            $items = Post::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->whereHas('categories', function ($query) use ($category) {
                    $query->where('post_categories.id', $category?->id);
                })
                ->orderByPosition()
                ->orderBy('id', 'desc')
                ->take(8)
                ->get()
                ->map(fn($item) => $item->transform());
        }

        return response()->json([
            'success' => true,
            'data' => $items,
            'message' => 'OK',
        ], 200);
    }
}