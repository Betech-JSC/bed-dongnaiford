<template>
    <JamSlider
        ref="slider"
        :config="{
            draggable: true,
            cellAlign: 'center',
            autoPlay: true,
            ...config,
        }"
        class="w-full h-[180px] md:h-[250px] lg:h-[300px] xl:h-[400px] relative"
    >
        <div
            v-for="(item, index) in items"
            :key="index"
            class="lg:mr-[32px] mr-[12px] xl:w-[45%] md:w-[56%] w-[75%] h-full xl:min-w-[800px]"
        >
            <JPicture :src="item.url" :alt="item.alt" wrapperClass="picture-cover h-full" />
        </div>

        <template #appends="{ navigate }">
            <ButtonSlider @click="navigate('prev')" direction="prev" class="rotate-180 !left-[10%]" />
            <ButtonSlider @click="navigate('next')" direction="next" class="!right-[10%]" />
        </template>
    </JamSlider>
</template>

<script>
import JamSlider from '@/Components/Jam/Slider.vue'

export default {
    components: { JamSlider },

    props: {
        items: {
            type: Array,
            default: () => [],
        },
        config: {
            type: Object,
            default: () => {},
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
    width: 100% !important;
    height: 100% !important;
}
</style>
