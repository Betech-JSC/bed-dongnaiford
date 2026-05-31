<template>
    <section class="xl:pt-20 xl:pb-[60px] md:py-16 py-12 space-y-12 md:space-y-16 xl:space-y-20">
        <div class="container">
            <div class="flex lg:flex-row flex-col items-start md:gap-6 gap-4 xl:gap-8">
                <div class="max-w-full lg:max-w-[320px] w-full">
                    <AnimatedAppear animate="slideleft">
                        <div class="headline-2 font-bold text-brand-100 uppercase">
                            Certified Quality, Globally Trusted
                        </div>
                    </AnimatedAppear>
                </div>
                <div class="md:space-y-6 space-y-4 xl:space-y-8">
                    <AnimatedAppear animate="slideright">
                        <div class="body-1 text-gray-900">
                            At Vietnam Farmer, quality and safety are our top priorities. We comply with international
                            standards and hold globally recognized certifications to ensure our products meet the
                            highest
                            requirements of importers and consumers.
                        </div>
                    </AnimatedAppear>
                    <div class="max-md:grid max-md:grid-cols-2 max-md:gap-3 flex items-center gap-4">
                        <AnimatedAppear v-for="(itemCertificate, indexCertificate) in certifications"
                            :key="indexCertificate" :delay="indexCertificate * 100"
                            class="w-auto h-[90px] xl:h-[120px]">
                            <JPicture :src="itemCertificate.image?.url"
                                :alt="itemCertificate.image?.alt || itemCertificate.title"
                                class="w-full h-full object-contain" />
                        </AnimatedAppear>
                    </div>
                </div>
            </div>

        </div>
        <div class="space-y-6 px-[0.75rem] lg:px-[2rem] xl:px-[5rem]">
            <div class="flex items-center justify-between">
                <AnimatedAppear>
                    <div class="headline-1 font-bold text-brand-100 uppercase">Harvest Season</div>
                </AnimatedAppear>
                <!-- <div class="flex items-center md:gap-6 gap-4 xl:gap-8">
                        <button @click="slidePrev"
                            class="md:w-12 md:h-12 w-8 h-8 flex items-center justify-center text-brand-100 lg:hover:text-brand-300 duration-300 ease-in-out"
                            :disabled="isBeginning" :class="{ 'opacity-50 cursor-not-allowed': isBeginning }">
                            <ArrowSlider class="rotate-180" />
                        </button>
                        <button @click="slideNext"
                            class="md:w-12 md:h-12 w-8 h-8 flex items-center justify-center text-brand-100 lg:hover:text-brand-300 duration-300 ease-in-out"
                            :disabled="isEnd" :class="{ 'opacity-50 cursor-not-allowed': isEnd }">
                            <ArrowSlider />
                        </button>
                    </div> -->
            </div>

            <!-- Custom Title Pagination -->
            <!-- <div class="scrollbar-custom pb-1 overflow-x-auto ">
                    <div class="flex items-center gap-3 md:gap-4 pb-2 w-full">
                        <button v-for="(item, index) in items" :key="index" @click="slideTo(index)"
                            class="label-1 font-semibold flex items-center gap-2.5 p-2 md:p-3 rounded-xl transition-all duration-300"
                            :class="activeIndex === index
                                ? 'bg-brand-100 text-white'
                                : 'bg-brand-200 text-gray-900 lg:hover:bg-brand-300'
                                ">
                            <div class="w-8 h-8">
                                <div class="aspect-w-1 aspect-h-1">
                                    <JPicture :src="item.image?.static_url || '/assets/images/placeholder-square.png'"
                                        :alt="item.image?.alt || item.title" class="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div class="flex-1 w-max">{{ item.title }}</div>
                        </button>
                    </div>
                </div> -->
            <div class="relative">
                <div class="flex flex-wrap items-center gap-3 md:gap-4 pb-2 w-full">
                    <button v-for="(item, index) in items" :key="index" @click="slideTo(index)"
                        class="label-1 font-semibold flex items-center gap-2.5 p-2 md:p-3 rounded-xl transition-all duration-300"
                        :class="activeIndex === index
                            ? 'bg-brand-100 text-white'
                            : 'bg-brand-200 text-gray-900 lg:hover:bg-brand-300'
                            ">
                        <div class="w-8 h-8">
                            <div class="aspect-w-1 aspect-h-1">
                                <JPicture :src="item.image?.static_url || '/assets/images/placeholder-square.png'"
                                    :alt="item.image?.alt || item.title" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div class="flex-1 w-max">{{ item.title }}</div>
                    </button>
                </div>
            </div>

            <!-- Sliders -->
            <swiper :modules="modules" :slides-per-view="1" :space-between="24" :loop="false" :navigation="false"
                @swiper="onSwiper" @slideChange="onSlideChange" class="availability-swiper">
                <swiper-slide v-for="(item, index) in items" :key="index">
                    <AnimatedAppear :delay="index * 100">
                        <div v-if="item.image_harvest_season">
                            <JPicture :src="item.image_harvest_season?.static_url"
                                :alt="item.image_harvest_season?.alt || item.title"
                                class="w-full h-full object-contain" />
                        </div>
                        <div v-else class=" flex flex-col items-center xl:gap-8 md:gap-6 gap-4">
                            <div class="max-w-[150px] md:max-w-[320px] w-full">
                                <JPicture src="/assets/images/placeholder-square.png" alt="image empty chart"
                                    class="w-full h-full object-cover" />
                            </div>
                            <h3 class="headline-3 font-bold uppercase text-primary max-md:hidden">No chart
                                information
                                available</h3>
                        </div>
                    </AnimatedAppear>
                </swiper-slide>
            </swiper>
        </div>
    </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import ArrowSlider from './Icons/ArrowSlider.vue'
import AnimatedAppear from './AnimatedAppear.vue';

export default {
    components: {
        Swiper,
        SwiperSlide,
        ArrowSlider,
    },
    props: ['items', 'certifications'],
    data() {
        return {
            modules: [],
            swiperInstance: null,
            isBeginning: true,
            isEnd: false,
            activeIndex: 0,
        }
    },
    methods: {
        onSwiper(swiper) {
            this.swiperInstance = swiper
            this.updateNavigationState()
        },
        onSlideChange(swiper) {
            this.activeIndex = swiper.activeIndex
            this.updateNavigationState()
        },
        updateNavigationState() {
            if (this.swiperInstance) {
                this.isBeginning = this.swiperInstance.isBeginning
                this.isEnd = this.swiperInstance.isEnd
            }
        },
        slidePrev() {
            if (this.swiperInstance) {
                this.swiperInstance.slidePrev()
            }
        },
        slideNext() {
            if (this.swiperInstance) {
                this.swiperInstance.slideNext()
            }
        },
        slideTo(index) {
            if (this.swiperInstance) {
                this.swiperInstance.slideTo(index)
            }
        },
    },
}
</script>

<style>
.scrollbar-custom {
    scrollbar-width: thin;
    scrollbar-color: #B61F04 #F2F4F7;
}

.scrollbar-custom::-webkit-scrollbar {
    height: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
    background: #E5C025;
    border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
    background: #B61F04;
    border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: #E5C025;
}

.availability-swiper {
    padding-bottom: 0;
}
</style>
