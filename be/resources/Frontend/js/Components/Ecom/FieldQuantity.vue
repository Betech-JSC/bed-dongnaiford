<template>
    <div
        class="quantity-order h-[44px] md:h-[44px] inline-flex items-center border border-gray-300 rounded bg-white shadow-xs overflow-hidden"
        :class="{
            'is-sm': size === 'sm',
        }"
    >
        <div class="flex-1 h-full py-[1px] input-wrap">
            <input
                type="number"
                ref="inputQuantity"
                inputmode="numeric"
                :value="quantity"
                autocomplete="off"
                @input="validateInput($event)"
                @blur="onBlur"
                min="1"
                class="px-[6px] w-full font-medium text-center text-gray-700 label_2 border-none shadow-none outline-none input-number focus:outline-none ring-0 focus:ring-0 leading-[100%] h-full"
                :class="[classInput]"
            />
        </div>
    </div>
</template>

<script>
export default {
    emits: ['update:quantity'],
    props: {
        size: { type: String, default: '' }, // is-sm | is-lg
        quantity: {
            type: Number,
            default: 1,
        },
        classInput: {
            type: String,
            default: '',
        },
        isDisableZero: { type: Boolean, default: false },
    },

    methods: {
        validateInput(event) {
            let value = event.target.value

            if (this.isDisableZero && (value === '' || value === '0')) {
                value = ''
            }

            this.$emit('update:quantity', value ? Math.max(1, Number(value)) : value)
        },

        onBlur() {
            let value = Number(this.$refs.inputQuantity.value)

            if (this.isDisableZero && (isNaN(value) || value <= 0)) {
                value = 1
            }

            this.$refs.inputQuantity.value = value
            this.$emit('update:quantity', value)
        },
    },
}
</script>

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type='number'] {
    -moz-appearance: textfield;
}
</style>
