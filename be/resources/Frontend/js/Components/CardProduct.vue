<template>
    <div v-if="product.slug" class="group relative">
        <Link
            :href="
                route('products.show', {
                    slug: product?.slug || '',
                })
            "
            class="group"
        >
            <div class="space-y-[12px]">
                <div class="aspect-w-1 aspect-h-1 rounded-[4px] overflow-hidden">
                    <JPicture
                        :src="product.image?.url || '/assets/images/cover.jpg'"
                        class="w-full h-full lg:group-hover:scale-105 lg:duration-150 picture-contain"
                    />
                </div>
                <div class="space-y-[8px] headline-1 w-full">
                    <div class="title-2 text-black line-clamp-2">{{ product?.title }}</div>
                    <div class="label-2 text-white flex items-center justify-between space-y-[12px]">
                        <div v-if="product.is_sale">
                            <p class="title-3 text-gray-900 line-through">{{ toMoney(product?.price) }}</p>
                            <div class="flex items-center gap-x-1">
                                <p class="title-2 text-gray-900">{{ toMoney(product?.sale_price) }}</p>
                                <p class="body-1 text-gray-900 font-normal">/ngày</p>
                            </div>
                        </div>
                        <div v-else class="flex items-center gap-x-1">
                            <p class="title-2 text-gray-900">{{ toMoney(product?.price) }}</p>
                            <p class="body-1 text-gray-900 font-normal">/ngày</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-0 right-0 z-1 px-2 py-[2px] linear_sale" v-if="product.is_sale">
                <p class="label-3 text-white font-semibold">{{ product.title_sale }}</p>
            </div>
        </Link>
    </div>
</template>
<script>
export default {
    props: ['product'],
}
</script>
<style scoped>
.linear_sale {
    background: linear-gradient(81deg, #1da89f 8.3%, #025e33 103.63%);
}
</style>
