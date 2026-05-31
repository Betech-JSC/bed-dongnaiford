<template>
    <div class="relative p-2 pt-8 border border-orange-600 rounded-lg">
        <div
            class="absolute top-0 px-4 py-1 bg-orange-600 rounded left-4 -translate-y-1/4"
        >
            <div class="flex items-center space-x-2">
                <IconGift />
                <div class="font-bold text-white uppercase">
                    {{ tt("KHUYẾN MÃI") }}
                </div>
            </div>
        </div>
        <div
            class="prose text-gray-700 desc-promotion max-w-none"
            v-html="promotion"
        ></div>
    </div>
</template>
<script>
export default {
    props: ["promotion"],
};
</script>
<style lang="scss" scoped>
%font-init {
    @apply text-[1rem] tracking-[0.25px] xl:text-[0.875rem] leading-[150%];
}
:deep(.desc-promotion) {
    ul {
        @apply list-disc pl-2 space-y-2;
        li {
            @apply text-gray-700 list-none relative pl-2 m-0;
            @extend %font-init;

            a {
                @apply inline-block text-green-600 underline w-fit mt-0 mb-0 no-underline;
                @extend %font-init;
            }
            &::after {
                @apply absolute inline-block content-[''] w-[3px] h-[3px] rounded-full bg-gray-700 left-0 top-[9px] max-md:-translate-y-full overflow-hidden -translate-y-1/2;
            }
        }
    }
}
</style>
