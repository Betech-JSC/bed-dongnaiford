<template>
    <section class="md:py-[56px] py-12 xl:py-[72px]">
        <div class="container space-y-6">
            <h2 class="display-3 font-bold text-white">
                {{ title || tt('Hành Trình & Thành Tựu Khóa Học') }}
            </h2>
            <div class="relative">
                <swiper
                    ref="swiperRef"
                    :slides-per-view="3"
                    :space-between="32"
                    :loop="true"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }"
                    :breakpoints="{
                        320: { slidesPerView: 1.2, spaceBetween: 14 },
                        768: { slidesPerView: 2.2, spaceBetween: 16 },
                        1024: { slidesPerView: 3.3, spaceBetween: 16 },
                        1280: { slidesPerView: 2.8, spaceBetween: 28 },
                    }"
                    @swiper="onSwiperInit"
                    class="slider-sections"
                >
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <AnimatedAppear :delay="(index*10)+300">
                            <CardCourseDetail :item="item" />
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
import AnimatedAppear from './AnimatedAppear.vue';

export default {
    props: ['items', 'title'],
    components: {
        Swiper,
        SwiperSlide,
        CardCourseDetail,
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
.slider-sections {
    overflow: visible;
}
</style>
