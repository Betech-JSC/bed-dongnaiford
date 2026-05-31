<template>
    <div class="relative overflow-hidden border border-gray-300 rounded-lg">
        <h3 class="px-3 py-2 font-medium text-gray-900 bg-gray-100 p2">
            {{ tt(" Thông tin khác") }}
        </h3>

        <div
            ref="specificationTable"
            class="p-2 prose specification-table max-w-none max-h-[360px]"
            v-html="content"
        ></div>

        <div
            v-if="isShowMore"
            class="h-[80px] w-full absolute bottom-0 inset-x-0 layer-white"
        ></div>
        <div class="relative z-20 p-2 bg-white" v-if="isShowMore">
            <JamButton
                as="button"
                @click="showPopup = true"
                class="!px-6 !h-[36px] !text-[14px] tertiary uppercase w-full"
            >
                {{ tt("Xem thêm") }}</JamButton
            >
        </div>
    </div>

    <Popup :open="showPopup" @close="showPopup = false">
        <div
            class="px-[12px] md:px-[16px] max-h-[70vh] md:max-h-[90vh] overflow-y-auto"
        >
            <div class="border border-gray-300 rounded">
                <h3 class="px-3 py-2 font-medium bg-gray-100 p3">
                    {{ tt(" Thành phần sản phẩm") }}
                </h3>
                <div
                    class="p-2 prose specification-table max-w-none"
                    v-html="content"
                ></div>
            </div>
        </div>
    </Popup>
</template>
<script>
export default {
    props: ["content"],
    data() {
        return {
            showPopup: false,
            isShowMore: true,
        };
    },
    mounted() {
        const { specificationTable } = this.$refs;
        this.viewerHeight = specificationTable.offsetHeight;
        this.realHeight = specificationTable.scrollHeight;

        if (this.viewerHeight === this.realHeight) {
            this.isShowMore = false;
        }
    },
};
</script>

<style lang="scss" scoped>
.layer-white {
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 56.56%
    );
}

:deep(.specification-table) {
    %font-init-table {
        font-style: normal;
        font-size: 16px;
        line-height: 150%;
        color: #0f172a !important;
        @screen lg {
            font-size: 14px;
        }
    }
    table {
        margin: 0px;
        border-bottom: 1px solid #e5e7eb;
        &:last-child {
            border-bottom: none;
        }
        tbody {
            tr {
                background-color: white;

                td {
                    @extend %font-init-table;
                    padding: 6px !important;
                    p,
                    div,
                    strong,
                    em {
                        @extend %font-init-table;
                    }

                    a {
                        @extend %font-init-table;
                        font-style: normal;
                        font-size: 16px;
                        line-height: 150%;
                        @screen lg {
                            font-size: 14px;
                        }
                        font-weight: 400;
                        text-decoration: underline;
                        color: #128946 !important;
                    }

                    em {
                        @apply italic;
                    }

                    &:nth-child(1) {
                        width: 48% !important;
                    }
                    &:nth-child(2) {
                        width: 24% !important;
                        padding-right: 14px !important;
                        text-align: end;
                    }
                    &:nth-child(3) {
                        width: 26% !important;
                        text-align: end;
                    }
                }

                &:nth-child(1) {
                    border-bottom: 2px solid #475569;
                }
            }
        }
    }
}
</style>
