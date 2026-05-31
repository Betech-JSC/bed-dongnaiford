<template>
    <JamSlider
        ref="slider"
        :config="{
            draggable: true,
            cellAlign: 'center',
            autoPlay: true,
        }"
        class="w-full h-[180px] md:h-[250px] lg:h-[300px] xl:h-[456px] relative"
    >
        <div v-for="(item, index) in items" :key="index" class="lg:mr-[24px] mr-[10px] md:w-[56%] w-[75%] h-full">
            <img :src="item.url" :alt="item.alt" class="object-cover w-full h-full" />
        </div>
        <template #appends="{ navigate }">
            <button
                class="lg:flex hidden w-[40px] h-[40px] items-center justify-center rounded-full btn-shadow bg-white duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 left-[10%] z-[60 rotate-180 text-blue-700 "
                @click="navigate('prev')"
            >
                <Chervon class="w-[16px] h-[16px]"/>
            </button>
            <button
                class="lg:flex hidden w-[40px] h-[40px] items-center justify-center rounded-full btn-shadow bg-white duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 right-[10%] z-[60]  text-blue-700 "
                @click="navigate('next')"
            >
                <Chervon class="w-[16px] h-[16px]"/>
            </button>
        </template>
    </JamSlider>
</template>

<script>
import JamSlider from '../Components/Jam/Slider.vue';
import Chervon from './Icons/Chervon.vue';
export default {
    props: ["items"],
    components: { Chervon, JamSlider }
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

.btn-shadow {
    box-shadow: 0px 4px 20px rgba(40, 122, 186, 0.4);
}
</style>
