<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    @php
        $global = cache_response(
            'global_settings',
            function () {
                return settings()
                    ->group('general')
                    ->all();
            },
            'settings',
        );
    @endphp

    <!-- Custom Header Tag -->
    @php
        echo $global['inject_head'] ?? null;
    @endphp
    <!-- End Custom Header Tag -->

    @php
        $url = url()->current();

        $businessName = $global['general_business_name'] ?? null;
        $separator = $global['seo_title_separator'] ?? null;

        $site = $global['seo_site_name'] ?? null;
        $canonical = $seo['seo_canonical'] ?? $url;

        $title = $seo['seo_meta_title'] ?? ($global['seo_meta_title'] ?? env('APP_NAME'));
        $description = $seo['seo_meta_description'] ?? ($global['seo_meta_description'] ?? null);
        $robots = $seo['seo_meta_robots'] ?? ($global['seo_meta_robots'] ?? 'index');
        $image = $seo['seo_image'] ?? ($global['seo_image'] ?? config('app.url') . '/cover.jpg');
        $keywords = $seo['seo_meta_keywords'] ?? ($global['seo_meta_keywords'] ?? null);

        if ($title) {
            SEOMeta::setTitle($title);
            SEO::setTitle($title);
            SEO::jsonLd()->setTitle($title);
        }

        if ($description) {
            SEOMeta::setDescription($description);
            SEO::setDescription($description);
            SEO::jsonLd()->setDescription($description);
        }

        if ($keywords) {
            SEOMeta::addKeyword($keywords);
            SEO::metatags()->setKeywords($keywords);
        }

        if ($robots) {
            SEOMeta::setRobots($robots);
            SEO::metatags()->setRobots($robots);
        }

        if ($image) {
            SEO::opengraph()->addImage($image);
            SEO::jsonLd()->setImage($image);
        }

        if ($site) {
            SEO::opengraph()->setSiteName($site);
            SEO::twitter()->setSite($site);
            SEO::jsonLd()->setSite($site);
        }

        SEOMeta::setCanonical($url);
        SEO::opengraph()->setUrl($url);
        SEO::setCanonical($canonical);
        SEO::jsonLd()->setUrl($url);
    @endphp

    {!! SEO::generate() !!}

    @isset($schemas)
        @foreach ($schemas as $schema)
            <script type="application/ld+json">
                {!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
            </script>
        @endforeach
    @endisset

    <script src="/build/frontend/registerSW.js"></script>

    <link rel="stylesheet" href="/assets/js/flickity/flickity.min.css" />
    <script src="/assets/js/flickity/flickity.pkgd.min.js"></script>

    <!-- CSS -->
    <style>
        /* flickity-fade */
        .flickity-enabled.is-fade .flickity-slider > * {
            pointer-events: none;
            z-index: 0;
        }

        .flickity-enabled.is-fade .flickity-slider > .is-selected {
            pointer-events: auto;
            z-index: 1;
        }
    </style>

    <!-- JS -->
    <script src="https://unpkg.com/flickity-fade@2/flickity-fade.js"></script>

    {{ Vite::useHotFile(public_path('vite.frontend.hot'))->useBuildDirectory('build/frontend')->withEntryPoints(['resources/Frontend/js/app.js']) }}
    @inertiaHead

    <!-- @routes('frontend') -->
</head>

<body>
    <!-- Custom Header Body Tag -->
    @if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome-Lighthouse') === false)
        @php
            echo $global['inject_body_start'] ?? null;
        @endphp
    @endif
    <!-- End Custom Header Body Tag -->

    @inertia

    <!-- Custom Footer Body Tag -->
    @if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome-Lighthouse') === false)
        @php
            echo $global['inject_body_end'] ?? null;
        @endphp
    @endif
    <!-- End Custom Footer Body Tag -->
</body>

</html>
