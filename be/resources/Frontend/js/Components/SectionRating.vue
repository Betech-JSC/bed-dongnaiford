<template>
    <section class="md:py-16 py-12 xl:py-20 bg-linear relative overflow-hidden">
        <div class="container md:space-y-8 space-y-6 xl:space-y-10">
            <AnimatedAppear>
                <h2 class="display-2 font-bold text-center text-gray-900">{{ $page.props.locale.current === 'zh' ? '客户反馈' : tt('Phản hồi từ học viên') }}</h2>
            </AnimatedAppear>
            <div class="md:space-y-16 space-y-10 xl:space-y-[111px]">
                <div class="relative">
                    <swiper ref="swiperRef" :slides-per-view="3" :space-between="32" :loop="true"
                        :autoplay="{ delay: 3000, disableOnInteraction: false }" :breakpoints="{
                            320: { slidesPerView: 1.1, spaceBetween: 14 },
                            768: { slidesPerView: 2.2, spaceBetween: 20 },
                            1024: { slidesPerView: 2.8, spaceBetween: 32 },
                            1280: { slidesPerView: 2.7, spaceBetween: 32 },
                        }" :modules="modules" @swiper="onSwiperInit" class="swiper-rating">
                        <swiper-slide v-for="(item, index) in items" :key="index" class="pb-8">
                            <div
                                class="md:p-6 p-6 xl:p-8 flex flex-col justify-between h-full relative overflow-hidden rounded-[48px] bg-white shadow-style">
                                <div class="space-y-4">
                                    <div class="flex items-center gap-2">
                                        <Star v-for="indexStar in item.rating" :key="indexStar" />
                                    </div>
                                    <div class="body-1 min-h-[96px] notranslate">{{ item.content }}</div>

                                    <div v-if="item.image_url" class="rounded-2xl overflow-hidden border border-gray-100 aspect-w-16 aspect-h-9">
                                        <JPicture :src="item.image_url" :alt="item.customer_name" wrapperClass="picture-cover" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div class="space-y-2 mt-8 md:mt-12">
                                    <div class="body-1 font-extrabold notranslate">{{ item.customer_name }}</div>
                                    <div class="body-2 uppercase min-h-[40px] notranslate">{{ item.course_title }}</div>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="flex items-center justify-center md:gap-12 gap-5 xl:gap-16">
                    <AnimatedAppear v-for="(itemSponsor, indexSponsor) in sponsors" :key="indexSponsor"
                        :delay="indexSponsor * 100"
                        class="w-auto h-8 md:h-[60px]">
                        <JPicture :src="itemSponsor.logo_url" :alt="itemSponsor.name" wrapperClass="picture-cover"
                            class="w-full h-full object-cover" />
                    </AnimatedAppear>
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

export default {
    props: ['items', 'sponsors'],
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
.swiper-rating {
    overflow: visible;
}

.bg-linear {
    background: linear-gradient(180deg, rgba(255, 239, 153, 0.8) 0%, #C29000 100%);
}

.shadow-style {
    box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.1);
}
</style>
