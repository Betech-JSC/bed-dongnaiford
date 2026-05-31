<template>
    <div class="flex items-center justify-between group">
        <Link
            :href="
                route('products.show', {
                    slug: cart.product?.slug || '',
                })
            "
            class="flex items-center gap-x-3 group"
        >
            <div class="aspect-square w-20">
                <JPicture
                    :src="cart.product.image?.url || '/assets/images/products/new/item.png'"
                    class="w-full h-full lg:group-hover:scale-105 lg:duration-150 picture-contain"
                />
            </div>
            <div class="space-y-[6px] headline-1 flex-[1-0-0]">
                <p class="title-4 text-gray-700 font-bold">X{{ cart?.qty }}</p>
                <div class="title-3 font-bold line-clamp-2">
                    {{ cart?.product?.title }}
                </div>
                <div class="label-2 text-white flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex items-center space-x-[12px]">
                            <p class="title-3 text-gray-900">{{ toMoney(cart.product?.price) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
        <div @click="deleteCart(cart?.rowId)" class="w-6 h-6 cursor-pointer">
            <img src="/assets/svg/delete.svg" class="w-full h-full" />
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { useAppStore } from '@/stores/index'
export default {
    props: ['cart'],
    emits: ['deleteItem'],
    data() {
        return {
            isLoading: false,
            quantity: Number(this.cart.qty),
        }
    },
    computed: {
        appStore() {
            return useAppStore()
        },
        locationID: function () {
            return useAppStore().locationID
        },
    },
    watch: {
        quantity(newVal, oldVal) {
            if (this.isLoading) return
            if (newVal === 0) {
                this.deleteCart()
            } else {
                if (newVal > oldVal) {
                    this.tracking(newVal - oldVal)
                }
                this.updateCart()
            }
        },
        cart(newVal) {
            if (newVal && newVal.qty) {
                this.quantity = Number(newVal.qty)
            }
        },
    },
    methods: {
        tracking(number) {
            if (typeof this.$gtm !== 'undefined') {
                this.$gtm.trackEvent({
                    event: 'add_to_cart', // Event type [default = 'interaction'] (Optional)
                    action: 'click',
                    value: this.cart.product.price,
                    items: [
                        {
                            id: this.cart.product.variant_id.toString(),
                            google_business_vertical: 'retail',
                        },
                    ],
                })
            }
            if (typeof fbq !== 'undefined') {
                fbq('track', 'AddToCart', {
                    content_ids: [this.cart.product.variant_id.toString()],
                    content_type: 'product_group',
                    content_name: this.cart.product.title,
                    value: this.cart.product.price,
                    currency: 'VND',
                    num_items: number,
                })
            }
            if (typeof ttq !== 'undefined') {
                ttq.track('AddToCart', {
                    content_id: this.cart.product.variant_id.toString(),
                    content_type: 'product',
                    content_name: this.cart.product.title,
                    value: this.cart.product.price,
                    currency: 'VND',
                })
            }
        },

        async updateCart() {
            if (this.isLoading) return
            this.isLoading = true

            let cartOrder = null

            const { data } = await axios.put(
                this.route('checkout.cart.update', {
                    rowId: this.cart.rowId,
                    quantity: this.quantity,
                })
            )

            cartOrder = data

            if (this.locationID) {
                const base_url = this.route('checkout.shipping')
                const { data } = await axios.get(base_url, {
                    params: {
                        region: this.locationID,
                    },
                })
                // TODO
                if (data?.data) cartOrder = data.data
            }

            this.appStore.$patch({
                cart: cartOrder,
            })
            this.isLoading = false
        },
        async deleteCart(rowId) {
            if (this.isLoading) return
            this.isLoading = true

            let cartOrder = null

            const { data } = await axios.put(
                this.route('checkout.cart.destroy', {
                    rowId: rowId,
                })
            )

            cartOrder = data

            this.appStore.$patch({
                cart: cartOrder,
            })
            this.isLoading = false

            this.$emit('deleteItem')
        },
    },
}
</script>

<style lang="sass" scoped>
.linear_sale
    background: linear-gradient(81deg, #1da89f 8.3%, #025e33 103.63%)
</style>
