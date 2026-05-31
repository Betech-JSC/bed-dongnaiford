<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\KeywordController;
use App\Http\Controllers\Api\SepayWebhookController;
use App\Http\Controllers\Api\LotusProductController;
use App\Http\Controllers\Api\LotusCategoryController;
use App\Http\Controllers\Api\LotusReviewController;
use App\Http\Controllers\Api\LotusBannerController;
use App\Http\Controllers\Api\LotusSponsorController;
use App\Http\Controllers\Api\LotusTeamController;

Route::localized(function () {
    Route::controller(ProductController::class)->group(function () {
        Route::get(Lang::uri('products'), 'index')->name('api.products');
        Route::get(Lang::uri('rating') . '/{product_id}', 'rating')->name('rating');
        Route::get(Lang::uri('instant-search') . '/{keyword}', 'instantSearch')->name('instant_search');
        Route::get(Lang::uri('product-sale'), 'flashSale')->name('api.flash_sale');
        Route::post('sepay-webhook', [SepayWebhookController::class, 'storeTransaction'])->name('api.sepay.webhook');
    });

    Route::prefix('lotus')->name('api.lotus.')->group(function () {
        // Khoá học
        Route::get('courses/featured', [LotusProductController::class, 'featured'])->name('courses.featured');
        Route::get('courses', [LotusProductController::class, 'index'])->name('courses.index');
        Route::get('courses/{slug}', [LotusProductController::class, 'show'])->name('courses.show');

        // Danh mục
        Route::get('categories', [LotusCategoryController::class, 'index'])->name('categories.index');

        // Đánh giá
        Route::get('reviews', [LotusReviewController::class, 'index'])->name('reviews.index');

        // Banners (filter by location: ?location=homepage, ?location=homepage_hero, ...)
        Route::get('banners', [LotusBannerController::class, 'index'])->name('banners.index');

        // Nhà tài trợ
        Route::get('sponsors', [LotusSponsorController::class, 'index'])->name('sponsors.index');

        // Đội ngũ
        Route::get('teams', [LotusTeamController::class, 'index'])->name('teams.index');
        Route::get('teams/{slug}', [LotusTeamController::class, 'show'])->name('teams.show');
    });
});

Route::get('keywords/index', [KeywordController::class, 'index'])
    ->name('api.keywords.index');
