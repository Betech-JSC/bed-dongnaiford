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
        // Filter out bad post slugs (emoji, numeric-only, overly long)
        $posts = Post::active()
            ->get()
            ->filter(function ($p) {
                $slug = $p->slug;
                if (empty($slug) || is_numeric($slug)) return false;
                if (str_contains($slug, '%f0%9f') || str_contains($slug, 'emoji')) return false;
                if (str_contains($slug, '%e2%9c')) return false; // checkmark emojis
                if (mb_strlen($slug) > 120) return false; // overly long slugs
                return true;
            });

        // Get active vehicles with higher priority
        $vehicles = Vehicle::where('status', Vehicle::STATUS_ACTIVE)->get();
        $vehicles->each(function ($v) {
            $v->priority = 0.9; // Vehicles get high priority
        });

        // Get active vehicle categories
        $categories = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)->get();
        $categories->each(function ($c) {
            $c->priority = 0.8;
        });

        return Sitemap::create()
            ->addStaticRoutes()
            ->add($posts)
            ->add($vehicles)
            ->add($categories)
            ->render();
    }
}
