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
        // Filter out bad post slugs (emoji, numeric-only, overly long, discontinued)
        $posts = Post::active()
            ->get()
            ->filter(function ($p) {
                $slug = $p->slug;
                if (empty($slug) || is_numeric($slug)) return false;
                if (str_contains($slug, '%f0%9f') || str_contains($slug, 'emoji')) return false;
                if (str_contains($slug, '%e2%9c')) return false; // checkmark emojis
                if (mb_strlen($slug) > 100) return false; // stricter slug length
                // Filter discontinued vehicle content
                if (str_contains($slug, 'ecosport')) return false;
                if (str_contains($slug, 'ford-focus')) return false;
                return true;
            });

        // Classify posts by age for priority + changefreq
        $posts->each(function ($p) {
            $lastUpdate = $p->updated_at ?? $p->created_at;
            $ageMonths = now()->diffInMonths($lastUpdate);

            if ($ageMonths <= 1) {
                // Fresh content: high priority, daily crawl
                $p->priority = 0.8;
                $p->changeFrequency = 'daily';
            } elseif ($ageMonths <= 6) {
                // Recent content: medium priority, weekly crawl
                $p->priority = 0.7;
                $p->changeFrequency = 'weekly';
            } else {
                // Old content: lower priority, monthly crawl
                $p->priority = 0.5;
                $p->changeFrequency = 'monthly';
            }
        });

        // Get active vehicles with highest priority (money pages)
        $vehicles = Vehicle::where('status', Vehicle::STATUS_ACTIVE)->get();
        $vehicles->each(function ($v) {
            $v->priority = 0.9;
            $v->changeFrequency = 'weekly';
        });

        // Get active vehicle categories
        $categories = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)->get();
        $categories->each(function ($c) {
            $c->priority = 0.7;
            $c->changeFrequency = 'weekly';
        });

        return Sitemap::create()
            ->addStaticRoutes()
            ->add($posts)
            ->add($vehicles)
            ->add($categories)
            ->render();
    }
}
