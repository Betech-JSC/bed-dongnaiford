<?php

namespace App\Http\Controllers\Frontend;

use App\Helpers\FacebookConversionsAPI;
use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use App\Models\ShoppingCart;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\ApiResponse;
use App\Models\Region;
use App\Models\Config;

final class CartController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $shoppingCart = new ShoppingCart();
            $cart = $shoppingCart->getContent();

            if (request()->wantsJson()) {
                return ['cart' => $cart];
            }

            return Inertia::render('Checkout/Cart');
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function cart()
    {
        $shoppingCart = new ShoppingCart();
        $cart = $shoppingCart->getContent();

        if (request()->wantsJson()) {
            return ['cart' => $cart];
        }

        return response()->json([
            'success' => true,
            'data' => $cart,
            'message' => 'OK',
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $params = $request->only(config('cart.cart_form.store.columns'));
            $productKey = config('cart.cart_form.store.product_key');

            $product = null;
            if ($productKey == 'product_id') {
                $product = Product::active()
                    ->findOrFail($params[$productKey]);
            }

            if (!empty($product->id)) {
                $isAddCart = true;
                foreach (Cart::instance('cart')->content() as $cartItem) {
                    if ($cartItem->id == $params[$productKey]) {

                        $quantity = $params['quantity'] + $cartItem->qty;
                        Cart::update($cartItem->rowId, $quantity);

                        // Send AddToCart event to Facebook
                        $newQuantity = (int) $params['quantity'] - (int) $cartItem->qty;
                        if ($newQuantity > 0) {
                            $cartItems = Cart::content();
                            $eventData = [
                                'content_name' => $cartItems->where('rowId', $cartItem->rowId)->first()->name,
                                'content_type' => 'product_group',
                                'content_ids' => [$cartItems->where('rowId', $cartItem->rowId)->first()->id],
                                'value' => $cartItems->where('rowId', $cartItem->rowId)->first()->price,
                                'currency' => 'VND',
                                'num_items' => $newQuantity,
                            ];
                            FacebookConversionsAPI::sendConversionEvent('AddToCart', $eventData);
                        }

                        $isAddCart = false;
                    }
                }
                if ($isAddCart) {
                    $price = $product->is_flash_sale_cart ? $product->sale_price : $product->price;

                    Cart::add([
                        'id' => $product->id,
                        'name' => $product->title,
                        'price' =>  $price,
                        'qty' => $params['quantity'],
                        'weight' => 0
                    ]);

                    $cartItems = Cart::content();
                    $eventData = [
                        'content_name' => $cartItems->last()->name,
                        'content_type' => 'product_group',
                        'content_ids' => [$cartItems->last()->id],
                        'value' => $cartItems->last()->price,
                        'currency' => 'VND',
                        'num_items' => $cartItems->last()->qty,
                    ];
                    FacebookConversionsAPI::sendConversionEvent('AddToCart', $eventData);
                }
            }

            if (request()->wantsJson()) {
                return $this->getCartContent();
            }

            return redirect()->back();
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function update($rowId)
    {
        Cart::instance('cart')->update($rowId, request('quantity'));

        if (request()->wantsJson()) {
            return $this->getCartContent();
        }

        return redirect()->back();
    }

    public function destroy($rowId)
    {
        Cart::instance('cart')->remove($rowId);

        if (request()->wantsJson()) {
            return $this->getCartContent();
        }

        return redirect()->back();
    }

    public function empty()
    {
        $cart = Cart::instance('cart')->content();

        foreach ($cart as $cartItem) {
            Cart::remove($cartItem->rowId);
        }

        return redirect()->back();
    }

    private function getCartContent()
    {
        $shoppingCart = new ShoppingCart();
        return $shoppingCart->getContent();
    }
}
