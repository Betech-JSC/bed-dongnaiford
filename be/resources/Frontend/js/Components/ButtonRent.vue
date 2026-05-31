<template lang="">
    <button class="btn-rent w-full h-12 group" aria-label="buy now">
        <div class="text-center">
            <div class="uppercase flex items-center gap-x-2">
                <div class="group-hover:translate-x-[5px] duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path
                            d="M10.7498 4.16675V15.8334M4.9165 10.0001H16.5832"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <p class="button-1 text-white font-bold font-display">
                    {{ tt('thêm vào giỏ hàng') }}
                </p>
            </div>
        </div>
    </button>
</template>
<script>
export default {
    props: {
        condition: {
            type: String,
        },
    },
}
</script>

<style lang="scss" scoped>
.btn-rent {
    background: black;
    width: '100%';
    @apply text-white py-[14px] px-[18px] border rounded flex items-center justify-center;
    &.out-of-stock {
        @apply bg-gray-200 text-gray-400 pointer-events-none;
    }
}
.btn-rent:hover {
    @apply bg-gray-900 duration-700;
}
</style>
