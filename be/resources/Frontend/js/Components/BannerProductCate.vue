<template>
    <section class="relative overflow-hidden h-full min-h-[480px] flex items-center">
        <div class="absolute inset-0">
            <!-- Video file upload -->
            <video
                v-if="item.video_url"
                ref="bannerVideo"
                class="w-full h-full object-cover"
                loop
                playsinline
                webkit-playsinline
                preload="metadata"
            >
                <source :src="item.video_url" type="video/mp4" />
            </video>

            <!-- Image fallback -->
            <JPicture
                v-else
                :src="item.image_url || '/cover.jpg'"
                :srcMb="item.image_mobile_url || item.image_url"
                :alt="item.title || 'image hero'"
                class="w-full h-full object-cover"
            />
        </div>
        <div class="relative w-full">
            <div class="container">
                <div class="max-w-[608px] w-full space-y-4 text-white">
                    <h1 class="display-3 font-bold" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ $page.props.locale.current === 'zh' ? '你不是没有机会，你只是没有一套成熟的交易系统。' : item.title }}</h1>
                    <p class="body-1" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ $page.props.locale.current === 'zh' ? '市场从不缺机会，缺的是能够稳定执行的交易方法。大多数交易者输在情绪、信息混乱和缺乏纪律。一次次犯错，一次次亏损，却找不到真正的问题所在。' : item.subtitle }}</p>
                    <Link v-if="item.button_link" :href="item.button_link" class="btn btn-secondary" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ $page.props.locale.current === 'zh' ? '立即开始' : item.button_text || 'Khám phá ngay' }}
                    </Link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({}),
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.initVideo()
        })
    },

    beforeUnmount() {
        this.cleanupListeners()
    },

    methods: {
        initVideo() {
            const video = this.$refs.bannerVideo
            if (!video) return

            // iOS Safari cần muted được set qua cả attribute và property
            video.setAttribute('muted', '')
            video.setAttribute('autoplay', '')
            video.muted = true
            video.defaultMuted = true

            // Load video
            video.load()

            // Thử play ngay
            this.forcePlay(video)

            // Thử lại khi video sẵn sàng
            video.addEventListener('loadeddata', () => this.forcePlay(video), { once: true })
            video.addEventListener('canplay', () => this.forcePlay(video), { once: true })

            // Fallback: play khi user tương tác lần đầu
            this._playOnInteraction = () => {
                this.forcePlay(video)
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
}
</script>

<style scoped>
video {
    pointer-events: none;
}
</style>
