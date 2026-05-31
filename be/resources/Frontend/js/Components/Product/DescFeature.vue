<template lang="">
    <div class="p-3 bg-green-900 border border-green-800 rounded-lg">
        <h4 class="mb-1 font-bold text-green-600 body-custom">
            {{ tt("ĐẶC ĐIỂM NỔI BẬT") }}
        </h4>
        <div
            class="prose text-gray-700 desc-promotion max-w-none"
            v-html="content"
        ></div>
    </div>
</template>
<script>
export default {
    props: ["content"],
};
</script>

<style lang="scss" scoped>
%font-init {
    @apply text-[1rem] leading-[150%] tracking-[0.3px];
}
:deep(.desc-promotion) {
    ul {
        @apply list-disc pl-2 space-y-2;
        li {
            @apply text-gray-700 list-none relative pl-2 m-0;
            @extend %font-init;

            &::after {
                @apply absolute inline-block content-[''] w-[3px] h-[3px] rounded-full bg-gray-700 left-0 top-[12px] max-md:-translate-y-full overflow-hidden -translate-y-1/2;
            }
        }
    }
}
</style>
