<?php

namespace App\Models;

use Gloudemans\Shoppingcart\Facades\Cart as FacadesCart;

use JamstackVietnam\Core\Models\BaseModel;

use JamstackVietnam\Cart\Models\ShoppingCart;

class Cart extends BaseModel
{
    public static function getList()
    {
        $shoppingCart = new ShoppingCart();
        $data = $shoppingCart->getContent();

        return $data;
    }

    public static function empty()
    {
        $cart = FacadesCart::content();

        foreach ($cart as $cartItem) {
            FacadesCart::remove($cartItem->rowId);
        }

        return $cart;
    }
}
