<template>
    <div class="relative">
        <swiper
            ref="swiperRef"
            :slides-per-view="3"
            :space-between="32"
            :loop="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :breakpoints="{
                320: { slidesPerView: 1.2, spaceBetween: 14 },
                768: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 2.8, spaceBetween: 24 },
                1280: { slidesPerView: 2, spaceBetween: 24 },
            }"
            @swiper="onSwiperInit"
            :modules="modules"
            class="swiper-activity"
        >
            <swiper-slide v-for="(item, index) in items" :key="index">
                <div class="bg-gray-100 relative rounded-[12px] overflow-hidden">
                    <div class="aspect-w-3 aspect-h-2">
                        <JPicture
                            :src="item.image?.url"
                            :alt="item.image?.alt || item.title"
                            wrapperClass="picture-cover"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="body-1 text-center py-1.5">{{ item.title }}</div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import CardCourseDetail from './Card/CardCourseDetail.vue'
import Star from './Icons/Star.vue'

export default {
    props: ['items'],
    components: {
        Swiper,
        SwiperSlide,
        CardCourseDetail,
        Star,
    },
    setup() {
        const modules = [Autoplay]
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
.swiper-activity {
    overflow: visible;
}
</style>
