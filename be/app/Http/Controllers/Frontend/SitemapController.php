<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Sitemap\Sitemap;

class SitemapController extends Controller
{
    public function index()
    {
        $posts = Post::active()
            ->get()
            ->filter(function ($p) {
                $slug = $p->slug;
                if (empty($slug) || is_numeric($slug)) return false;
                if (str_contains($slug, '%f0%9f') || str_contains($slug, 'emoji')) return false;
                return true;
            });

        return Sitemap::create()
            ->addStaticRoutes()
            ->add($posts)
            ->add(Vehicle::where('status', Vehicle::STATUS_ACTIVE)->get())
            ->add(VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)->get())
            ->render();
    }
}
