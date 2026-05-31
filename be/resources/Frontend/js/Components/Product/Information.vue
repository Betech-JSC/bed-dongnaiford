<template>
    <div>
        <div
            v-if="
                itemsDefault.length > 0 ||
                (specifications && specifications.length > 0)
            "
            class="overflow-hidden border border-gray-300 rounded-lg"
        >
            <h3 class="px-3 py-2 font-medium text-gray-900 bg-gray-100 p2">
                {{ tt(" Thông tin sản phẩm") }}
            </h3>
            <div class="bg-white">
                <div
                    v-for="(item, index) in itemsDefault"
                    class="flex space-x-2 py-1.5 px-3 caption-custom text-gray-900"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'"
                >
                    <div class="w-[40%]">{{ item.key }}:</div>
                    <div class="w-[60%]">{{ item.value }}</div>
                </div>

                <div
                    v-for="(option, index) in specifications"
                    class="flex space-x-2 py-1.5 px-3 caption-custom text-gray-900"
                    :class="
                        index % 2 === 0 &&
                        itemsDefault.length % 2 &&
                        'bg-gray-100'
                    "
                >
                    <div class="w-[40%]">{{ option.key }}</div>
                    <div class="w-[60%]">{{ option.value }}</div>
                </div>
                <div class="p-2 bg-white lg:hidden" v-if="ingredient">
                    <JamButton
                        as="button"
                        @click="showIngredient = true"
                        class="!px-6 !h-[36px] !text-[14px] tertiary uppercase w-full"
                    >
                        {{ tt("xem thêm Thành phần sản phẩm") }}</JamButton
                    >
                </div>
            </div>
        </div>
        <Popup
            :open="ingredient && showIngredient"
            @close="showIngredient = false"
        >
            <div
                class="px-[12px] md:px-[16px] max-h-[70vh] md:max-h-[90vh] overflow-y-auto"
            >
                <div class="border border-gray-300 rounded">
                    <h3 class="px-3 pt-3 pb-2 font-medium bg-gray-100 p3">
                        {{ tt(" Thành phần sản phẩm") }}
                    </h3>
                    <div
                        class="p-2 prose specification-table max-w-none"
                        v-html="ingredient"
                    ></div>
                </div>
            </div>
        </Popup>
    </div>
</template>
<script>
export default {
    props: ["specifications", "sku", "brand", "origin", "ingredient"],
    data() {
        return {
            limit: 5,
            limitInit: 5,
            showIngredient: false,
        };
    },
    created() {
        if (
            this.itemsDefault.length === 0 &&
            this.specifications?.length === 0
        ) {
            this.showIngredient = true;
        }
    },
    computed: {
        quantityDefault() {
            const items = [this.sku, this.brand, this.origin];
            const rows = items.filter((o) => {
                return !!o;
            });
            return rows.length;
        },

        itemsDefault() {
            const items = [
                {
                    key: "Mã sản phẩm",
                    value: this.sku,
                },
                {
                    key: "Nhà sản xuất",
                    value: this.brand && this.brand.title,
                },
                {
                    key: "Xuất xứ",
                    value: this.origin && this.origin.title,
                },
            ];
            return items.filter((o) => {
                return !!o.value;
            });
        },
    },
};
</script>
