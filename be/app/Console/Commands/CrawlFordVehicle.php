<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\Accessory;
use App\Services\FirecrawlService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CrawlFordVehicle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:crawl-ford {url? : The Ford VN vehicle URL to crawl} 
                            {--category_id= : The ID of the category to assign the vehicle to} 
                            {--test-connection : Test the Firecrawl API key connection}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawl vehicle specifications, versions, colors, 360 views, and accessories from ford.com.vn using Firecrawl';

    protected FirecrawlService $firecrawlService;

    public function __construct(FirecrawlService $firecrawlService)
    {
        parent::__construct();
        $this->firecrawlService = $firecrawlService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if ($this->option('test-connection')) {
            return $this->testConnection();
        }

        $url = $this->argument('url');
        if (empty($url)) {
            $this->error('Please provide a Ford VN vehicle URL (e.g. https://www.ford.com.vn/showroom/suvs/ford-territory/).');
            return Command::FAILURE;
        }

        $this->info("=== Starting Crawl & Sync process ===");
        $this->info("Target URL: {$url}");

        // 1. Fetch data from Firecrawl
        $this->info("Fetching and extracting data from Firecrawl API (this might take up to 2 minutes)...");
        $data = $this->firecrawlService->scrapeVehicle($url);

        if (empty($data)) {
            $this->error('Failed to extract data. Please check Firecrawl logs or API Key.');
            return Command::FAILURE;
        }

        $this->info("✓ Data extracted successfully from Firecrawl!");
        $this->line("Vehicle Model: " . ($data['title'] ?? 'Unknown'));
        $this->line("Slogan: " . ($data['tagline'] ?? 'N/A'));
        $this->line("Total Versions: " . (isset($data['versions']) ? count($data['versions']) : 0));
        $this->line("Total Colors: " . (isset($data['colors']) ? count($data['colors']) : 0));
        $this->line("Total Accessories: " . (isset($data['accessories']) ? count($data['accessories']) : 0));

        // Try to scrape detailed specifications from the compare.html page
        $compareUrl = rtrim($url, '/') . '/compare.html';
        $this->info("Fetching detailed specifications from comparison page: {$compareUrl}...");
        $compareData = $this->firecrawlService->scrapeCompareSpecs($compareUrl);

        if (!empty($compareData) && isset($compareData['versions'])) {
            $this->info("✓ Detailed specifications extracted successfully from comparison page!");
            
            // Map the detailed specs back to the main versions array
            foreach ($data['versions'] as $verIndex => &$mainVersion) {
                $mainClean = strtolower(preg_replace('/\s+/', '', $mainVersion['name']));
                
                // Try to find matching version in compareData
                $matchedCompareVersion = null;
                foreach ($compareData['versions'] as $compVersion) {
                    if (empty($compVersion['name'])) continue;
                    $compClean = strtolower(preg_replace('/\s+/', '', $compVersion['name']));
                    // Match if mainName contains compName or vice versa (e.g. "everestwildtrak" contains "wildtrak")
                    if (str_contains($mainClean, $compClean) || str_contains($compClean, $mainClean)) {
                        $matchedCompareVersion = $compVersion;
                        break;
                    }
                }
                
                if ($matchedCompareVersion && isset($matchedCompareVersion['detailed_specs'])) {
                    if (!isset($mainVersion['specs'])) {
                        $mainVersion['specs'] = [];
                    }
                    $mainVersion['specs']['detailed_specs'] = $matchedCompareVersion['detailed_specs'];
                    $this->info("   Mapped detailed specs to version: {$mainVersion['name']}");
                }
            }
            unset($mainVersion);
        } else {
            $this->warn("⚠ Could not extract detailed specifications from comparison page. Saving summary specs only.");
        }

        // 2. Resolve Category ID
        $categoryId = $this->resolveCategoryId($data);
        if (!$categoryId) {
            $this->error('Failed to resolve category. Aborting process.');
            return Command::FAILURE;
        }
        $this->info("✓ Category assigned ID: {$categoryId}");

        // 3. Process database insert/update with image downloads
        $this->info("Downloading images and writing to Database...");
        
        $title = $data['title'] ?? 'Ford Vehicle';
        
        // Normalize title to match existing seed records (e.g. "Ford Territory Mới" -> "FORD TERRITORY")
        $normalizedTitle = trim(preg_replace('/\s+(Mới|Thế hệ Mới)$/iu', '', $title));
        $slug = Str::slug($normalizedTitle);
        $title = mb_strtoupper($normalizedTitle);

        // Extract 360 image URLs and video URLs from page HTML first
        $this->info("Extracting media paths from page HTML: {$url}...");
        $mediaData = $this->extractMediaFromPage($url);
        $extracted360Urls = $mediaData['urls_360'] ?? [];
        $videoUrl = $mediaData['video_url'] ?? ($data['video_url'] ?? null);
        $this->info("Found " . count($extracted360Urls) . " candidate 360 images in HTML. Video: " . ($videoUrl ?? 'N/A'));

        $allVersionNames = array_map(function($v) {
            return $v['name'] ?? '';
        }, $data['versions'] ?? []);

        try {
            DB::transaction(function () use ($data, $categoryId, $slug, $title, $extracted360Urls, $allVersionNames, $videoUrl) {
                // Download main image
                $this->info("Downloading main image...");
                $mainImage = $this->downloadImage($data['main_image'] ?? null, "vehicles/{$slug}");

                // Download gallery images
                $this->info("Downloading gallery images...");
                $gallery = $this->downloadImageArray($data['gallery_images'] ?? [], "vehicles/{$slug}/gallery");

                // Download colors and their respective 360 views
                $colors = [];
                foreach ($data['colors'] ?? [] as $colorIndex => $colorData) {
                    $colorName = $colorData['name'];
                    $this->info("Processing Color: {$colorName}...");
                    
                    $colorImage = $this->downloadImage($colorData['image_url'] ?? null, "vehicles/{$slug}/colors");
                    
                    // Folder-safe color slug
                    $colorSlug = Str::slug($colorName);
                    
                    // Find matching 360 URLs from the extracted list or guess candidates
                    $matched360Urls = [];
                    foreach ($extracted360Urls as $extUrl) {
                        $decodedUrl = rawurldecode($extUrl);
                        $lowerUrl = mb_strtolower($decodedUrl);
                        $lowerColor = mb_strtolower($colorName);
                        $slugColor = Str::slug($colorName);

                        // Match color name (either exact Vietnamese e.g. "đen" or slug e.g. "den")
                        $colorMatches = str_contains($lowerUrl, '/' . $lowerColor . '/') 
                                     || str_contains($lowerUrl, '/' . $slugColor . '/')
                                     || str_contains($lowerUrl, '/' . str_replace('-', '', $slugColor) . '/');
                                     
                        // If version names are present for this color, verify the URL also matches one of the versions
                        $versionMatches = true;
                        if (!empty($colorData['versions'])) {
                            $versionMatches = false;
                            foreach ($colorData['versions'] as $vName) {
                                $vSlug = Str::slug($vName);
                                $vClean = str_replace([$slug . '-', 'ford-'], '', $vSlug);
                                if (str_contains($lowerUrl, '/' . $vClean . '/') || str_contains($lowerUrl, '/' . $vSlug . '/')) {
                                    $versionMatches = true;
                                    break;
                                }
                            }
                        }

                        if ($colorMatches && $versionMatches) {
                            $matched360Urls[] = $extUrl;
                        }
                    }

                    // If no match from page HTML, check if Firecrawl returned some under colorData
                    if (empty($matched360Urls)) {
                        $matched360Urls = array_merge(
                            $colorData['images_360'] ?? [],
                            $colorData['images_360_internal'] ?? []
                        );
                    }

                    // If still empty, try to guess the candidates using typical Ford patterns
                    if (empty($matched360Urls)) {
                        $matched360Urls = $this->guess360UrlCandidates($slug, $colorName, $colorData['versions'] ?? $allVersionNames);
                    }

                    // If we found any working URL, expand it to all 36 frames
                    $expandedExteriorUrls = [];
                    foreach ($matched360Urls as $matchedUrl) {
                        if (str_contains($matchedUrl, '/360/') || str_contains($matchedUrl, '/colorizer/')) {
                            $seqInfo = $this->detectSequenceBaseUrl($matchedUrl);
                            if ($seqInfo) {
                                for ($i = 1; $i <= 36; $i++) {
                                    $numStr = str_pad($i, $seqInfo['padding'], '0', STR_PAD_LEFT);
                                    $expandedExteriorUrls[] = $seqInfo['base'] . $numStr . $seqInfo['ext'];
                                }
                                break; // Stop after first successful sequence expansion
                            } else {
                                $expandedExteriorUrls[] = $matchedUrl;
                            }
                        }
                    }
                    $expandedExteriorUrls = array_values(array_unique($expandedExteriorUrls));

                    $this->info(" - Downloading " . count($expandedExteriorUrls) . " exterior 360 images for {$colorName}...");
                    $images360 = $this->downloadImageArray(
                        $expandedExteriorUrls, 
                        "vehicles/360/{$slug}/{$colorSlug}/exterior"
                    );
                    
                    // For interior, process similarly if internal 360 is found
                    $interiorUrls = [];
                    foreach ($colorData['images_360_internal'] ?? [] as $intUrl) {
                        $seqInfo = $this->detectSequenceBaseUrl($intUrl);
                        if ($seqInfo) {
                            for ($i = 1; $i <= 36; $i++) {
                                $numStr = str_pad($i, $seqInfo['padding'], '0', STR_PAD_LEFT);
                                $interiorUrls[] = $seqInfo['base'] . $numStr . $seqInfo['ext'];
                            }
                        } else {
                            $interiorUrls[] = $intUrl;
                        }
                    }
                    $interiorUrls = array_values(array_unique($interiorUrls));

                    $this->info(" - Downloading " . count($interiorUrls) . " interior 360 images for {$colorName}...");
                    $images360Internal = $this->downloadImageArray(
                        $interiorUrls, 
                        "vehicles/360/{$slug}/{$colorSlug}/interior"
                    );

                    $colors[] = [
                        'name' => $colorName,
                        'hex' => $colorData['hex'] ?? '#cccccc',
                        'image_path' => $colorImage ? $colorImage['path'] : null,
                        'versions' => $colorData['versions'] ?? [],
                        'images_360' => $images360,
                        'images_360_internal' => $images360Internal,
                    ];
                }

                // Find or init vehicle by slug or by exact title translation to prevent duplicates
                $vehicle = Vehicle::whereHas('translations', function ($q) use ($slug, $title) {
                    $q->where('locale', 'vi')
                      ->where(function ($sub) use ($slug, $title) {
                          $sub->where('slug', $slug)
                              ->orWhere('title', $title);
                      });
                })->first();

                // Construct layout blocks dynamically for overview page rendering
                $this->info("Constructing layout blocks...");
                $layoutBlocks = [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => $title,
                            'tagline' => $data['tagline'] ?? 'Cơ hội vàng. Sẵn sàng rước xế.',
                            'button_text' => 'Nhận chương trình ưu đãi',
                            'button_link' => "/lien-he?vehicle={$slug}",
                            'background_image' => $mainImage ? ['path' => $mainImage['path']] : null
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => "Ưu Đãi Đặc Biệt Cho Xe {$title}",
                            'description' => "Nhận ngay ưu đãi giá bán tốt nhất, quà tặng đặc quyền và hỗ trợ trả góp ưu đãi khi mua xe {$title} tại Đồng Nai Ford.",
                            'image' => count($gallery) > 0 ? ['path' => $gallery[0]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'button_text' => 'Tư vấn ưu đãi'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => "Khám phá {$title} 360°",
                            'description' => 'Trải nghiệm góc nhìn 360 độ ngoại thất mượt mà và sang trọng.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Thiết kế hiện đại, mạnh mẽ',
                            'image_1' => count($gallery) > 1 ? ['path' => $gallery[1]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'image_2' => count($gallery) > 2 ? ['path' => $gallery[2]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'image_3' => count($gallery) > 3 ? ['path' => $gallery[3]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'title_2' => 'Nội thất sang trọng & Khoang cabin rộng rãi',
                            'image_large' => count($gallery) > 4 ? ['path' => $gallery[4]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'image_large_2' => count($gallery) > 5 ? ['path' => $gallery[5]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'image_large_3' => count($gallery) > 6 ? ['path' => $gallery[6]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'title_3' => 'Công nghệ kết nối & An toàn vượt trội',
                            'split_image' => count($gallery) > 0 ? ['path' => $gallery[0]['path']] : ($mainImage ? ['path' => $mainImage['path']] : null),
                            'split_title' => 'Trang bị thông minh',
                            'split_features' => array_values(array_filter([
                                isset($data['versions'][0]['specs']['engine']) ? ['value' => $data['versions'][0]['specs']['engine'], 'label' => 'Động cơ mạnh mẽ'] : null,
                                isset($data['versions'][0]['specs']['transmission']) ? ['value' => $data['versions'][0]['specs']['transmission'], 'label' => 'Hộp số mượt mà'] : null,
                                isset($data['versions'][0]['specs']['drivetrain']) ? ['value' => $data['versions'][0]['specs']['drivetrain'], 'label' => 'Hệ thống dẫn động'] : null,
                            ]))
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => "Các phiên bản {$title}",
                            'descriptions' => array_map(function($v) {
                                return $v['name'] . ': Sở hữu khả năng vận hành vượt trội và các tính năng an toàn hàng đầu.';
                            }, $data['versions'] ?? [])
                        ]
                    ],
                    [
                        'type' => 'SpecsGrid',
                        'data' => []
                    ],
                    [
                        'type' => 'AccessoriesList',
                        'data' => []
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => "Bắt đầu cuộc sống hiện đại cùng {$title}",
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Nhận báo giá chi tiết',
                            'btn_link' => "/lien-he?vehicle={$slug}&reason=Nhận báo giá",
                            'car_image' => $mainImage ? ['path' => $mainImage['path']] : null
                        ]
                    ]
                ];

                if (!empty($videoUrl)) {
                    array_splice($layoutBlocks, count($layoutBlocks) - 1, 0, [[
                        'type' => 'VideoShowcase',
                        'data' => [
                            'title' => "Trải Nghiệm Thực Tế Xe {$title}",
                            'video_url' => $videoUrl,
                            'description' => "Xem video giới thiệu chi tiết về thiết kế, công nghệ và khả năng vận hành của dòng xe {$title}."
                        ]
                    ]]);
                }

                $vehiclePayload = [
                    'category_id' => $categoryId,
                    'type' => $data['type'] ?? 'suv',
                    'base_price' => $data['base_price'] ?? 0,
                    'image' => $mainImage,
                    'images' => $gallery,
                    'colors' => $colors,
                    'status' => 'ACTIVE',
                    'layout_blocks' => $layoutBlocks,
                ];

                if ($vehicle) {
                    $vehicle->update($vehiclePayload);
                    $this->info("✓ Existing Vehicle found, updating metadata.");
                } else {
                    $vehicle = Vehicle::create($vehiclePayload);
                    $this->info("✓ Vehicle created successfully.");
                }

                // Set translations via Astrotomic Translatable
                $vehicleTranslation = $vehicle->translateOrNew('vi');
                $vehicleTranslation->title = $title;
                $vehicleTranslation->slug = $slug;
                $vehicleTranslation->tagline = $data['tagline'] ?? '';
                $vehicleTranslation->description = $data['description'] ?? '';
                $vehicle->save();

                // Sync Versions
                $this->info("Syncing versions & technical specifications...");
                $versionIdsToKeep = [];

                foreach ($data['versions'] ?? [] as $index => $versionData) {
                    $versionName = $versionData['name'];
                    $this->info(" - Version: {$versionName}");

                    $version = $vehicle->versions()->whereHas('translations', function ($q) use ($versionName) {
                        $q->where('name', $versionName)->where('locale', 'vi');
                    })->first();

                    $versionImage = null;
                    if (isset($versionData['image_url'])) {
                        $versionImage = $this->downloadImage($versionData['image_url'], "vehicles/{$slug}/versions");
                    }

                    $versionPayload = [
                        'price' => $versionData['price'] ?? 0,
                        'specs' => $versionData['specs'] ?? null,
                        'image' => $versionImage,
                        'status' => 'ACTIVE',
                        'sort_order' => $index + 1,
                    ];

                    if ($version) {
                        $version->update($versionPayload);
                    } else {
                        $version = $vehicle->versions()->create($versionPayload);
                    }

                    // Set version translations via Astrotomic
                    $versionTranslation = $version->translateOrNew('vi');
                    $versionTranslation->name = $versionName;
                    $version->save();

                    $versionIdsToKeep[] = $version->id;
                }

                // Delete old versions not returned in the scrape
                $deletedVersions = $vehicle->versions()->whereNotIn('id', $versionIdsToKeep)->delete();
                if ($deletedVersions > 0) {
                    $this->info(" - Cleaned up {$deletedVersions} old versions.");
                }

                // Sync Accessories
                $this->info("Syncing compatible accessories...");
                foreach ($data['accessories'] ?? [] as $accData) {
                    $accTitle = $accData['name'];
                    $accCode = $accData['code'] ?? null;
                    
                    $this->info(" - Accessory: {$accTitle} (Code: " . ($accCode ?? 'N/A') . ")");

                    $accImage = null;
                    if (isset($accData['image_url'])) {
                        $accImage = $this->downloadImage($accData['image_url'], 'accessories');
                    }

                    $accessory = null;
                    if ($accCode) {
                        $accessory = Accessory::where('code', $accCode)->first();
                    }
                    if (!$accessory) {
                        $accessory = Accessory::whereHas('translations', function ($q) use ($accTitle) {
                            $q->where('title', $accTitle)->where('locale', 'vi');
                        })->first();
                    }

                    $fitVehicles = [];
                    if ($accessory && is_array($accessory->fit_vehicles)) {
                        $fitVehicles = $accessory->fit_vehicles;
                    }
                    if (!in_array($title, $fitVehicles)) {
                        $fitVehicles[] = $title;
                    }

                    $accPayload = [
                        'code' => $accCode,
                        'price' => $accData['price'] ?? null,
                        'image' => $accImage,
                        'fit_vehicles' => $fitVehicles,
                        'status' => 'ACTIVE',
                    ];

                    if ($accessory) {
                        $accessory->update($accPayload);
                    } else {
                        $accessory = Accessory::create($accPayload);
                    }

                    // Set accessory translations via Astrotomic
                    $accTranslation = $accessory->translateOrNew('vi');
                    $accTranslation->title = $accTitle;
                    $accTranslation->slug = Str::slug($accTitle);
                    $accTranslation->description = $accData['description'] ?? null;
                    $accessory->save();
                }
            });

            $this->info("✓ Vehicle and all relations successfully synced!");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Database transaction failed: " . $e->getMessage());
            $this->line($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    /**
     * Resolve the category ID for the vehicle.
     *
     * @param array $data
     * @return int|null
     */
    protected function resolveCategoryId(array $data): ?int
    {
        $cliOption = $this->option('category_id');
        if ($cliOption) {
            return (int) $cliOption;
        }

        $type = $data['type'] ?? 'suv';
        $slug = 'suv';
        if ($type === 'pickup') {
            $slug = 'ban-tai';
        } elseif ($type === 'commercial') {
            $slug = 'thuong-mai';
        }

        $category = VehicleCategory::whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug)->where('locale', 'vi');
        })->first();

        if ($category) {
            return $category->id;
        }

        // Return first category as fallback, or log/ask
        $fallback = VehicleCategory::first();
        if ($fallback) {
            $this->warn("Category slug '{$slug}' not found. Falling back to category ID: {$fallback->id} ({$fallback->title})");
            return $fallback->id;
        }

        $this->error("No Vehicle Categories found in the database. Please seed vehicle categories first.");
        return null;
    }

    /**
     * Download an image URL using Http Client and store on the uploads disk.
     *
     * @param string|null $url
     * @param string $subDir
     * @return array|null
     */
    protected function downloadImage(?string $url, string $subDir): ?array
    {
        if (empty($url)) {
            return null;
        }

        // Safely encode the URL path to handle Vietnamese characters
        $url = $this->encodeUrlPath($url);

        try {
            $cleanUrl = strtok($url, '?');
            $filename = rawurldecode(basename($cleanUrl));
            
            // Clean filename and extension
            $ext = pathinfo($filename, PATHINFO_EXTENSION) ?: 'png';
            $name = pathinfo($filename, PATHINFO_FILENAME);
            $safeFilename = Str::slug($name) . '.' . $ext;

            $targetPath = $subDir . '/' . $safeFilename;
            $disk = Storage::disk('uploads');

            if ($disk->exists($targetPath)) {
                return ['path' => $targetPath];
            }

            // Try downloading with simple request first (Ford CDN often blocks browser-like requests from server IPs)
            $response = Http::timeout(15)->get($url);

            if ($response->failed()) {
                // Fallback: try with browser headers
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(15)->get($url);
            }

            if ($response->failed()) {
                $this->warn(" - Failed to download image: {$url} (Status Code: " . $response->status() . ")");
                return null;
            }

            $disk->put($targetPath, $response->body());
            return ['path' => $targetPath];

        } catch (\Throwable $e) {
            $this->warn(" - Error downloading image {$url}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Download multiple images and return array of structures.
     *
     * @param array $urls
     * @param string $subDir
     * @return array
     */
    protected function downloadImageArray(array $urls, string $subDir): array
    {
        $downloaded = [];
        foreach ($urls as $url) {
            $res = $this->downloadImage($url, $subDir);
            if ($res) {
                $downloaded[] = $res;
            }
        }
        return $downloaded;
    }

    /**
     * Test the connection to Firecrawl API.
     *
     * @return int
     */
    protected function testConnection(): int
    {
        $this->info("Testing connection to Firecrawl API...");
        $apiKey = config('services.firecrawl.key') ?? env('FIRECRAWL_API_KEY', '');
        
        if (empty($apiKey)) {
            $this->error("API Key is missing in .env file.");
            return Command::FAILURE;
        }

        $this->line("API Key found: " . substr($apiKey, 0, 6) . "..." . substr($apiKey, -4));
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get('https://api.firecrawl.dev/v1/scrape'); // Just ping or check credentials
            
            // Scrape check returns 405 for GET generally but indicates path exists and we get parsed response
            $this->info("API is accessible. Connection status: " . $response->status());
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to connect: " . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Decode and re-encode URL path to safely handle Vietnamese/special characters.
     *
     * @param string $url
     * @return string
     */
    protected function encodeUrlPath(string $url): string
    {
        $parts = parse_url($url);
        if (!$parts) {
            return $url;
        }

        $scheme = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
        $host = $parts['host'] ?? '';
        $port = isset($parts['port']) ? ':' . $parts['port'] : '';
        $path = $parts['path'] ?? '';
        $query = isset($parts['query']) ? '?' . $parts['query'] : '';
        $fragment = isset($parts['fragment']) ? '#' . $parts['fragment'] : '';

        $pathSegments = explode('/', $path);
        $encodedSegments = array_map(function ($segment) {
            // Decode first to prevent double encoding, then rawurlencode
            return rawurlencode(rawurldecode($segment));
        }, $pathSegments);
        $encodedPath = implode('/', $encodedSegments);

        return $scheme . $host . $port . $encodedPath . $query . $fragment;
    }

    /**
     * Scrape the vehicle HTML page directly and extract all 360-degree colorizer URLs and video URLs.
     *
     * @param string $url
     * @return array
     */
    protected function extractMediaFromPage(string $url): array
    {
        $result = [
            'urls_360' => [],
            'video_url' => null,
        ];

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer' => 'https://www.ford.com.vn/'
            ])->timeout(15)->get($url);

            if ($response->failed()) {
                return $result;
            }

            $html = $response->body();
            $htmlClean = str_replace('\/', '/', $html);

            // 1. Match colorizer 360 image URLs
            $pattern = '/\/content\/dam\/Ford\/vn\/nameplate\/[a-zA-Z0-9_-]+\/model\/[a-zA-Z0-9_-]+\/colorizer\/360\/[^\s"\'#>]+/iu';
            if (preg_match_all($pattern, $htmlClean, $matches)) {
                $urls = array_unique($matches[0]);
                $result['urls_360'] = array_map(function ($path) {
                    if (str_starts_with($path, '/')) {
                        return 'https://www.ford.com.vn' . $path;
                    }
                    return $path;
                }, $urls);
            }

            // 2. Extract video URL (YouTube iframe embeds, YouTube watch links, or direct MP4 files)
            $youtubePattern = '/(https?:)?\/\/(www\.)?(youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i';
            if (preg_match($youtubePattern, $htmlClean, $videoMatches)) {
                $result['video_url'] = $videoMatches[0];
            } else {
                $mp4Pattern = '/(https?:)?\/\/[^\s"\'#>]*\/[^\s"\'#>]*\.(mp4|webm|ogv)/i';
                if (preg_match($mp4Pattern, $htmlClean, $mp4Matches)) {
                    $result['video_url'] = $mp4Matches[0];
                }
            }
        } catch (\Throwable $e) {
            $this->warn("Failed to extract media from page HTML: " . $e->getMessage());
        }

        return $result;
    }

    /**
     * Try to match a sequence number like -01, _01, -1, _1 at the end of the filename (excluding extension)
     *
     * @param string $url
     * @return array|null
     */
    protected function detectSequenceBaseUrl(string $url): ?array
    {
        if (preg_match('/^(.*[_-])(\d+)(\.(webp|png|jpg|jpeg))$/i', $url, $matches)) {
            return [
                'base' => $matches[1],
                'start' => (int)$matches[2],
                'padding' => strlen($matches[2]),
                'ext' => $matches[3],
            ];
        }
        return null;
    }

    /**
     * Guess potential 360 image URL candidates using standard Ford VN naming conventions.
     *
     * @param string $vehicleSlug
     * @param string $colorName
     * @param array $versionNames
     * @return array
     */
    protected function guess360UrlCandidates(string $vehicleSlug, string $colorName, array $versionNames): array
    {
        $nameplate = str_replace('ford-', '', $vehicleSlug);
        $colorVn = mb_strtolower(trim($colorName));
        $colorVnSlug = Str::slug($colorVn);
        
        $colorMap = [
            'đen' => ['absolute-black', 'black', 'shadow-black', 'den'],
            'trắng' => ['snowflake-white', 'oxford-white', 'white', 'trang'],
            'trắng tuyết' => ['snowflake-white', 'snowflake-white-pearl', 'snowflake', 'trang-tuyet'],
            'trắng ngọc trai' => ['snowflake-white-pearl', 'white-pearl', 'trang-ngoc-trai'],
            'xám' => ['meteor-grey', 'meteor-gray', 'grey', 'gray', 'xam'],
            'xám meteor' => ['meteor-grey', 'meteor-gray', 'xam-meteor'],
            'bạc' => ['aluminum-metallic', 'silver', 'bac'],
            'bạc alumi' => ['aluminum-metallic', 'aluminum', 'bac-alumi'],
            'xanh' => ['lightning-blue', 'blue', 'lucid-blue', 'xanh'],
            'xanh dương' => ['lightning-blue', 'blue', 'xanh-duong'],
            'đỏ' => ['sunset-orange', 'rapid-red', 'red', 'do'],
            'đỏ cam' => ['sunset-orange', 'do-cam'],
            'nâu' => ['equator-bronze', 'bronze', 'nau'],
            'nâu equator' => ['equator-bronze', 'nau-equator'],
            'vàng' => ['luxe-yellow', 'yellow', 'vang'],
            'vàng luxe' => ['luxe-yellow', 'vang-luxe'],
        ];

        $colorEnCandidates = $colorMap[$colorVn] ?? [$colorVnSlug];

        $candidates = [];
        $versions = !empty($versionNames) ? $versionNames : ['standard'];

        foreach ($versions as $vName) {
            $vSlug = Str::slug($vName);
            $vClean = str_replace([$vehicleSlug . '-', 'ford-'], '', $vSlug);

            foreach ($colorEnCandidates as $colorEn) {
                // Try different folder layouts for color name (with accent and without accent)
                $colorVnFolders = array_unique([$colorVn, $colorVnSlug]);
                
                foreach ($colorVnFolders as $colorFolder) {
                    // Pattern 1: /content/dam/Ford/vn/nameplate/{nameplate}/model/{version}/colorizer/360/{color_vn}/vn-{version}-{color_en}-01.webp
                    $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/model/{$vClean}/colorizer/360/{$colorFolder}/vn-{$vClean}-{$colorEn}-01.webp";
                    
                    // Pattern 2: /content/dam/Ford/vn/nameplate/{nameplate}/model/{version}/colorizer/360/{color_vn}/vn-{$color_en}-01.webp
                    $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/model/{$vClean}/colorizer/360/{$colorFolder}/vn-{$colorEn}-01.webp";

                    // Pattern 3: Without version prefix in filename e.g. {color_en}-01.webp
                    $candidates[] = "https://www.ford.com.vn/content/dam/Ford/vn/nameplate/{$nameplate}/model/{$vClean}/colorizer/360/{$colorFolder}/{$colorEn}-01.webp";
                }
            }
        }

        // Filter candidates and find the first one that returns 200 OK
        foreach ($candidates as $candidate) {
            $encodedCandidate = $this->encodeUrlPath($candidate);
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer' => 'https://www.ford.com.vn/'
                ])->timeout(3)->head($encodedCandidate);

                if ($response->successful()) {
                    $this->info("   Found working 360 candidate: {$candidate}");
                    return [$candidate];
                }
            } catch (\Throwable $e) {
                // Ignore timeout/connection issues for candidate guessing
            }
        }

        return [];
    }
}
