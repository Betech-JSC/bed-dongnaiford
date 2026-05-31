<template>
    <section class="relative overflow-hidden h-full">
        <!-- If it is a video, display normally (single item, no swiper) -->
        <div v-if="hasVideo && videoItem" class="h-full w-full relative">
            <div class="md:aspect-w-2 md:aspect-h-1 aspect-w-3 aspect-h-4 relative w-full h-full">
                <video
                    class="absolute inset-0 w-full h-full object-cover"
                    loop
                    playsinline
                    webkit-playsinline
                    preload="metadata"
                >
                    <source :src="videoItem.video_url" type="video/mp4" />
                </video>
            </div>

            <!-- Content overlay -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[800px] w-full md:py-6 py-4 xl:py-8 md:px-8 px-4 xl:px-16 flex flex-col justify-center items-center space-y-4 text-center text-white z-20">
                <AnimatedAppear v-if="videoItem.title">
                    <h1 class="display-1 font-bold">
                        {{ videoItem.title }}
                    </h1>
                </AnimatedAppear>
                <AnimatedAppear>
                    <p class="title-2" :class="{ 'notranslate': $page.props.locale.current === 'zh' }">
                        {{ $page.props.locale.current === 'zh' ? '我们相信，知识是金融可持续发展的核心基础。我们以国际标准为导向开展实用培训，与越南投资者携手提升能力，助力其把握市场动态，创造长期价值。目前，我们的业务已覆盖日本、上海、新加坡及香港，整合全球金融知识资源，提供专业且实战导向的培训课程，并根据越南市场需求进行本地化优化' : videoItem.subtitle }}
                    </p>
                </AnimatedAppear>
                <AnimatedAppear>
                    <Link v-if="videoItem.button_link" :href="videoItem.button_link" class="btn btn-secondary">
                        {{ videoItem.button_text || 'Khám phá ngay' }}
                    </Link>
                </AnimatedAppear>
            </div>
        </div>

        <!-- Otherwise, if there is no video, render a swiper slider of all images -->
        <div v-else-if="sliderItems && sliderItems.length > 0" class="h-full w-full relative">
            <swiper
                ref="swiperRef"
                :modules="modules"
                :slides-per-view="1"
                :space-between="0"
                :loop="sliderItems.length > 1"
                :autoplay="{ delay: 5000, disableOnInteraction: false }"
                :pagination="{ clickable: true, el: '.hero-pagination' }"
                @swiper="onSwiperInit"
                class="h-full w-full relative"
            >
                <swiper-slide v-for="(item, index) in sliderItems" :key="item.id || index" class="relative w-full h-full">
                    <div class="md:aspect-w-2 md:aspect-h-1 aspect-w-3 aspect-h-4 relative w-full h-full">
                        <JPicture
                            :src="item.image_url || '/cover.jpg'"
                            :mobileSrc="item.image_mobile_url || item.image_url"
                            :alt="item.title || 'image hero'"
                            class="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    <!-- Content overlay -->
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[800px] w-full md:py-6 py-4 xl:py-8 md:px-8 px-4 xl:px-16 flex flex-col justify-center items-center space-y-4 text-center text-white z-20">
                        <AnimatedAppear v-if="item.title">
                            <h1 class="display-1 font-bold">
                                {{ item.title }}
                            </h1>
                        </AnimatedAppear>
                        <AnimatedAppear>
                            <p class="title-2" :class="{ 'notranslate': $page.props.locale.current === 'zh' }">
                                {{ $page.props.locale.current === 'zh' ? '我们相信，知识 is 金融可持续发展的核心基础。我们以国际标准为导向开展实用培训，与越南 investors 携手提升 capability，助力其 grasp 市场 dynamic，创造 long-term value。目前，我们的 business 已 cover 日本、上海、新加坡及香港，整合 global...' : item.subtitle }}
                            </p>
                        </AnimatedAppear>
                        <AnimatedAppear>
                            <Link v-if="item.button_link" :href="item.button_link" class="btn btn-secondary">
                                {{ item.button_text || 'Khám phá ngay' }}
                            </Link>
                        </AnimatedAppear>
                    </div>
                </swiper-slide>
            </swiper>

            <!-- Pagination dots -->
            <div class="hero-pagination absolute !w-max left-1/2 -translate-x-1/2 !bottom-8 z-30"></div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
        items: {
            type: Array,
            default: () => [],
        },
    },

    setup() {
        const modules = [Autoplay, Pagination]
        const swiperInstance = ref(null)

        const onSwiperInit = (swiper) => {
            swiperInstance.value = swiper
        }

        return {
            modules,
            onSwiperInit,
        }
    },

    computed: {
        sliderItems() {
            if (this.items && this.items.length > 0) {
                return this.items
            }
            if (this.item && Object.keys(this.item).length > 0) {
                return [this.item]
            }
            return []
        },
        hasVideo() {
            return this.sliderItems.length > 0 && this.sliderItems.some(item => item.video_url)
        },
        videoItem() {
            return this.sliderItems.find(item => item.video_url)
        },
    },

    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.initVideos()
            }, 300)
        })
    },

    beforeUnmount() {
        this.cleanupListeners()
    },

    methods: {
        initVideos() {
            const videos = this.$el.querySelectorAll('video')
            if (!videos || videos.length === 0) return

            videos.forEach(video => {
                video.setAttribute('muted', '')
                video.setAttribute('autoplay', '')
                video.muted = true
                video.defaultMuted = true
                video.load()
                this.forcePlay(video)
            })

            this._playOnInteraction = () => {
                videos.forEach(video => this.forcePlay(video))
                this.cleanupListeners()
            }
            document.addEventListener('touchstart', this._playOnInteraction, { once: true, passive: true })
            document.addEventListener('click', this._playOnInteraction, { once: true })
            document.addEventListener('scroll', this._playOnInteraction, { once: true, passive: true })
        },

        forcePlay(video) {
            if (!video) return
            video.muted = true
            const p = video.play()
            if (p && p.catch) p.catch(() => {})
        },

        cleanupListeners() {
            if (this._playOnInteraction) {
                document.removeEventListener('touchstart', this._playOnInteraction)
                document.removeEventListener('click', this._playOnInteraction)
                document.removeEventListener('scroll', this._playOnInteraction)
                this._playOnInteraction = null
            }
        },
    },
};
</script>

<style lang="scss" scoped>
video {
    pointer-events: none;
}

/* Style pagination bullets */
:deep(.hero-pagination) {
    @apply flex items-center justify-center gap-2;
}

:deep(.hero-pagination .swiper-pagination-bullet) {
    @apply w-3 h-3 bg-white/50 opacity-100;
    transition: all 0.2s ease;
    border-radius: 9999px;
    cursor: pointer;
}

:deep(.hero-pagination .swiper-pagination-bullet-active) {
    @apply bg-white w-6;
}
</style>
