<template>
    <div class="p-3 box-price bg-gray-50">
        <p class="font-medium text-gray-800 text-base mb-3">{{ tt("Giá") }}</p>
        <div class="flex flex-col gap-4 h-[220px] overflow-y-scroll px-2">
            <button
                v-for="(price, index) in prices"
                :key="index"
                @click="pushToUrlPrice(price.value)"
                class="px-[10px] py-[10px] border rounded-md caption font-medium w-full"
                :class="
                    route.query.prices === price.value
                        ? 'text-gray-500 border-primary-600'
                        : 'text-gray-600 border-gray-300'
                "
            >
                <p class="text-center label_2 text-gray-700 font-medium">
                    {{ price.title }}
                </p>
            </button>
        </div>

        <h4 class="font-medium text-gray-800 text-base my-3">Khoảng giá từ</h4>

        <div class="flex items-center justify-between">
            <input
                type="text"
                placeholder="50.000₫"
                class="input-price caption py-1 px-[10px] rounded-md border-[1px] border-gray-300 bg-white h-10"
                autocomplete="off"
                @input="onChangePrice($event, { type: 1 })"
            />

            <div class="label_2 font-medium text-black">-</div>
            <input
                type="text"
                placeholder="500.000₫"
                class="input-price caption py-1 px-[10px] rounded-md border-[1px] border-gray-300 bg-white h-10"
                autocomplete="off"
                @input="onChangePrice($event, { type: 2 })"
            />
        </div>

        <button
            class="uppercase w-full mt-3 py-2 px-[18px] rounded-lg bg-primary-600 text-sm text-white font-semibold"
            @click="applyPrice()"
        >
            ÁP DỤNG
        </button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            prices: [
                {
                    title: "Dưới 100.000₫",
                    value: "0-100000",
                },
                {
                    title: "100.000₫ đến 300.000₫",
                    value: "100000-300000",
                },
                {
                    title: "300.000₫ đến 500.000₫",
                    value: "300000-500000",
                },
                {
                    title: "Trên 500.000₫",
                    value: "500000-999999999",
                },
            ],
            priceOne: "",
            priceTwo: "",
        };
    },
    computed: {
        route() {
            return this.$attrs.route || {};
        },
    },

    methods: {
        applyPrice() {
            if (!this.priceOne && !this.priceTwo) return;

            const _priceOne = Number(this.priceOne.replaceAll(".", ""));
            const _priceTwo = Number(this.priceTwo.replaceAll(".", ""));

            const price = `${_priceOne}-${_priceTwo}`;

            this.pushToUrlPrice(price);
        },

        formatPrice(n) {
            if (!Number(n)) return null;
            return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        onChangePrice(event, { type = 1 } = {}) {
            let value = event.target.value;

            value = value.replaceAll(".", "");

            if (value === "") return;

            let price = this.formatPrice(value);

            if (price) {
                // Save
                if (type === 1) {
                    this.priceOne = price;
                } else {
                    this.priceTwo = price;
                }
            } else {
                // Reset
                if (type === 1) price = this.priceOne;
                else price = this.priceTwo;
            }
            event.target.value = price;
        },
        pushToUrlPrice(price) {
            let params = this.route.query || {};

            if (!params.prices || (params.prices && params.prices !== price)) {
                params = {
                    ...params,
                    prices: price,
                };
            } else {
                delete params.prices;
            }

            this.$emit("pushToUrl", params);
        },
    },
};
</script>
<style lang="scss" scoped>
.input-price {
    @apply block w-[44%] bg-white text-gray-600 focus:ring-0 outline-none focus-within:border-primary-600 focus:border-primary-600 focus:outline-none py-1.5 px-2 border border-gray-300 rounded;

    &::placeholder {
        @apply text-gray-700 text-sm text-center;
    }
}
</style>
