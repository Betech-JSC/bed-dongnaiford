<template>
    <div :id="`slider_${fieldId}`" :ref="`slider_${fieldId}`" class="jam-slider">
        <div class="flex w-full h-full jam-slider__container">
            <slot />
        </div>
        <slot v-if="$slots.appends" name="appends" :navigate="navigate" :selectedIndex="selectedIndex"> </slot>
    </div>
</template>
<script>
const defaultConfig = {
    imagesLoaded: true,
    autoPlay: false,
    wrapAround: true,
    resize: true,
    contain: true,
    selectedAttraction: 0.01,
    friction: 0.15,
    pageDots: false,
    prevNextButtons: true,
    draggable: false,
}
export default {
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            selectedIndex: 0,
            progress: 0,
            slidesPerRow: null,
            totalSlides: null,
        }
    },
    computed: {
        cellAlign() {
            return this.config.cellAlign || 'left'
        },
        sliderConfig() {
            const mergedConfig = {
                ...defaultConfig,
                ...this.config,
            }
            return {
                ...mergedConfig,
                cellAlign: mergedConfig.wrapAround ? this.cellAlign : 'center',
            }
        },
        fieldId() {
            return Math.random().toString(36).substr(2, 9)
        },
    },
    mounted() {
        this.flickity = new Flickity(`#slider_${this.fieldId} .jam-slider__container`, this.sliderConfig)
        this.flickity.on('change', (index) => (this.selectedIndex = index))
        this.flickity.on('dragStart', (event, pointer) => {
            document.ontouchmove = function (e) {
                e.preventDefault()
            }
        })
        this.flickity.on('dragEnd', (event, pointer) => {
            document.ontouchmove = function (e) {
                return true
            }
        })
        const slider = document.getElementById('slider_' + this.fieldId).querySelector('.flickity-slider')
        const slide = slider.querySelector('*:first-of-type')
        this.slidesPerRow = parseInt(slider?.clientWidth / slide?.clientWidth)
        this.totalSlides = slider.querySelectorAll(':scope > *').length
    },
    methods: {
        navigate(arg) {
            if (arg === 'next') {
                this.flickity.next()
            } else if (arg === 'prev') {
                this.flickity.previous()
            } else if (typeof arg === 'number') {
                this.flickity.selectCell(arg)
            }
        },
    },
}
</script>
