<template>
    <JamSlider :config="{ wrapAround: true, draggable: true, ...config }" class="w-full">
        <slot />
        <template #appends="{ navigate }" v-if="config.total > rowItems">
            <ButtonSlider @click="navigate('prev')" direction="prev" class="rotate-180" />
            <ButtonSlider @click="navigate('next')" direction="next" />
        </template>
    </JamSlider>
</template>

<script>
import JamSlider from '@/Components/Jam/Slider.vue'
import ButtonSlider from '@/Components/ButtonSlider.vue'
export default {
    components: { JamSlider, ButtonSlider },
    props: {
        items: {
            type: Array,
        },
        config: {
            type: Object,
            default: () => {
                return {
                    wrapAround: true,
                    draggable: true,
                }
            },
        },
        rowItems: {
            type: Number,
            default: 3,
        },
    },
}
</script>

<style lang="scss" scoped>
:deep(.flickity-slider) {
    @apply flex items-center;
}
:deep(.flickity-button) {
    display: none;
}

:deep(.flickity-viewport) {
    height: 100% !important;
}
</style>
