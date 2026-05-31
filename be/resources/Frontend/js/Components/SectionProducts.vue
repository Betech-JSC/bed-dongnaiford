<template>
    <section class="bg-brand-300 md:py-16 py-12 xl:py-20 relative overflow-hidden">
        <div class="container md:space-y-[56px] space-y-8 xl:space-y-[72px]">
            <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
                <div class="col-span-full lg:col-span-7">
                    <AnimatedAppear animate="slideleft">
                        <h2 class="display-2 font-bold text-brand-100 uppercase">
                            OUR PRODUCTS FRESH FROM GROWING REGIONS IN VIETNAM
                        </h2>
                    </AnimatedAppear>
                </div>
                <div class="col-span-full lg:col-span-5 lg:ml-auto">
                    <AnimatedAppear animate="slideright">
                        <Link :href="route('contact')"
                            class="btn btn-secondary space-x-3 flex items-center justify-center">
                        <span>{{ tt('See More') }}</span>
                        <Arrow />
                        </Link>
                    </AnimatedAppear>
                </div>
            </div>
            <div class="relative">
                <button class="btn-swiper swiper-button-prev" @click="onPrevClick">
                    <ArrowSlider />
                </button>
                <button class="btn-swiper swiper-button-next" @click="onNextClick">
                    <ArrowSlider />
                </button>
                <!-- Sliders -->
                <swiper ref="swiperRef" :slides-per-view="4" :space-between="32" :loop="true"
                    :autoplay="{ delay: 1000, disableOnInteraction: false }" :breakpoints="breakpoints"
                    @swiper="onSwiperInit" class="swiper-product">
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <AnimatedAppear :delay="index * 300">
                            <CardCardProduct :item="item" />
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
import CardProduct from './Card/CardProduct.vue'
import ArrowSlider from '@/Components/Icons/ArrowSlider.vue'
import Arrow from '@/Components/Icons/Arrow.vue'

export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        breakpoints: {
            type: Object,
            default: () => ({
                320: { slidesPerView: 1.4, spaceBetween: 16 },
                768: { slidesPerView: 2.6, spaceBetween: 24 },
                1024: { slidesPerView: 3.3, spaceBetween: 26 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
            }),
        },
    },
    components: {
        Swiper,
        SwiperSlide,
        CardProduct,
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
    @apply absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-brand-100 rounded-full lg:hover:bg-brand-100 lg:hover:text-brand-200 hidden lg:flex items-center justify-center duration-300 ease-in-out;
}

.swiper-button-prev {
    @apply -left-4 xl:-left-16 rotate-180;
}

.swiper-button-next {
    @apply -right-4 xl:-right-16;
}

:deep(.swiper-product) {
    overflow: visible;
}
</style>
