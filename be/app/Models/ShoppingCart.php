<?php

namespace App\Models;

use Gloudemans\Shoppingcart\Facades\Cart;
use Gloudemans\Shoppingcart\Facades\Cart as FacadesCart;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;

class ShoppingCart
{
    public function getContent(): array
    {
        try {
            $items = Cart::instance('cart')->content();
            $data = [];
            $quantity = 0;
            $productKey = config('cart.cart_form.store.product_key');

            $sub_total = 0;

            if ($productKey == 'product_variant_id') {
                $productVariants = ProductVariant::query()
                    ->active()
                    ->with('product')
                    ->whereIn('id', $items->pluck('id'))
                    ->get();
                foreach ($items as $item) {
                    $productVariant = $productVariants->firstWhere('id', $item->id);

                    if (!empty($productVariant->id) && $productVariant->product->status == Product::STATUS_ACTIVE) {
                        $product = $productVariant->product?->transform($productVariant->id);

                        $saleQuantity = $product['flash_sale_quantity'];

                        if ($saleQuantity == 0 || $saleQuantity >= $item->qty) {
                            $price = $item->qty * $product['price'];
                        } else {
                            $price = $saleQuantity * $product['price'] + ($item->qty - $saleQuantity) * $product['default_price'];
                        }

                        $quantity += $item->qty;
                        $data[] = [
                            'rowId' => $item->rowId,
                            'qty' => $item->qty,
                            'price' => $price,
                            'product' => $product
                        ];
                        $sub_total += $price;
                    } else {
                        Cart::remove($item->rowId);
                    }
                }
            } else if ($productKey == 'product_id') {
                $products = Product::query()
                    ->whereIn('id', $items->pluck('id'))
                    ->get();

                foreach ($items as $item) {
                    $product = $products->firstWhere('id', $item->id)->transform();

                    $quantity += $item->qty;
                    $price = $item->qty * $item->price;
                    $data[] = [
                        'rowId' => $item->rowId,
                        'qty' => $item->qty,
                        'price' =>  $price,
                        'product' => $product
                    ];

                    $sub_total += $price;
                }
            }

            return [
                'deposit_fee' => $sub_total * 0.3,
                'total_price' => $sub_total,
                'total_sub_price' => $sub_total,
                'total_quantity' => $quantity,
                'items' => $data,
            ];
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function getProductsCart()
    {
        $items = Cart::instance('cart')->content();

        $data = [];
        $quantity = 0;

        foreach ($items as $item) {
            $data[] = $item;
            $quantity += $item->qty;
        }

        $data = collect($data)
            ->map(fn($item) => $this->transform($item))->toArray();

        return $data;
    }

    public static function priceTotal()
    {
        $priceTotal = Cart::priceTotal(0);

        return filter_var($priceTotal, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }

    public static function subTotal()
    {
        $priceTotal = Cart::subtotal(0);

        return filter_var($priceTotal, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }

    public static function empty($type = 'cart')
    {
        $items = FacadesCart::instance($type)->content();

        foreach ($items as $item) {
            FacadesCart::remove($item->rowId);
        }

        return $items;
    }

    public function transform($item)
    {
        return [
            'id' => $item->id,
            'qty' => $item->qty,
        ];
    }
}
