<template>
    <div>
        <div
            class="mb-3 collapsible last:mb-0"
            :class="[classAccordion, collapseActive === uuId ? 'active' : 'cursor-pointer']"
        >
            <div
                @click="isMega ? () => {} : toggleCollapse()"
                class="flex items-center justify-between cursor-pointer group"
            >
                <h4 class="flex-1 font-semibold" :class="[collapseActive === uuId ? 'text-gray-900' : '', titleClass]">
                    <template v-if="$slots.title">
                        <slot name="title" />
                    </template>
                    <template v-else> {{ title }}</template>
                </h4>

                <div @click="isMega ? toggleCollapse() : () => {}" class="flex-shrink-0 min-w-[48px] flex justify-end">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="14"
                        viewBox="0 0 8 14"
                        fill="none"
                        :class="[collapseActive === uuId ? 'rotate-90' : '-rotate-90']"
                        class="duration-150"
                    >
                        <path
                            d="M1.58525 13.6959L7.79724 7.5023C7.87097 7.42857 7.92307 7.34869 7.95355 7.26267C7.98452 7.17665 8 7.08449 8 6.98618C8 6.88787 7.98452 6.7957 7.95355 6.70968C7.92307 6.62366 7.87097 6.54378 7.79724 6.47005L1.58525 0.258064C1.41321 0.0860214 1.19816 0 0.940092 0C0.682027 0 0.46083 0.0921659 0.276498 0.276498C0.0921659 0.460829 0 0.675883 0 0.921659C0 1.16743 0.0921659 1.38249 0.276498 1.56682L5.69585 6.98618L0.276498 12.4055C0.104455 12.5776 0.0184331 12.7894 0.0184331 13.0411C0.0184331 13.2933 0.110599 13.5115 0.294931 13.6959C0.479262 13.8802 0.694316 13.9724 0.940092 13.9724C1.18587 13.9724 1.40092 13.8802 1.58525 13.6959Z"
                            fill="#334155"
                        />
                    </svg>
                </div>
            </div>

            <!-- Content -->
            <div class="collapsible-content" :class="collapseActive === uuId ? 'mt-1.5 md:mt-2' : ''">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isFirst: { type: Boolean, default: false },

        title: {
            type: String,
            default: '',
        },
        titleClass: {
            type: String,
            default: '',
        },

        collapseActive: {
            type: Number,
            default: null,
        },

        classAccordion: {
            type: String,
            default: 'collapsible',
        },

        isMega: { type: Boolean, default: false },
    },

    data() {
        return {
            index: Math.random() * 999,
        }
    },

    watch: {
        isFirst(newFirst) {
            if (newFirst) {
                this.toggleCollapse()
            }
        },
    },

    computed: {
        uuId() {
            return Math.ceil(Math.random() * 99999)
        },
    },
    created() {
        if (this.isFirst) {
            this.toggleCollapse()
        }
    },

    mounted() {
        document.querySelectorAll('.collapsible .collapsible-content').forEach(function (el) {
            el.style.maxHeight = el.scrollHeight + 'px'
        })
    },

    methods: {
        toggleCollapse() {
            const _collapse = this.collapseActive !== this.uuId ? this.uuId : null
            this.$emit('onCollapse', _collapse)
        },
    },
}
</script>

<style lang="scss" scoped>
.collapsible {
    .collapsible-content {
        @apply overflow-hidden duration-300 ease-out;
    }
    &:not(.active) {
        .collapsible-content {
            max-height: 0 !important;
        }
    }
}
</style>
