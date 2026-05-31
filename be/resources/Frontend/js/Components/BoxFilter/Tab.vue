<template>
    <button
        class="whitespace-nowrap duration-200 tab relative z-10 text-gray-500 text-base font-medium pb-[18px] md:hover:text-primary-600 border-b-[2px] border-b-transparent md:hover:border-b-primary-600 max-md:text-[13px] max-md:font-medium"
    >
        <slot />
    </button>
</template>

<style lang="scss" scoped>
.tab.active {
    @apply text-gray-900 border-b-primary-600;
}
</style>
