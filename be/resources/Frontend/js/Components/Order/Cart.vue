<template>
    <div v-if="cart" class="product-cart group">
        <div class="flex">
            <Link
                :href="
                    route('products.show', {
                        slug: cart.product.slug,
                        id: cart.product.variant.id,
                    })
                "
                class="w-[64px] h-[64px] flex-shrink-0 block overflow-hidden"
            >
                <JamPicture
                    :src="
                        cart.product.variant.image.url ||
                        '/assets/images/cover.webp'
                    "
                    class="duration-200 picture-cover group-hover:scale-105"
                    :alt="cart.product.title"
                />
            </Link>

            <div class="flex-1 mr-4 ml-3">
                <Link
                    :href="
                        route('products.show', {
                            slug: cart.product.slug,
                            id: cart.product.variant.id,
                        })
                    "
                    class="font-medium text-gray-900 duration-200 line-clamp-2 caption hover:text-primary-600 mb-0.5"
                >
                    <h3>
                        {{ cart.product.title }}
                    </h3>
                </Link>
                <div class="" v-if="cart.product.option_values?.length">
                    <div
                        v-for="option in cart.product.option_values"
                        class="mr-2 text-gray-700 description mb-0.5"
                    >
                        {{ option.split(":")[0] }}:
                        <span class="font-medium text-gray-800">{{
                            option.split(":")[1]
                        }}</span>
                    </div>
                    <p class="font-medium label_2 text-gray-700">
                        x{{ quantity }}
                    </p>
                    <div class="font-medium label_2 text-gray-700">
                        {{ toPrice(cart.price) }}
                    </div>
                </div>
            </div>
            <div
                class="py-[2px] px-[6px] rounded bg-gray-100 flex items-center justify-center w-8 h-6"
            >
                <button @click="deleteCart()" class="w-full h-full">
                    <JamPicture
                        src="/assets/svg/delete.svg"
                        class="w-full h-full"
                    />
                </button>
            </div>
        </div>

        <FreeShipTag v-if="cart.product.free_shipping" />
    </div>
</template>
<script>
import axios from "axios";
import { useAppStore } from "@/stores/index";
export default {
    props: ["cart"],
    data() {
        return {
            isLoading: false,
            quantity: Number(this.cart.qty),
        };
    },
    computed: {
        appStore() {
            return useAppStore();
        },
        locationID: function () {
            return useAppStore().locationID;
        },
    },
    watch: {
        quantity(newVal, oldVal) {
            if (this.isLoading) return;
            if (newVal === 0) {
                this.deleteCart();
            } else {
                if (newVal > oldVal) {
                    this.tracking(newVal - oldVal);
                }
                this.updateCart();
            }
        },
        cart(newVal) {
            if (newVal && newVal.qty) {
                this.quantity = Number(newVal.qty);
            }
        },
    },
    methods: {
        tracking(number) {
            if (typeof this.$gtm !== "undefined") {
                this.$gtm.trackEvent({
                    event: "add_to_cart", // Event type [default = 'interaction'] (Optional)
                    action: "click",
                    value: this.cart.product.price,
                    items: [
                        {
                            id: this.cart.product.variant_id.toString(),
                            google_business_vertical: "retail",
                        },
                    ],
                });
            }
            if (typeof fbq !== "undefined") {
                fbq("track", "AddToCart", {
                    content_ids: [this.cart.product.variant_id.toString()],
                    content_type: "product_group",
                    content_name: this.cart.product.title,
                    value: this.cart.product.price,
                    currency: "VND",
                    num_items: number,
                });
            }
            if (typeof ttq !== "undefined") {
                ttq.track("AddToCart", {
                    content_id: this.cart.product.variant_id.toString(),
                    content_type: "product",
                    content_name: this.cart.product.title,
                    value: this.cart.product.price,
                    currency: "VND",
                });
            }
        },

        async updateCart() {
            if (this.isLoading) return;
            this.isLoading = true;

            let cartOrder = null;

            const { data } = await axios.put(
                this.route("checkout.cart.update", {
                    rowId: this.cart.rowId,
                    quantity: this.quantity,
                })
            );

            cartOrder = data;

            if (this.locationID) {
                const base_url = this.route("checkout.shipping");
                const { data } = await axios.get(base_url, {
                    params: {
                        region: this.locationID,
                    },
                });
                // TODO
                if (data?.data) cartOrder = data.data;
            }

            this.appStore.$patch({
                cart: cartOrder,
            });
            this.isLoading = false;
        },
        async deleteCart() {
            if (this.isLoading) return;
            this.isLoading = true;

            let cartOrder = null;

            const { data } = await axios.put(
                this.route("checkout.cart.destroy", {
                    rowId: this.cart.rowId,
                })
            );

            cartOrder = data;

            if (this.locationID) {
                const base_url = this.route("checkout.shipping");
                const { data } = await axios.get(base_url, {
                    params: {
                        region: this.locationID,
                    },
                });
                // TODO
                if (data?.data) cartOrder = data.data;
            }
            this.appStore.$patch({
                cart: cartOrder,
            });
            this.isLoading = false;
        },
    },
};
</script>
