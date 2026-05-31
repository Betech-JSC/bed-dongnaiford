<template lang="">
    <div class="overflow-hidden border border-gray-300 rounded-lg">
        <h3
            class="px-2 md:px-4 py-2 md:py-[12px] font-medium text-gray-900 border-b border-green-600 p2"
        >
            {{ tt("Câu Hỏi Thường Gặp") }}
        </h3>
        <Accordion
            v-for="(item, index) in questions"
            :key="index"
            @onCollapse="setCollapseActive"
            :collapseActive="collapseActive"
            :isFirst="onOpenPC(index)"
            class="py-2 md:py-[12px] px-2 md:px-4 border-b-[0.3px] border-b-gray-200"
        >
            <template v-slot:title>
                <div class="flex items-center space-x-2 body-custom">
                    <IconFAQs class="flex-shrink-0" />
                    <span> {{ item.question }}</span>
                </div>
            </template>
            <div
                class="prose max-w-none prose-faq-content body-custom"
                v-html="item.answer"
            ></div>
        </Accordion>
    </div>
</template>
<script>
export default {
    props: {
        questions: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            collapseActive: 0,
        };
    },
    methods: {
        setCollapseActive(id) {
            this.collapseActive = id;
        },
        onOpenPC(index) {
            if (typeof window === "undefined") return;

            const _index = Number(index);
            if (_index !== 0) return;

            const isScreenLG = window.matchMedia("(min-width: 1024px)").matches;
            return isScreenLG;
        },
    },
};
</script>

<style lang="scss" scoped>
:deep(.prose-faq-content) {
    > * {
        @apply text-[1rem] leading-[150%];
    }
}
</style>
