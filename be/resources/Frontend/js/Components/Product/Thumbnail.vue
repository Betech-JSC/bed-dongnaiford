<template>
    <!-- START SLIDER -->
    <div class="relative">
        <EcomSlider
            :config="{
                cols: '1',
                gutter: '2px',
                total: images.length,
                align: 'start',
            }"
            class="relative grid-cols-12 space-y-4"
            @onChangeSlide="onChangeSlide"
        >
            <template #dots="{ navigate, current }">
                <div class="col-span-full grid grid-cols-5 gap-[12px]" :class="images.length >= 5 ? '' : 'space-x-1'">
                    <template v-for="(image, index) in images.slice(0, 5)" :key="index">
                        <div
                            v-if="image"
                            class="cursor-pointer aspect-1 relative col-span-1"
                            :class="[
                                index === 3 && 'relative',
                                index == current ? 'border-primary-600' : 'border-gray-200',
                            ]"
                            @click="navigate(index)"
                        >
                            <div v-if="checkIsVideo(image.url)" class="cursor-pointer">
                                <div class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[50%] z-10">
                                    <JPicture src="/assets/images/icons/play-video.png" class="picture-cover" />
                                </div>
                                <div class="absolute inset-0 w-full h-full opacity-80">
                                    <JPicture
                                        :src="getThumbnailVideo(image.url)"
                                        class="picture-cover object-fit object-cover"
                                    />
                                </div>
                            </div>

                            <JPicture
                                v-else
                                :src="image.url"
                                class="picture-cover"
                                alt="product detail title"
                                loading="eager"
                            />
                            <div class="absolute inset-0" v-if="index === 4" @click="lightboxIndex = index">
                                <div class="absolute inset-0 bg-black opacity-60"></div>
                                <span
                                    class="absolute z-10 text-white -translate-x-1/2 -translate-y-1/2 p2 left-1/2 top-1/2"
                                    >+{{ images.length - 3 }}</span
                                >
                            </div>
                        </div>
                    </template>
                </div>
            </template>
            <EcomSlide
                v-for="(image, index) in images"
                :key="index"
                class="!border-none lg:min-w-[496px] max-sm:max-w-[300px]"
            >
                <div class="w-full aspect-w-1 aspect-h-1 !border-none" @click="lightboxIndex = index">
                    <!-- VIDEO -->
                    <iframe
                        v-if="checkIsVideo(image.url)"
                        width="100%"
                        height="100%"
                        :src="`${getLinkVideo(image.url)}`"
                        title="thumbnail-video"
                    ></iframe>
                    <!-- IMAGE -->
                    <img
                        v-else
                        :src="image.url || '/assets/images/cover.webp'"
                        class="object-cover !border-none"
                        :alt="image.alt"
                    />
                </div>
            </EcomSlide>
        </EcomSlider>
    </div>
    <!-- END SLIDER -->
    <EcomLightBox :index="lightboxIndex" :images="images" @change="onChangeLightbox" />
</template>
<script>
import { checkIsVideo, getLinkVideo, getThumbnailVideo } from '@/lib/video'

export default {
    props: ['product'],
    data() {
        return {
            currentIndex: 0,
            lightboxIndex: null,
        }
    },

    computed: {
        images() {
            const videos =
                this.product?.video_urls?.map((vid) => {
                    return {
                        url: vid,
                    }
                }) || []
            return [...this.product?.images, ...videos]
        },
    },

    methods: {
        onChangeSlide(index) {
            this.currentIndex = index
        },
        onChangeLightbox(index) {
            this.lightboxIndex = index
        },
        checkIsVideo,
        getLinkVideo,
        getThumbnailVideo,
    },
}
</script>
