<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\PostController;
use App\Http\Controllers\Frontend\AgencyController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\HistoryController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\OrderController;
use App\Http\Controllers\Frontend\ProductController;
use App\Http\Controllers\Frontend\SitemapController;
use App\Http\Controllers\Frontend\PolicyController;
use App\Http\Controllers\Frontend\ServiceController;
use App\Http\Controllers\Frontend\JobController;
use App\Http\Controllers\Frontend\TeamController;
use Inertia\Inertia;

Route::get('sitemap.xml', [SitemapController::class, 'index']);

Route::middleware(['meta_seo', 'opening'])->group(function () {
    Route::localized(function () {

        Route::controller(HomeController::class)->group(function () {
            Route::get(Lang::uri('search'), 'search')->name('search');
            Route::get(Lang::uri('search-v2'), 'searchV2')->name('api.search');
            Route::get(Lang::uri('/'), 'index')->name('home');

            Route::get(Lang::uri('/factory'), 'factory')->name('factory.index');
        });

        Route::get(Lang::uri('/contact'), [AgencyController::class, 'index'])->name('contact');

        Route::controller(HistoryController::class)->group(function () {
            Route::get(Lang::uri('about-us'), 'index')->name('histories.index');
            Route::get(Lang::uri('histories') . '/{slug}', 'show')->name('histories.show');
        });

        Route::controller(PostController::class)->group(function () {
            Route::get(Lang::uri('posts'), 'index')->name('posts');
            Route::get(Lang::uri('posts') . '/{slug}', 'show')->name('posts.show');
        });

        Route::controller(JobController::class)->group(function () {
            Route::get(Lang::uri('jobs'), 'index')->name('jobs');
            Route::get(Lang::uri('jobs') . '/{slug}', 'show')->name('jobs.show');
        });

        Route::controller(ServiceController::class)->group(function () {
            Route::get(Lang::uri('services'), 'index')->name('services');
            Route::get(Lang::uri('services') . '/{slug}', 'show')->name('services.show');
        });

        // Giảng viên
        Route::controller(TeamController::class)->group(function () {
            Route::get(Lang::uri('giang-vien') . '/{slug}', 'show')->name('team.show');
        });

        Route::controller(ProductController::class)->group(function () {
            Route::get(Lang::uri('products'), 'index')->name('products.index');
            Route::get(Lang::uri('product-categories') . '/{slug}', 'categories')->name('products.categories');
            Route::get(Lang::uri('products') . '/{slug}', 'show')->name('products.show');
        });

        Route::post(Lang::uri('contacts'), [ContactController::class, 'store'])->name('contact.store');

        Route::controller(PolicyController::class)->group(function () {
            Route::get(Lang::uri('policies'), 'index')->name('policies.index');
            Route::get(Lang::uri('policies') . '/{slug}', 'show')->name('policies.show');
        });

        // cart
        Route::prefix(Lang::uri('checkout'))->name('checkout.')->group(function () {
            Route::controller(CartController::class)->group(function () {
                Route::get('/' . Lang::uri('cart'), 'index')->name('cart.index');
                Route::post('cart/store', 'store')->name('cart.store');
                Route::put('/cart/{rowId}', 'update')->name('cart.update');
                Route::delete('cart/{rowId}', 'destroy')->name('cart.destroy');
                Route::get('/cart/empty', 'empty')->name('cart.empty');

                Route::get(Lang::uri('/payment-success'), fn() => inertia('Checkout/PaymentSuccess'))->name('payment-success');
                Route::get(Lang::uri('/payment-failed'), fn() => inertia('Checkout/PaymentFailed'))->name('payment-failed');
            });
            Route::controller(OrderController::class)->group(function () {
                Route::get('/' . Lang::uri('payment'), 'index')->name('payment.index');
                Route::get('/' . Lang::uri('payment-failed') . '/{orderNumber}', 'paymentFailed')->name('payment.payment_failed');
                Route::post('payment', 'checkout')->name('payment.store');

                Route::get('check-ipn-vnpay', 'checkIPNVNPay')->name('vnp_payment.store');
                Route::get('check-payment', 'checkPayment')->name('payment.check_payment');

                Route::get('/' . Lang::uri('tracking') . '/{orderNumber}', 'tracking')->name('payment.tracking');
                Route::get('/' . Lang::uri('track-order'), 'track')->name('payment.track.order');

                Route::get('/' . Lang::uri('check-payment-status') . '/{orderNumber}', 'checkPaymentStatus')->name('payment.check.payment.status');
            });
        });

        Route::get('api/checkout/cart', [CartController::class, 'cart'])->name('api.cart.index');

        Route::post(Lang::uri('calculate-total-cost'), [OrderController::class, 'calculateTotalCost'])->name('calculate.cost');
        Route::post(Lang::uri('check-payment-order-status'), [OrderController::class, 'checkPaymentOrderStatus'])->name('payment.check.payment.order.status');
    });
});

Route::dynamicRedirect();
