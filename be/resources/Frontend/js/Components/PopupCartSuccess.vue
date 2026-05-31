<template>
    <div
        class="fixed right-0 top-3 z-[200] !mt-0 duration-200"
        :class="open ? 'translate-x-[-12px]' : 'translate-x-full'"
    >
        <Link
            :href="route('checkout.cart.index')"
            class="flex items-center px-2 py-1 md:px-4 md:py-3 space-x-4 bg-[#F6FEF9] rounded-lg xl:w-[400px]"
        >
            <IconTick class="flex-shrink-0" />
            <div class="text-gray-700 p3 whitespace-nowrap">
                Đã thêm vào giỏ hàng thành công
            </div>
        </Link>
    </div>
</template>
<script>
export default {
    name: "popup-cart-success",
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
