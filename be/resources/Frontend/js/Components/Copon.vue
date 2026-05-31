<template>
    <div
        class="flex overflow-hidden gap-2 items-center py-1 pr-1 pl-3 w-full bg-white border border-gray-300 rounded-full"
    >
        <div class="flex flex-1 shrink gap-2 items-center self-stretch my-auto text-base text-gray-500 basis-10">
            <input
                v-model="discountCode"
                type="text"
                placeholder="Discount code"
                class="flex-1 shrink self-stretch my-auto text-gray-500 basis-0 bg-transparent border-none outline-none body-1"
            />
        </div>
        <button
            @click="applyDiscount"
            class="flex overflow-hidden gap-2 justify-center items-center self-stretch px-5 py-3 my-auto text-primary-100 bg-primary-800 lg:hover:bg-primary-900 duration-300 ease-in-out border border-primary-800 border-solid min-h-[51px] rounded-full button-1"
        >
            Áp dụng
        </button>
    </div>
</template>

<script>
export default {}
</script>

<style>
</style>