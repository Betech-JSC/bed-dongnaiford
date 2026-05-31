<template>
    <div
        v-if="product"
        class="xl:space-x-[8px] lg:space-x-[6px] md:space-x-[10px] max-md:space-y-[6px] flex md:flex-row flex-col max-md:p-2 max-md:border max-md:border-gray-200 max-md:rounded-lg"
    >
        <Link
            class="xl:w-[80px] lg:w-[56px] md:w-[92px] xl:h-[80px] lg:h-[56px] md:h-[92px] flex-none max-md:px-2 max-md:aspect-w-1 max-md:aspect-h-1 overflow-hidden md:rounded-lg rounded"
            :href="
                route('products.show', {
                    slug: product.slug,
                })
            "
        >
            <JamPicture
                :src="
                    product.image && product.image.url
                        ? product.image.url
                        : '/assets/images/cover.webp'
                "
                :alt="
                    product.image && product.image.alt
                        ? product.image.alt
                        : product.title
                "
                class="picture-contain"
                classCustom="mt-auto"
            />
        </Link>
        <div>
            <Link
                :href="
                    route('products.show', {
                        slug: product.slug,
                    })
                "
                class="font-medium text-gray-800 line-clamp-2"
            >
                {{ product.title }}
            </Link>

            <div
                v-if="product.origin && product.origin.title"
                class="flex flex-wrap items-center text-gray-400 caption"
            >
                <span class="mr-1 whitespace-nowrap">Xuất xứ:</span>
                <span class="text-gray-700">
                    {{ product.origin.title }}
                </span>
            </div>

            <div
                v-if="product.brand && product.brand.title"
                class="flex flex-wrap items-center text-gray-400 caption"
            >
                <span class="mr-1 whitespace-nowrap">Thương hiệu:</span>
                <span class="text-gray-700">
                    {{ product.brand.title }}
                </span>
            </div>
            <div class="flex flex-wrap items-center space-x-1">
                <div class="font-bold text-green-600">
                    {{ toPrice(product.price) }}
                </div>
                <div
                    v-if="product.old_price && Number(product.old_price) > 0"
                    class="text-gray-400 line-through description leading-[100%]"
                >
                    {{ toPrice(product.old_price) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["product"],
};
</script>
