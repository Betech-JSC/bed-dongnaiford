<template>
    <section>
        <div class="relative" :class="[heightClass]">
            <!-- Background Image -->
            <img :src="isMobile ? mobileImage : pcImage" :alt="altText" class="object-fit h-full w-full object-cover" />

            <div class="absolute inset-x-0 bottom-0 h-full">
                <!-- Overlay -->

                <div :class="overlay === true ? 'block' : 'hidden'" class="absolute inset-0 bg-[#000000A8]"></div>
                <div class="container space-y-[32px] relative z-10" :class="paddingClass">
                    <!-- Dynamic Title -->
                    <h1 class="text-white display-3 inline-block" v-html="title"></h1>
                    <div class="group">
                        <Link :href="contactLink"
                            class="inline-flex justify-center items-center button-1 text-white gap-x-2 uppercase font-bold">
                        <div>Contact Now</div>
                        <svg class="transform group-hover:translate-x-[3px] transition-all"
                            xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2 9.99996H18.5M18.5 9.99996L11.5 4.16663M18.5 9.99996L11.5 15.8333" stroke="white"
                                stroke-width="3" stroke-linecap="square" stroke-linejoin="bevel" />
                        </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        pcImage: {
            type: String,
            required: true,
            default: '/path/to/desktop-image.png',
        },
        mobileImage: {
            type: String,
            required: true,
            default: '/path/to/mobile-image.png',
        },
        title: {
            type: String,
            required: true,
            default: 'Sẵn sàng đồng hành <br/> cùng dự án của bạn!',
        },
        altText: {
            type: String,
            default: 'Background image',
        },
        contactLink: {
            type: String,
            default: '/contact',
        },
        isMobile: {
            type: Boolean,
            default: false, // Set true nếu muốn test giao diện mobile
        },
        heightClass: {
            type: String,
            default: 'h-[280px] md:h-[320px] xl:h-[320px]',
        },
        paddingClass: {
            type: String,
            default: 'py-[40px] md:py-[56px] xl:py-[82px]',
        },
        overlay: {
            type: Boolean,
        },
    },
    data() {
        return {
            isMobile: window.innerWidth < 768, // Xác định kích thước màn hình
        }
    },
    mounted() {
        window.addEventListener('resize', this.updateMobileState)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateMobileState)
    },
    methods: {
        updateMobileState() {
            this.isMobile = window.innerWidth < 768
        },
    },
}
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>
