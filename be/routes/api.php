<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\KeywordController;
use App\Http\Controllers\Api\SepayWebhookController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleCategoryController;
use App\Http\Controllers\Api\CustomerReviewController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\SalesConsultantController;

Route::localized(function () {
    Route::controller(ProductController::class)->group(function () {
        Route::get(Lang::uri('products'), 'index')->name('api.products');
        Route::get(Lang::uri('rating') . '/{product_id}', 'rating')->name('rating');
        Route::get(Lang::uri('instant-search') . '/{keyword}', 'instantSearch')->name('instant_search');
        Route::get(Lang::uri('product-sale'), 'flashSale')->name('api.flash_sale');
        Route::post('sepay-webhook', [SepayWebhookController::class, 'storeTransaction'])->name('api.sepay.webhook');
    });

    Route::prefix('vehicles')->name('api.vehicles.')->group(function () {
        // Dòng xe
        Route::get('featured', [VehicleController::class, 'featured'])->name('featured');
        Route::get('/', [VehicleController::class, 'index'])->name('index');
        Route::get('{slug}', [VehicleController::class, 'show'])->name('show');

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
    });

    Route::post('contacts', [App\Http\Controllers\Frontend\ContactController::class, 'store'])->name('api.contacts.store');
});

Route::get('keywords/index', [KeywordController::class, 'index'])
    ->name('api.keywords.index');
