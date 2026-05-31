<template>
    <JamSlider
        :config="{
            cols: '1.8',
            total: products.length,
            align: 'start',
            gutter: '4px',
        }"
        :breakpoints="{
            sm: {
                cols: '2.2',
                gutter: '6px',
            },
            md: {
                cols: '3',
                gutter: '6px',
            },
            lg: {
                cols: '4',
                gutter: '6px',
            },
            xl: {
                cols: '4',
                gutter: '6px',
            },
        }"
        class="slide-product space-x-3"
    >
        <slide
            class="slide-item overflow-hidden w-[55.56%] sm:w-[45.45%] md:w-[33.33%] lg:w-[25%] xl:w-[20%]"
            v-for="(product, index) in products"
            :key="index"
        >
            <CardProduct :product="product" />
        </slide>
        <template v-if="products && products.length > 0" #arrows="{ navigate }">
            <ButtonSlide
                class="w-12 h-[56px] flex items-center justify-center bg-[#EDEDEDB2]"
                @click="navigate('prev')"
            >
                <IconArrowSlidePrev />
            </ButtonSlide>
            <ButtonSlide
                class="w-12 h-[56px] flex items-center justify-center bg-[#EDEDEDB2]"
                @click="navigate('next')"
            >
                <IconArrowSlideNext
            /></ButtonSlide>
        </template>
    </JamSlider>
</template>

<script>
import { nextTick } from 'vue'
export default {
    props: {
        products: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            COUNTER_INIT: 2,
        }
    },
    mounted() {
        this.setInitScreen()
        setTimeout(() => {
            const flickityViewport = document.querySelector('.flickity-viewport')
            if (flickityViewport) {
                flickityViewport.classList.add('container')
            }
        }, 100)
    },

    methods: {
        setInitScreen() {
            const isScreenXL = window.matchMedia('(min-width: 1280px)').matches
            const isScreenLG = window.matchMedia('(min-width: 1024px)').matches

            if (isScreenXL) {
                this.COUNTER_INIT = 5
                return
            } else if (isScreenLG) {
                this.COUNTER_INIT = 4
                return
            } else {
                this.COUNTER_INIT = 3
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
