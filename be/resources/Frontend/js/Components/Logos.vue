<template>
    <section class="container max-md:pt-[32px] md:py-[32px] space-y-[32px] relative text-center">
        <div class="headline-1 text-black">Tạo ra những khung hình hoàn hảo cho hơn 50 câu chuyện phim, dự án</div>

        <!-- Nút điều hướng trái -->
        <button
            @click="scrollLeft"
            class="absolute left-0 md:left-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow w-[40px] h-[40px]"
        >
            ←
        </button>

        <!-- Slider wrapper -->
        <div ref="slider" class="flex overflow-x-auto space-x-[16px] scrollbar-hide">
            <div
                v-for="(item, index) in logos"
                :key="index"
                class="flex-shrink-0 w-[176px] text-gray-900 min-h-[176px] bg-white border border-gray-200 rounded-[8px]"
            >
                <div>
                    <img :src="item.link" :alt="item.title" class="w-full h-full object-cover" />
                    <div class="title-2 py-[8px] px-[12px]">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Nút điều hướng phải -->
        <button
            @click="scrollRight"
            class="absolute right-0 md:right-[-20px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow w-[40px] h-[40px]"
        >
            →
        </button>
    </section>
</template>

<script>
export default {
    data() {
        return {
            logos: [{ title: 'chiucachminh', link: '/assets/images/projecs/chiucachminh.png' }],
        }
    },
    methods: {
        scrollLeft() {
            this.$refs.slider.scrollBy({ left: -200, behavior: 'smooth' })
        },
        scrollRight() {
            this.$refs.slider.scrollBy({ left: 200, behavior: 'smooth' })
        },
    },
}
</script>

<style scoped>
/* Ẩn scrollbar */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
