<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KeywordController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleCategoryController;
use App\Http\Controllers\Api\CustomerReviewController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\SalesConsultantController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AccessoryController;

Route::localized(function () {

    Route::prefix('vehicles')->name('api.vehicles.')->group(function () {
        // Dòng xe
        Route::get('featured', [VehicleController::class, 'featured'])->name('featured');
        Route::get('/', [VehicleController::class, 'index'])->name('index');

        // Danh mục xe
        Route::get('categories', [VehicleCategoryController::class, 'index'])->name('categories.index');

        // Đánh giá khách hàng
        Route::get('reviews', [CustomerReviewController::class, 'index'])->name('reviews.index');

        // Banners
        Route::get('banners', [BannerController::class, 'index'])->name('banners.index');

        // Đối tác
        Route::get('partners', [PartnerController::class, 'index'])->name('partners.index');

        // Đội ngũ cố vấn
        Route::get('consultants', [SalesConsultantController::class, 'index'])->name('consultants.index');
        Route::get('consultants/{slug}', [SalesConsultantController::class, 'show'])->name('consultants.show');

        // Chi tiết xe (Đặt ở dưới cùng để tránh tranh chấp wildcard {slug})
        Route::get('{slug}', [VehicleController::class, 'show'])->name('show');
        Route::put('{slug}/layout', [VehicleController::class, 'updateLayout'])->name('updateLayout');
    });

    Route::prefix('accessories')->name('api.accessories.')->group(function () {
        Route::get('/', [AccessoryController::class, 'index'])->name('index');
        Route::get('{slug}', [AccessoryController::class, 'show'])->name('show');
    });

    Route::post('contacts', [App\Http\Controllers\Frontend\ContactController::class, 'store'])->name('api.contacts.store');
    Route::get('posts', [\App\Http\Controllers\Frontend\PostController::class, 'index'])->name('api.posts');
    Route::get('posts/{slug}', [\App\Http\Controllers\Frontend\PostController::class, 'show'])->name('api.posts.show');
    Route::get('jobs', [\App\Http\Controllers\Frontend\JobController::class, 'index'])->name('api.jobs');
    Route::get('jobs/{slug}', [\App\Http\Controllers\Frontend\JobController::class, 'show'])->name('api.jobs.show');
    Route::get('agencies', [\App\Http\Controllers\Frontend\AgencyController::class, 'index'])->name('api.agencies');
    Route::get('regions/provinces', [\App\Http\Controllers\Api\RegionController::class, 'province'])->name('api.regions.provinces');

    // AI Chatbot
    Route::post('ai/chat', [ChatController::class, 'chat'])->name('api.ai.chat');

    // Tải ảnh trực tiếp từ FrontEnd Page Builder
    Route::post('upload', [VehicleController::class, 'uploadImage'])->name('api.upload');

    // Lấy cấu hình lãi suất trả góp cho frontend
    Route::get('settings/installment', function () {
        $installmentSettings = settings()->group('installment')->all();
        return response()->json([
            'success' => true,
            'data' => [
                'rate_year_1' => (float) ($installmentSettings['installment_rate_year_1'] ?? 8.5),
                'rate_subsequent' => (float) ($installmentSettings['installment_rate_subsequent'] ?? 11.0),
            ],
            'message' => 'OK'
        ]);
    })->name('api.settings.installment');
});

Route::get('keywords/index', [KeywordController::class, 'index'])
    ->name('api.keywords.index');
