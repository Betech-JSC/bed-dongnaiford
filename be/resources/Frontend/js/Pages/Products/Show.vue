<template>
    <main>
        <div class="relative bg-black overflow-hidden">
            <div class="absolute inset-0 w-full max-h-[450px] xl:max-h-[554px]">
                <JPicture :src="product.banner_detail_url || '/assets/images/demo/bg-course-static.jpg'" alt="image banner" class="w-full h-full object-cover" />
            </div>
            <div class="absolute bottom-0 left-0 w-full h-[554px] bg-bottom"></div>
           <div class="relative z-10">
            <section class="py-12 md:py-14">
                <div class="container">
                    <div class="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
                        <div class="col-span-full md:col-span-5 space-y-3">
                            <AnimatedAppear class="w-full relative rounded-[24px] overflow-hidden">
                                <div class="aspect-w-1 aspect-h-1">
                                    <JPicture
                                        :src="product.image_url || '/assets/placeholder-col.jpg'"
                                        :alt="product.title || 'image product'"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                            </AnimatedAppear>
                            <AnimatedAppear :delay="500" class="bg-linear text-white rounded-xl relative overflow-hidden p-3 space-y-[22px]">
                                <div class="headline-3 font-bold notranslate">{{ product.author }}</div>
                                <div class="body-1 whitespace-pre-line notranslate">
                                    {{ product.author_description }}
                                </div>
                            </AnimatedAppear>
                        </div>
                        <div class="col-span-full md:col-span-7 text-white space-y-8">
                            <AnimatedAppear>
                                <h1 class="headline-1 font-bold uppercase notranslate">
                                    {{ product.title }}
                                </h1>
                            </AnimatedAppear>
                            <AnimatedAppear :delay="500" class="space-y-6">
                                <div v-if="product.overview" class="space-y-6">
                                    <div class="bg-title px-4 py-3 rounded-full title-1 uppercase font-bold">
                                        {{ tt('Giới thiệu tổng quan') }}
                                    </div>
                                    <div class="body-1 notranslate" v-html="product.overview" translate="no"></div>
                                </div>
                                <div v-if="product.overview_courses" class="space-y-6">
                                    <div class="bg-title px-4 py-3 rounded-full title-1 uppercase font-bold">
                                        {{ tt('Nội dung khóa học') }}
                                    </div>
                                    <div class="body-1 notranslate" v-html="product.overview_courses" translate="no"></div>
                                </div>
                                <div v-if="product.overview_future" class="space-y-6">
                                    <div class="bg-title px-4 py-3 rounded-full title-1 uppercase font-bold">
                                        {{ tt('Hướng tới') }}
                                    </div>
                                    <div class="body-1 notranslate" v-html="product.overview_future" translate="no"></div>
                                </div>
                            </AnimatedAppear>
                            <Link :href="route('contact')" class="btn btn-secondary">
                                <span>{{ tt('Đăng Ký Ngay') }}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <SliderCourseDetail v-if="product && product.sections && product.sections.length > 0" :items="[...product.sections, ...product.sections]" :title="product.sections_title" />
            <SliderFeedback v-if="reviews && reviews.length > 0" :items="[...reviews, ...reviews]" />
           </div>
        </div>
    </main>
</template>
<script>
import AnimatedAppear from '@/Components/AnimatedAppear.vue';
import SliderCourseDetail from '@/Components/SliderCourseDetail.vue'

export default {
    props: ['product', 'reviews'],
    components: { SliderCourseDetail },
}
</script>
<style lang="scss" scoped>
.bg-title {
    background: linear-gradient(90deg, #e6c200 0%, #d88c14 100%);
}
.bg-bottom {
    background: linear-gradient(180deg, rgba(255, 239, 153, 0) 0%, #C29000 100%), #000000;
}
.bg-linear {
    background: linear-gradient(180deg, #e6c200 0%, #121872 100%);
}
</style>
