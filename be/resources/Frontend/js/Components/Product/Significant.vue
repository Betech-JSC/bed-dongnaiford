<template>
    <div class="prose product-desc max-w-none" v-html="content"></div>
</template>
<script>
export default {
    props: ["content"],
};
</script>
<style lang="scss" scoped>
%font-init {
    @apply text-[1rem] leading-[150%] tracking-[0.3px] text-[#475569];
}
:deep(.product-desc) {
    h2,
    h3 {
        @apply text-[1.25rem] md:text-[1.125rem] tracking-[0.15px] p-0 m-0 mb-2 text-[#0F172A];
    }
    p,
    strong,
    a {
        @apply m-0 p-0 mb-2 md:mb-3 xl:mb-4;
        @extend %font-init;
    }

    a {
        @apply text-primary-600;
    }

    strong {
        @apply font-medium;
    }
    img {
        @apply w-full rounded-lg p-0 m-0 mb-2 md:mb-3 xl:mb-4;
    }
    ul,
    ol {
        @apply my-0 mb-2 list-inside pl-0;
        li {
            @extend %font-init;
        }
    }
}
</style>
