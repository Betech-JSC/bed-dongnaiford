<template>
    <Slider
        :config="{
            wrapAround: true,
            draggable: true,
        }"
        class="relative w-full h-full"
    >
        <template v-for="(item, index) in items" :key="index">
            <CardService :item="item" />
        </template>
    </Slider>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
        },
    },
}
</script>
<style lang="scss" scoped>
:deep(.flickity-button) {
    @apply hidden;
}
</style>
