<template>
    <button
        class="lg:flex hidden w-[40px] h-[40px] xl:w-[48px] xl:h-[48px] items-center justify-center rounded-full lg:hover:btn-shadow bg-white duration-300 ease-in-out absolute top-1/2 -translate-y-1/2 z-10 hover:text-blue-700 text-gray-500"
        :class="{
            'btn-position--left xl:-translate-x-full': direction === 'prev',
            'btn-position--right xl:translate-x-full': direction === 'next',
        }"
    >
        <Chervon class="w-[16px] h-[16px]" />
    </button>
</template>
<script>
import Chervon from '@/Components/Icons/Chervon.vue'
export default {
    props: {
        direction: {
            type: String,
            default: 'prev', // prev | next
        },
    },
    components: {
        Chervon,
    },
}
</script>
<style lang="scss" scoped>
.btn-position {
    &--left {
        @apply left-0 lg:left-[-2.5%];
    }
    &--right {
        @apply right-0 lg:right-[-2.5%];
    }
}
@media screen and (min-width: 1280px) {
    .btn-position {
        &--left {
            @apply left-[2%];
        }
        &--right {
            @apply right-[2%];
        }
    }
}
@media screen and (min-width: 1366px) {
    .btn-position {
        &--left {
            @apply -left-4;
        }
        &--right {
            @apply -right-4;
        }
    }
}
</style>
