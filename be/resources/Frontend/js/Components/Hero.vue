<template>
    <JamSlider
        v-if="slides && slides.length > 0"
        :config="{
            draggable: true,
            prevNextButtons: false,
            autoPlay: true,
        }"
        class="relative h-full"
    >
        <a
            :href="slide.link"
            :target="slide.target === 'CURRENT' ? '_self' : '_blank'"
            v-for="(slide, index) in slides"
            :key="index"
            class="block overflow-hidden"
        >
            <div v-if="slide.image" class="relative h-full">
                <img
                    :src="slide.image && slide.image.url ? slide.image.url : '/assets/images/banner-home.png'"
                    class="object-fit h-full w-full object-cover md:block hidden"
                    :alt="slide.image && slide.image.alt ? slide.image.alt : slide.image.title"
                />
                <img
                    :src="
                        slide.image_mobile && slide.image_mobile.url
                            ? slide.image_mobile.url
                            : '/assets/images/banner-home.png'
                    "
                    class="object-fit h-full w-full object-cover md:hidden block"
                    :alt="
                        slide.image_mobile && slide.image_mobile.alt ? slide.image_mobile.alt : slide.image_mobile.title
                    "
                />
            </div>
        </a>

        <template #appends="{ selectedIndex, navigate }">
            <div class="absolute left-1/2 -translate-x-1/2 md:bottom-[28x] bottom-4 z-[100]">
                <div class="text-white button-1 font-display font-bold flex justify-center items-center">
                    <Link
                        :href="route('products.index')"
                        class="bg-button group flex justify-center items-center py-[14px] px-[20px] space-x-[8px] rounded-[4px] mb-[40px] uppercase min-h-[48px] md:min-w-[208px]"
                    >
                        <div>Yêu cầu thiết bị</div>
                        <svg
                            class="transform group-hover:translate-x-[5px] duration-500"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 10.0001H18.5M18.5 10.0001L11.5 4.16675M18.5 10.0001L11.5 15.8334"
                                stroke="white"
                                stroke-width="3"
                                stroke-linecap="square"
                                stroke-linejoin="bevel"
                            />
                        </svg>
                    </Link>
                </div>
                <div class="container">
                    <div class="flex items-center space-x-2 max-md:justify-center">
                        <div
                            v-for="(_, indexDot) in slides.length"
                            :key="indexDot"
                            @click="navigate(indexDot)"
                            class="h-[4px] w-[50px] cursor-pointer"
                            :class="indexDot === selectedIndex ? 'bg-white' : 'bg-[rgba(255,255,255,0.5)]'"
                        ></div>
                    </div>
                </div>
            </div>
        </template>
    </JamSlider>
</template>
<script>
export default {
    props: {
        slides: {
            type: Array,
            default: [],
        },
    },
    mounted() {
        const flickityViewport = document.querySelector('.flickity-viewport')
        if (flickityViewport) {
            flickityViewport.style.width = '100%'
        }
    },
}
</script>
<style lang="scss" scoped>
.flickity-button {
    display: none;
}

.flickity-cell {
    height: 100%;
    width: 100%;
}

.bg-button {
    background: linear-gradient(81deg, #1da89f 8.3%, #025e33 103.63%);
}
.bg-button:hover {
    background: #101828;
}
</style>
