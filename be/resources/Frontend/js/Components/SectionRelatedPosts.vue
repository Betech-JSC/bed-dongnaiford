<template>
    <section v-if="items && items.length" :class="customClass || 'border-t border-gray-300 bg-gray-100 pt-10 md:pb-16 pb-12 xl:pb-20'">
        <div class="container space-y-4 md:space-y-6 xl:space-y-8">
            <h2 class="display-3 text-center font-bold">{{ title }}</h2>
            <div class="relative">
                <button class="btn-swiper swiper-button-prev" @click="onPrevClick">
                    <Chervon class="w-5 h-5" />
                </button>
                <button class="btn-swiper swiper-button-next" @click="onNextClick">
                    <Chervon class="w-5 h-5" />
                </button>
                <swiper ref="swiperRef" :slides-per-view="4" :space-between="32" :loop="true"
                    :autoplay="{ delay: 1000, disableOnInteraction: false }" :breakpoints="breakpoints"
                    @swiper="onSwiperInit">
                    <swiper-slide v-for="(item, index) in items" :key="index">
                        <CardCardPost :item="item" />
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
import CardPost from './Card/CardPost.vue'
import Chervon from '@/Components/Icons/Chervon.vue'
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
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
            }),
        },
        title: {
            type: String,
            default: 'Các tin tức liên quan',
        },
        customClass: {
            type: String,
            default: '',
        },
    },
    components: {
        Swiper,
        SwiperSlide,
        CardPost,
        Chervon,
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
    @apply absolute z-10 top-1/2 -translate-y-1/2 text-white bg-primary-400 lg:hover:bg-primary rounded-full w-12 h-12 hidden lg:flex items-center justify-center duration-300 ease-in-out;
}

.swiper-button-prev {
    @apply xl:-left-16 lg:-left-6 -left-4 rotate-180;
}

.swiper-button-next {
    @apply xl:-right-16 lg:-right-6 -right-4;
}
</style>
