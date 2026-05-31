<template>
    <section v-if="items && items.length" class="relative py-12 md:py-16 xl:py-20 overflow-hidden">
        <div class="container">
            <div class="flex items-center justify-between">
                <h2 class="display-2 text-primary uppercase">
                    {{ title }}
                </h2>
                <div class="hidden md:flex items-center gap-4 md:gap-5 xl:gap-6">
                    <button class="btn-swiper swiper-button-prev" @click="onPrevClick">
                        <ArrowSlider />
                    </button>
                    <button class="btn-swiper swiper-button-next" @click="onNextClick">
                        <ArrowSlider />
                    </button>
                </div>
            </div>

            <div class="relative mt-6 md:mt-8 xl:mt-10 md:mb-6 mb-4 xl:mb-8 notranslate">
                <swiper
                    ref="swiperRef"
                    :slides-per-view="4"
                    :space-between="32"
                    :loop="true"
                    :autoplay="{ delay: 1000, disableOnInteraction: false }"
                    :breakpoints="breakpoints"
                    @swiper="onSwiperInit"
                >
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <CardCardSign :item="item" />
                    </swiper-slide>
                </swiper>
            </div>

            <Link :href="route('posts')" class="btn primary space-x-3 flex items-center justify-center">
                <span>Xem tất cả</span>
                <Arrow />
            </Link>
        </div>
    </section>
</template>
<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import CardSign from './Card/CardSign.vue'
import ArrowSlider from '@/Components/Icons/ArrowSlider.vue'
import Arrow from '@/Components/Icons/Arrow.vue'

export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        items: {
            type: Array,
            default: () => [],
        },
        breakpoints: {
            type: Object,
            default: () => ({
                320: { slidesPerView: 1.2, spaceBetween: 10 },
                768: { slidesPerView: 1.2, spaceBetween: 20 },
                1024: { slidesPerView: 1.2, spaceBetween: 24 },
            }),
        },
    },
    components: {
        Swiper,
        SwiperSlide,
        CardSign,
        ArrowSlider,
        Arrow,
    },
    setup(props) {
        const swiperRef = ref(null) // Tạo ref cho Swiper
        const swiperInstance = ref(null) // Tạo ref để lưu instance Swiper

        // Lấy instance Swiper từ sự kiện
        const onSwiperInit = (swiper) => {
            swiperInstance.value = swiper
        }

        // Xử lý sự kiện nút Previous
        const onPrevClick = () => {
            if (swiperInstance.value) {
                swiperInstance.value.slidePrev()
            } else {
                console.error('Swiper instance not initialized yet.')
            }
        }

        // Xử lý sự kiện nút Next
        const onNextClick = () => {
            if (swiperInstance.value) {
                swiperInstance.value.slideNext()
            } else {
                console.error('Swiper instance not initialized yet.')
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
.btn-swiper {
    @apply relative text-primary-700 w-12 h-12 flex items-center justify-center;
}
.swiper-button-next {
    @apply rotate-180;
}
.swiper {
    overflow: visible;
}
</style>
