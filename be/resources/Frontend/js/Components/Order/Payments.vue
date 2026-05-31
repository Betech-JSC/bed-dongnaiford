<template>
    <div class="space-y-3">
        <div v-for="(payment, index) in payments" :key="index">
            <div class="radio-control w-max group ml-3">
                <label
                    class="relative z-10 cursor-pointer pl-[24px] flex items-center gap-x-2"
                    :for="`payment-type-${payment.id}`"
                >
                    <div v-if="payment.image_url" :class="payment.className">
                        <img :src="payment.image_url" class="object-cover" alt="payment" />
                    </div>
                    <div class="title-3 text-gray-900 font-bold">
                        {{ payment.title }}
                    </div>
                </label>
                <input
                    type="radio"
                    class="hidden"
                    name="payment-type"
                    :id="`payment-type-${payment.id}`"
                    :checked="payment.id === modelValue"
                    :value="payment.id"
                    @input="$emit('update:modelValue', $event.target.value)"
                />
                <span class="checkmark"></span>
            </div>
            <div class="my-3" :class="index === payments.length - 1 ? 'hidden' : 'block'">
                <hr class="h-[1px] w-full bg-gray-300" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['payments', 'modelValue'],
    emits: ['update:modelValue'],
}
</script>
<style lang="scss">
.radio-control {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    @apply relative;
    .checkmark {
        @apply overflow-hidden  w-[16px] h-[16px] absolute top-1/2 left-0 transform -translate-y-1/2 border border-gray-300  rounded-full;
        &:before {
            @apply content-[''] block p-[32%] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
        }
    }

    input:checked ~ .checkmark {
        @apply border-black;
        &:before {
            @apply bg-cover object-cover bg-no-repeat bg-center bg-black;
        }
    }
}
</style>
