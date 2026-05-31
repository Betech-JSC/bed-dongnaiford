<template>
    <Link
        v-if="item"
        :href="
            route('products.show', {
                slug: item.slug ?? '',
            })
        "
        class="relative"
    >
        <div class="space-y-[12px] group">
            <div class="aspect-w-1 aspect-h-1 rounded-[4px] overflow-hidden">
                <JPicture
                    :src="item.image?.url || '/assets/images/products/item.png'"
                    class="w-full lg:group-hover:scale-105 lg:duration-150 picture-cover"
                    :alt="item.alt || item.title"
                />
            </div>
            <div class="space-y-[8px] headline-1 w-full">
                <div class="title-2 text-black">
                    {{ item.title }}
                </div>
                <div class="label-2 text-white flex items-center justify-between space-y-[12px]">
                    <div class="space-x-[4px]">
                        <strong class="title-2 text-gray-900">{{ item.brand?.title }}</strong>
                        <strong class="body-1 text-gray-900">/{{ item.brand?.desc }}</strong>
                    </div>
                    <!-- <div v-if="item.is_stock" class="bg-[#12B76A] text-white py-[2px] px-[8px] rounded-[2px]">
                        in stock
                    </div> -->
                </div>
            </div>
        </div>
        <!-- <div
            v-if="item.is_new"
            class="bg-[#175CD3] text-white rounded-[4px] absolute top-[10px] right-[10px] font-medium py-[2px] px-[8px]"
        >
            New
        </div> -->
    </Link>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
}
</script>
