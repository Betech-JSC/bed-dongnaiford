<template>
    <section class="py-8 max-md:pb-6">
        tat
        <div class="container pb-6 md:pb-8 xl:pb-8">
            <div class="border-b-2 border-primary-600 mb-6">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-gray-900 text-2xl mt-[2px]">
                        {{ tt("Sản phẩm nổi bật") }}
                    </h2>
                    <div class="flex items-center gap-2">
                        <p class="text-base font-medium text-gray-700">
                            Xem tất cả
                        </p>
                        <JamPicture
                            src="/assets/images/arrow-right.png"
                            class="h-5 w-5 group-hover:filter group-hover:brightness-75"
                        />
                    </div>
                </div>
            </div>
            <div
                class="grid grid-cols-5 gap-4 max-md:grid-cols-2 max-md:gap-2 max-lg:grid-cols-3 max-lg:gap-3"
            >
                <div
                    class="slide-item w-[55.56%] sm:w-[45.45%] md:w-[33.33%] lg:w-[25%] xl:w-[20%] px-[2px] sm:px-[3px]"
                    v-for="(product, index) in products.data"
                    :key="index"
                >
                    <CardProduct :product="product" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: ["products"],
};
</script>

<style></style>
