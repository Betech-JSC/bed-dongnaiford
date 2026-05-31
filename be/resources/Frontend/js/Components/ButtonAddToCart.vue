<template lang="">
    <button class="btn-add-to-cart w-full h-12 group" aria-label="buy now">
        <div class="px-2 py-1 text-center">
            <div class="uppercase flex items-center gap-x-2">
                <div class="group-hover:translate-x-[5px] duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <g clip-path="url(#clip0_11984_380)">
                            <path
                                d="M5.66662 14.1667H14.691C15.4826 14.1667 15.8784 14.1667 16.201 14.0237C16.4854 13.8977 16.7289 13.6945 16.9038 13.4372C17.1022 13.1454 17.173 12.756 17.3146 11.9771L18.4403 5.78601C18.4894 5.51606 18.5139 5.38109 18.476 5.2757C18.4427 5.18324 18.3778 5.10551 18.2928 5.05624C18.1959 5.00008 18.0587 5.00008 17.7844 5.00008H4.41662M1.9165 1.66675H3.01351C3.21575 1.66675 3.31687 1.66675 3.39865 1.70369C3.47073 1.73625 3.53206 1.78865 3.57546 1.85477C3.6247 1.92979 3.64047 2.02967 3.67202 2.22944L5.99432 16.9374C6.02587 17.1372 6.04164 17.237 6.09088 17.3121C6.13428 17.3782 6.19561 17.4306 6.26769 17.4631C6.34947 17.5001 6.45059 17.5001 6.65283 17.5001H16.0832"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_11984_380">
                                <rect width="20" height="20" fill="white" transform="translate(0.25)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <p class="button-1 text-white font-bold font-display">
                    {{ tt('Đăng ký thuê') }}
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
.btn-add-to-cart {
    background: linear-gradient(81deg, #1da89f 8.3%, #025e33 103.63%);
    width: '100%';
    @apply text-white py-[14px] px-[18px] border rounded flex items-center justify-center;
    &.out-of-stock {
        @apply bg-gray-200 text-gray-400 pointer-events-none;
    }
}
.btn-add-to-cart:hover {
    background: #101828;
}
</style>
