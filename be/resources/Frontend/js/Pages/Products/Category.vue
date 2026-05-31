<template>
    <main>
        <BannerProductCate :item="banner" />
        <section class="bg-gray-100 py-14">
            <div class="container md:space-y-12 space-y-8 xl:space-y-16">
                <div class="md:space-y-12 space-y-8 xl:space-y-16">
                    <AnimatedAppear v-for="(item, index) in products" :key="index" :delay="(index * 5) + 200">
                        <Link
                            class="group relative rounded-[40px] overflow-hidden flex lg:flex-row flex-col items-center bg-gray-900"
                            :href="route('products.show', { slug: item.slug })">
                        <div
                            class="max-w-full lg:max-w-[400px] xl:max-w-[480px] w-full relative rounded-[40px] overflow-hidden">
                            <div class="aspect-w-1 aspect-h-1">
                                <JPicture :src="item.image_url || '/assets/placeholder-col.jpg'" :alt="item.title"
                                    class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div
                            class="flex-1 text-white md:space-y-6 space-y-4 lg:space-y-8 xl:space-y-[64px] py-5 px-4 md:p-8 lg:py-4 lg:px-6 xl:px-8 flex flex-col justify-between">
                            <div class="md:space-y-6 space-y-4 xl:space-y-8 h-full flex flex-col justify-between">
                                <div class="md:space-y-3 space-y-2 xl:space-y-4">
                                    <h3 class="display-3 max-md:text-[20px] font-bold notranslate">{{ item.author }}
                                    </h3>
                                    <div class="title-2 uppercase notranslate">{{ item.title }}</div>
                                </div>
                                <div v-if="item.highlights && item.highlights.length > 0"
                                    class="md:space-y-3 space-y-2 xl:space-y-4 notranslate">
                                    <div v-for="(itemChild, indexChild) in item.highlights" :key="indexChild">
                                        {{ itemChild }}
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div v-if="item.price_sale > 0"
                                        class="headline-3 line-through text-gray-400 notranslate">
                                        {{ toMoney(item.price || 0) }}
                                    </div>
                                    <div v-if="item.price_sale > 0 && item.price > 0"
                                        class="inline-flex items-center justify-center bg-primary text-white rounded-md px-1.5 py-0.5 body-1 font-bold h-fit">
                                        - {{ Math.round((item.price - item.price_sale) / item.price * 100) }}%
                                    </div>
                                </div>
                                <div>
                                    <div v-if="item.price_sale > 0"
                                        class="btn btn-primary display-3 !rounded-full !py-2 xl:!py-3 !px-8 xl:!px-10 w-fit notranslate">
                                        {{ toMoney(item.price_sale || 0) }}
                                    </div>
                                    <div v-else
                                        class="btn btn-primary display-3 !rounded-full !py-2 xl:!py-3 !px-8 xl:!px-10 w-fit notranslate">
                                        {{ toMoney(item.price || 0) }}
                                    </div>
                                </div>
                            </div>

                        </div>
                        </Link>
                    </AnimatedAppear>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import BannerProductCate from '@/Components/BannerProductCate.vue';

export default {
    props: ['category', 'banner', 'categories', 'products'],
    components: { BannerProductCate },
}
</script>
