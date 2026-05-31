<template>
    <div v-show="open" class="fixed inset-0 z-[210]">
        <div class="w-screen lg:w-[94vw] xl:w-[82vw] relative z-30 bg-white md:mx-auto h-screen-custom">
            <div class="absolute z-30 top-3 right-4">
                <div class="inline-flex items-center space-x-[12px] md:space-x-[24px]">
                    <button @click="toggleZoom()" class="items-center justify-center w-[32px] h-[32px] rounded flex">
                        <IconZoomIn2 v-if="isZoom" class="max-w-[22px]" />
                        <IconZoomIn v-else class="max-w-[22px]" />
                    </button>
                    <button @click="close()" class="flex items-center justify-center w-[32px] h-[32px] rounded">
                        <IconCloseLightBox class="max-w-full" />
                    </button>
                </div>
            </div>
            <div class="w-[96%] lg:w-[92%] xl:w-[86%] mx-auto h-full pb-5">
                <EcomSlider
                    :config="{
                        cols: 1,
                        gutter: '0px',
                        total: images.length,
                    }"
                    @onChangeSlide="onChangeSlide"
                    class="relative h-full mx-auto"
                >
                    <template #default="{ current }">
                        <EcomSlide
                            v-for="(image, idx) of images"
                            :key="idx"
                            :class="{
                                active: idx === current,
                            }"
                        >
                            <div class="flex items-center justify-center h-full">
                                <iframe
                                    v-if="checkIsVideo(image.url)"
                                    width="100%"
                                    height="100%"
                                    :src="`${getLinkVideo(image.url)}`"
                                    title="light-box-video"
                                ></iframe>

                                <template v-else>
                                    <EcomImageZoomDrag :url="image.url" :isZoom="isZoom" class="lg:hidden" />
                                    <EcomImageZoom
                                        :isZoom="isZoom"
                                        :url="image.url"
                                        @toggleZoom="toggleZoom"
                                        class="hidden lg:block"
                                    />
                                </template>
                            </div>
                        </EcomSlide>
                    </template>
                    <template #dots="{ navigate, current, dots }">
                        <div ref="thumbsOuter" class="max-w-full overflow-x-auto hide-scrollbar scroll-smooth">
                            <div
                                ref="thumbs"
                                class="flex items-center justify-start overflow-hidden scroll-smooth whitespace-nowrap w-fit space-x-[12px] px-3 mx-auto"
                            >
                                <div
                                    v-for="(_, index_dot) in dots"
                                    :key="index_dot"
                                    ref="thumbItems"
                                    class="cursor-pointer"
                                    @click="navigate(index_dot)"
                                >
                                    <div
                                        v-if="images[index_dot]"
                                        class="w-[72px] h-[72px] flex items-center justify-center rounded overflow-hidden border relative"
                                        :class="index_dot === current ? 'border-primary-600' : 'border-gray-300'"
                                    >
                                        <div class="cursor-pointer" v-if="checkIsVideo(images[index_dot].url)">
                                            <div
                                                class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[50%] z-10"
                                            >
                                                <JPicture
                                                    src="/assets/images/icons/play-video.png"
                                                    class="picture-cover"
                                                />
                                            </div>
                                            <div class="absolute inset-0 w-full h-full opacity-80">
                                                <JPicture
                                                    :src="getThumbnailVideo(images[index_dot].url)"
                                                    class="picture-contain"
                                                />
                                            </div>
                                        </div>

                                        <img v-else :src="images[index_dot].url || '/assets/images/cover.webp'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-if="images.length > 1" #arrows="{ navigate, current }">
                        <ButtonSlide
                            class="btn-prev"
                            :class="current === 0 ? 'pointer-events-none opacity-30' : ''"
                            @click="navigate('prev')"
                        >
                            <IconArrowSlidePrev />
                        </ButtonSlide>
                        <ButtonSlide class="btn-next" @click="navigate('next')"> <IconArrowSlideNext /></ButtonSlide>
                    </template>
                </EcomSlider>
            </div>
        </div>
        <!-- OVERLAY -->
        <div @click="close()" class="absolute inset-0 z-10 bg-black opacity-30"></div>
    </div>
</template>

<script>
import { getThumbnailVideo } from '@/lib/video'
export default {
    name: 'e-commerce-light-box',
    model: {
        prop: 'index',
        event: 'change',
    },
    props: {
        images: {
            type: Array,
            default: () => [],
        },
        index: {
            type: Number,
            default: null,
        },
        loop: {
            type: Boolean,
            default: false,
        },
        noThumbs: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            slide: 'next',
            isZoom: false,
        }
    },
    computed: {
        open() {
            return this.index != null
        },
        prevImage() {
            if (this.index > 0) {
                return this.index - 1
            }
            if (this.loop) {
                return this.images.length - 1
            }
            return this.index
        },
        nextImage() {
            if (this.index < this.images.length - 1) {
                return this.index + 1
            }
            if (this.loop) {
                return 0
            }
            return this.index
        },
    },
    mounted() {
        this.setVh()
        window.addEventListener('resize', this.keyup)
    },
    watch: {
        open(value) {
            if (value) {
                this.setVh()
                setTimeout(() => {
                    this.autoSlideInit()
                }, 200)
                document.body.classList.add('active-lightbox')
                document.body.classList.add('overflow-hidden')
                window.addEventListener('keyup', this.keyup)
            } else {
                document.body.classList.remove('active-lightbox')
                document.body.classList.remove('overflow-hidden')
                window.removeEventListener('keyup', this.keyup)
            }
        },
        index(newIndex) {
            if (!this.noThumbs && newIndex != null) {
                this.$nextTick(() => {
                    const { thumbs, thumbItems, thumbsOuter } = this.$refs
                    const curThumb = thumbItems[newIndex]

                    if (curThumb.offsetLeft + curThumb.clientWidth / 2 > thumbsOuter.clientWidth / 2) {
                        const distance = curThumb.offsetLeft - thumbsOuter.clientWidth / 2
                        if (distance < thumbsOuter.scrollWidth) {
                            thumbsOuter.scrollLeft = distance + curThumb.clientWidth / 2
                        } else {
                            thumbsOuter.scrollLeft = thumbsOuter.scrollWidth
                        }
                    } else {
                        thumbsOuter.scrollLeft = 0
                    }
                })
            }
        },
    },

    methods: {
        autoSlideInit() {
            const { thumbItems } = this.$refs
            thumbItems[this.index].click()
        },
        getThumbnailVideo,
        toggleZoom() {
            this.isZoom = !this.isZoom
        },
        checkIsVideo(url) {
            if (!url) return
            return url.includes('https://www.youtube.com') || url.includes('https://vimeo.com/')
        },
        getLinkVideo(link) {
            if (!link) return
            let video_id = ''
            if (link.includes('https://www.youtube.com')) {
                if (link.includes('?v=')) {
                    video_id = link.split('?v=').pop()
                    let ampersandPosition = video_id.indexOf('&')
                    if (ampersandPosition != -1) {
                        video_id = video_id.substring(0, ampersandPosition)
                    }
                }
                if (link.includes('embed')) {
                    video_id = link.split('/').pop()
                }
                return 'https://www.youtube.com/embed/' + video_id
            } else {
                video_id = link.split('/').pop()
                return 'https://player.vimeo.com/video/' + video_id
            }
        },
        onChangeSlide(index) {
            this.goto(index)
            this.isZoom = false
        },
        setVh() {
            let vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        },
        close() {
            this.isZoom = false
            const oldIndex = this.index
            this.goto(null)
            this.$emit('close', oldIndex)
            document.body.classList.remove('overflow-hidden')
        },
        prev() {
            this.$emit('prev', this.prevImage)
            this.goto(this.prevImage, 'prev')
        },
        next() {
            this.$emit('next', this.nextImage)
            this.goto(this.nextImage, 'next')
        },
        goto(idx, slide) {
            this.slide = slide || (this.index < idx ? 'next' : 'prev')
            this.$emit('change', idx)
        },
        keyup(e) {
            if (e.code === 'ArrowRight' || e.key === 'ArrowRight' || e.key === 'Right' || e.keyCode === 39) {
                this.next()
            } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft' || e.key === 'Left' || e.keyCode === 37) {
                this.prev()
            } else if (e.code === 'Escape' || e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
                this.close()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
:deep(.jam-slider__container) {
    @apply h-[calc(100%-82px)] md:h-[calc(100%-74px)] pb-2 pt-12 md:pt-8;
}

.prev-enter {
    transform: translateX(-72px);
}
.next-enter {
    transform: translateX(72px);
}
.next-enter-active,
.prev-enter-active {
    transition: opacity 300ms ease, transform 300ms ease;
}
</style>
