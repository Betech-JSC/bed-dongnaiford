<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\PostController;
use App\Http\Controllers\Backend\PostCategoryController;
use App\Http\Controllers\Backend\TagController;
use App\Http\Controllers\Backend\AgencyController;
use App\Http\Controllers\Backend\ContactController;
use App\Http\Controllers\Backend\ApplyController;
use App\Http\Controllers\Backend\BrandController;
use App\Http\Controllers\Backend\CertificateController;
use App\Http\Controllers\Backend\CustomerController;
use App\Http\Controllers\Backend\FlashSaleController;
use App\Http\Controllers\Backend\SliderController;
use App\Http\Controllers\Backend\HistoryController;
use App\Http\Controllers\Backend\JobController;
use App\Http\Controllers\Backend\PolicyController;

use App\Http\Controllers\Backend\OrderController;
use App\Http\Controllers\Backend\ProductCategoryController;
use App\Http\Controllers\Backend\ProductController;
use App\Http\Controllers\Backend\ServiceController;
use App\Http\Controllers\Backend\RegionController;
use App\Http\Controllers\Backend\ConfigController;
use App\Http\Controllers\Backend\FeedbackController;
use App\Http\Controllers\Backend\LotusBannerController;
use App\Http\Controllers\Backend\LotusCategoryController;
use App\Http\Controllers\Backend\LotusProductController;
use App\Http\Controllers\Backend\LotusReviewController;
use App\Http\Controllers\Backend\LotusSponsorController;
use App\Http\Controllers\Backend\LotusTeamController;
use App\Http\Controllers\Backend\LotusGuideController;
use App\Http\Controllers\Backend\LotusActivityController;
use App\Http\Controllers\Backend\LotusAwardController;

Route::localized(function () {
    Route::middleware(['auth:admin'])->name('admin.')->group(function () {
        Route::module(PostController::class);
        Route::module(CertificateController::class);
        Route::module(FeedbackController::class);
        Route::module(ProductController::class);
        Route::module(BrandController::class);
        Route::module(PostCategoryController::class);
        Route::module(TagController::class);
        Route::module(PolicyController::class);
        Route::module(AgencyController::class);
        Route::module(ContactController::class);
        Route::module(SliderController::class);
        Route::module(HistoryController::class);
        Route::module(JobController::class);
        Route::module(ServiceController::class);
        Route::module(ApplyController::class);
        Route::module(ProductCategoryController::class);
        Route::module(OrderController::class);
        Route::module(CustomerController::class);
        Route::module(RegionController::class);
        Route::module(FlashSaleController::class);
        Route::module(ConfigController::class);

        // Lotus Institute Modules
        Route::module(LotusBannerController::class);
        Route::module(LotusCategoryController::class);
        Route::module(LotusProductController::class);
        Route::module(LotusReviewController::class);
        Route::module(LotusSponsorController::class);
        Route::module(LotusTeamController::class);
        Route::module(LotusGuideController::class);
        Route::module(LotusActivityController::class);
        Route::module(LotusAwardController::class);
    });
});
