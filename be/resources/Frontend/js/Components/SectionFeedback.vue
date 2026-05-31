<template>
    <section class="relative">
        <div class="absolute inset-0">
            <JPicture alt="background feedback" src="/assets/images/home/bg-feedback.jpg"
                class="w-full h-full object-cover" />
        </div>
        <div class="relative py-[94px]">
            <div class="container space-y-8">
                <AnimatedAppear>
                    <h2 class="display-3 uppercase text-center text-primary font-bold">Client feedback</h2>
                </AnimatedAppear>
                <div class="relative">
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
                                <div class="bg-white p-6 rounded-[8px] space-y-6">
                                    <ul class="flex items-center gap-1">
                                        <li v-for="indexStar in 5" :key="indexStar">
                                            <Star />
                                        </li>
                                    </ul>
                                    <div class="body-2 text-gray-900 h-[160px] notranslate" v-html="item.content" translate="no"></div>
                                    <div class="flex items-start gap-3">
                                        <div class="w-[60px] h-[60px] rounded-full overflow-hidden">
                                            <JPicture :src="item.image?.url" :alt="item.image?.alt || item.name"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="space-y-0.5">
                                            <div class="body-1 text-gray-900 font-bold">{{ item.title }}</div>
                                            <div class="body-3 text-gray-700">{{ item.description }}</div>
                                        </div>
                                    </div>
                                </div>
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
import ArrowSlider from '@/Components/Icons/ArrowSlider.vue'
import Arrow from '@/Components/Icons/Arrow.vue'
import Star from './Icons/Star.vue'

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
        ArrowSlider,
        Arrow,
        Star,
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
    @apply absolute z-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-brand-100 rounded-full lg:hover:bg-brand-100 lg:hover:text-brand-200 hidden xl:flex items-center justify-center duration-300 ease-in-out;
}

.swiper-button-prev {
    @apply -left-16;
}

.swiper-button-next {
    @apply -right-16;
}
</style>
