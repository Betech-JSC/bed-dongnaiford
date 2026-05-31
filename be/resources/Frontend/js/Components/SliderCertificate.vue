<template>
    <section class="md:py-16 py-12 xl:py-20 relative overflow-hidden">
        <div class="container md:space-y-16 space-y-12 xl:space-y-20">
            <AnimatedAppear>
                <h2 class="display-1 font-bold text-center">
                    {{ tt('Chuỗi khóa học giao dịch') }} <br />
                    {{ tt('chất lượng cao tại') }} <span class="text-linear">TOKYO</span>
                </h2>
            </AnimatedAppear>
            <div class="md:space-y-6 space-y-4 xl:space-y-8">
                <AnimatedAppear class="headline-1 italic !font-sans">{{ tt('Khóa học') }}</AnimatedAppear>
                <AnimatedAppear class="max-w-[300px] md:max-w-[545px] w-full h-8 md:h-16">
                    <JPicture
                        src="/assets/images/home/text-station.png"
                        alt="text station"
                        class="w-full h-full object-cover"
                    />
                </AnimatedAppear>
                <div class="relative">
                    <swiper
                        ref="swiperRef"
                        :slides-per-view="3"
                        :space-between="32"
                        :loop="true"
                        :autoplay="{ delay: 3000, disableOnInteraction: false }"
                        :breakpoints="{
                            320: { slidesPerView: 1.1, spaceBetween: 14 },
                            768: { slidesPerView: 2.2, spaceBetween: 20 },
                            1024: { slidesPerView: 2.8, spaceBetween: 24 },
                            1280: { slidesPerView: 1.2, spaceBetween: 24 },
                        }"
                        :modules="modules"
                        @swiper="onSwiperInit"
                        class="swiper-certificate"
                    >
                        <swiper-slide v-for="(item, index) in items" :key="index">
                            <div class="bg-gray-100">
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
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
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
            modules,
            swiperRef,
            onPrevClick,
            onNextClick,
            onSwiperInit,
        }
    },
}
</script>
<style lang="scss" scoped>
.swiper-certificate {
    overflow: visible;
}
.text-linear {
    background: linear-gradient(90deg, #C29601 0%, #000000 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}
</style>
