<template>
    <button
        class="flex items-center px-4 py-2 mb-2 text-gray-600 border border-gray-300 rounded-full mr md:mr-2 md:mb-3 xl:mb-4"
    >
        <div class="caption">
            <slot />
        </div>
        <IconClose v-if="isIcon" class="ml-2" />
    </button>
</template>

<script>
export default {
    props: {
        isIcon: {
            type: Boolean,
            default: true,
        },
    },
};
</script>
