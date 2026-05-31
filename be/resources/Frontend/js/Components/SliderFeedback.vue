<template>
    <section class="md:py-[56px] py-12 xl:py-[72px]">
        <div class="container space-y-6">
            <h2 class="display-3 font-bold text-white">Những phản hồi từ khách hàng của Lotus </h2>
            <div class="relative">
                <swiper ref="swiperRef" :slides-per-view="3" :space-between="32" :loop="true"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }" :breakpoints="{
                        320: { slidesPerView: 1.2, spaceBetween: 14 },
                        768: { slidesPerView: 2.2, spaceBetween: 20 },
                        1024: { slidesPerView: 2.8, spaceBetween: 32 },
                        1280: { slidesPerView: 2.7, spaceBetween: 32 },
                    }" @swiper="onSwiperInit" class="section-feedback">
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <AnimatedAppear :delay="(index*10)+300">
                            <div
                                class="md:p-6 p-6 xl:p-8 md:space-y-12 space-y-8 xl:space-y-[88px] relative overflow-hidden rounded-[48px] bg-white shadow-style">
                                <div class="space-y-4">
                                    <div class="flex items-center gap-2">
                                        <Star v-for="indexStar in item.rating" :key="indexStar" />
                                    </div>
                                    <div class="body-1 min-h-[96px] notranslate">{{ item.content }}</div>
                                </div>
                                <div class="space-y-2">
                                    <div class="body-1 font-extrabold notranslate">{{ item.customer_name }}</div>
                                    <div class="body-2 uppercase min-h-[40px] notranslate">{{ item.course_title }}</div>
                                </div>
                            </div>
                        </AnimatedAppear>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import CardCourseDetail from './Card/CardCourseDetail.vue'
import Star from './Icons/Star.vue'
import AnimatedAppear from './AnimatedAppear.vue'

export default {
    props: ['items'],
    components: {
        Swiper,
        SwiperSlide,
        CardCourseDetail,
        Star,
    },
    setup() {
        const swiperRef = ref(null)
        const swiperInstance = ref(null)
        const onSwiperInit = (swiper) => {
            swiperInstance.value = swiper
        }
        const onPrevClick = () => {
            if (swiperInstance.value) {
                swiperInstance.value.slidePrev()
            }
        }
        const onNextClick = () => {
            if (swiperInstance.value) {
                swiperInstance.value.slideNext()
            }
        }
        return {
            swiperRef,
            onPrevClick,
            onNextClick,
            onSwiperInit,
        }
    },
}
</script>
<style lang="scss" scoped>
.section-feedback {
    overflow: visible;
}
</style>
