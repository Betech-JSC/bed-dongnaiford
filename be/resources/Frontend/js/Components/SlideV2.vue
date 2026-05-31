<template>
    <section class="slider-container">
        <div class="slider-wrapper">
            <div class="slider space-x-[2rem]" :style="sliderStyle">
                <Link
                    :href="
                        slide.slug
                            ? route('products.show', { slug: slide.slug })
                            : route('products.index')
                    "
                    v-for="(slide, index) in slides"
                    :key="index"
                    class="slide"
                    :style="{ width: slideWidth + 'px' }"
                >
                    <img :src="slide.image?.url || '/assets/images/cover.jpg'" :alt="slide.alt" />

                    <div class="py-[12px] space-y-[8px]">
                        <div class="title-4 text-gray-500">ARRI</div>
                        <div class="title-3 text-black">
                            {{ slide.title }}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
        <button class="prev" @click="moveSlide(-1)">&#10094;</button>
        <button class="next" @click="moveSlide(1)">&#10095;</button>
    </section>
</template>

<script>
export default {
    props: ['products'],
    data() {
        return {
            currentSlide: 0,
            slides: this.products,
            slideWidth: 600, // default slide width
        }
    },
    computed: {
        sliderStyle() {
            return {
                transform: `translateX(-${this.currentSlide * this.slideWidth}px)`,
                transition: 'transform 0.5s ease',
            }
        },
    },
    methods: {
        moveSlide(direction) {
            // Tạo vòng lặp vô tận khi di chuyển qua các slide
            if (direction === 1) {
                this.currentSlide = (this.currentSlide + 1) % this.slides.length
            } else {
                this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
            }
        },
        updateSlideWidth() {
            const screenWidth = window.innerWidth
            if (screenWidth >= 1024) {
                this.slideWidth = 300 // 3 items per slide on large screens (e.g., desktop)
            } else if (screenWidth >= 768) {
                this.slideWidth = 400 // 2 items per slide on tablet screens
            } else {
                this.slideWidth = 600 // 1 item per slide on mobile screens
            }
        },
    },
    mounted() {
        this.updateSlideWidth()
        window.addEventListener('resize', this.updateSlideWidth)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateSlideWidth)
    },
}
</script>

<style scoped>
.slider-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
}

.slider-wrapper {
    display: flex;
    flex-direction: row;
}

.slider {
    display: flex;
    transition: transform 0.5s ease;
}

.slide img {
    width: 100%;
    height: auto;
}

button {
    position: absolute;
    top: 50%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
    transform: translateY(-50%);
}

button.prev {
    left: 10px;
}

button.next {
    right: 10px;
}

button:hover {
    background: rgba(0, 0, 0, 0.8);
}
</style>
