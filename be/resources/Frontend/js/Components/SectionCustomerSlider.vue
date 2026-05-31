<template>
    <section class="relative py-12 md:py-16 xl:py-20 overflow-hidden bg-primary-25">
        <div class="container md:space-y-12 space-y-8 xl:space-y-16">
            <div class="grid md:grid-cols-2 gap-6 xl:gap-16">
                <div class="flex items-center">
                    <div class="display-2 text-primary-800">
                        Từ một món quà nhỏ – thương hiệu của bạn được nhớ lâu hơn.
                    </div>
                </div>
                <div class="aspect-w-7 aspect-h-5">
                    <JPicture
                        src="/assets/images/products/image-gift.webp"
                        alt="Gift image"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div class="relative">
                <div class="flex items-center justify-between">
                    <h2 class="display-3 text-primary uppercase">Khách hàng nói gì về chúng tôi</h2>
                    <div class="hidden md:flex items-center gap-4 md:gap-5 xl:gap-6">
                        <button class="btn-swiper swiper-button-prev" @click="onPrevClick">
                            <ArrowSlider />
                        </button>
                        <button class="btn-swiper swiper-button-next" @click="onNextClick">
                            <ArrowSlider />
                        </button>
                    </div>
                </div>

                <div class="relative mt-6 md:mt-8 xl:mt-10 md:mb-6 mb-4 xl:mb-8">
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
                            <div class="p-3 space-y-3 bg-primary-100 min-h-[240px] group">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 relative">
                                        <JPicture
                                            src="/assets/images/home/image-partner.webp"
                                            alt="image partner"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span
                                        class="title-2 text-gray-900 lg:group-hover:text-primary-800 duration-300 ease-in-out"
                                        >{{ item.title }}</span
                                    >
                                </div>
                                <div class="body-2">
                                    {{ item.description }}
                                </div>
                            </div>
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
                320: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
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
</style>
