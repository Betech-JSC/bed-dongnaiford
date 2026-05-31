<template>
    <div class="relative">
        <swiper
            ref="swiperRef"
            :slides-per-view="3"
            :space-between="32"
            :loop="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :breakpoints="{
                320: { slidesPerView: 1.5, spaceBetween: 12 },
                768: { slidesPerView: 2.5, spaceBetween: 16 },
                1024: { slidesPerView: 3.3, spaceBetween: 16 },
                1280: { slidesPerView: 5, spaceBetween: 16 },
            }"
            @swiper="onSwiperInit"
        >
            <swiper-slide v-for="(item, index) in items" :key="index">
                <CardBook :item="item" />
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import CardBook from './Card/CardBook.vue'

export default {
    props: ['items'],
    components: {
        Swiper,
        SwiperSlide,
        CardBook,
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
