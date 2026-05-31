<template>
    <section v-if="items && items.length" class="relative py-12 overflow-hidden">
        <div class="container">
            <div class="relative">
                <div class="flex md:flex-row flex-col max-md:gap-3 items-center justify-between">
                    <AnimatedAppear animate="slideleft">
                        <h2 class="display-3 text-brand-100 font-bold uppercase">Latest News</h2>
                    </AnimatedAppear>
                    <AnimatedAppear animate="slideright">
                        <Link :href="route('posts')"
                            class="btn btn-secondary space-x-3 flex items-center justify-center">
                        <span>{{ tt('See More') }}</span>
                        <Arrow />
                        </Link>
                    </AnimatedAppear>
                </div>

                <div class="relative mt-6 md:mt-8 xl:mt-10 md:mb-6 mb-4 xl:mb-8">
                    <button v-if="items && items.length > 3" class="btn-swiper swiper-button-prev" @click="onPrevClick">
                        <ArrowSlider class="rotate-180" />
                    </button>
                    <button v-if="items && items.length > 3" class="btn-swiper swiper-button-next" @click="onNextClick">
                        <ArrowSlider />
                    </button>
                    <swiper ref="swiperRef" :slides-per-view="4" :space-between="32" :loop="true"
                        :autoplay="{ delay: 1000, disableOnInteraction: false }" :breakpoints="breakpoints"
                        @swiper="onSwiperInit">
                        <swiper-slide v-for="(item, index) in items" :key="index">
                            <AnimatedAppear :delay="index * 100">
                                <CardCardPost :item="item" />
                            </AnimatedAppear>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import CardPost from './Card/CardPost.vue'
import ArrowSlider from '@/Components/Icons/ArrowSlider.vue'
import Arrow from '@/Components/Icons/Arrow.vue'
import AnimatedAppear from './AnimatedAppear.vue'

export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        breakpoints: {
            type: Object,
            default: () => ({
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
            }),
        },
    },
    components: {
        Swiper,
        SwiperSlide,
        CardPost,
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
    @apply absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-brand-100 rounded-full lg:hover:bg-brand-100 lg:hover:text-brand-200 flex items-center justify-center duration-300 ease-in-out;
}

.swiper-button-prev {
    @apply -left-16;
}

.swiper-button-next {
    @apply -right-16;
}
</style>
