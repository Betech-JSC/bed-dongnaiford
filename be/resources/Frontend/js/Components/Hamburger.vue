<template>
    <!-- menu-is-opened -->
    <div
        class="hamburger h-[24px] w-[24px] flex items-center justify-center"
        :class="isToggleMenu ? 'menu-is-opened' : ''"
    >
        <div class="hamburger__icon h-[24px] w-[24px]">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isToggleMenu: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.hamburger {
    &__icon {
        @apply flex flex-col justify-center cursor-pointer;

        div {
            width: 100%;
            height: 2px;
            margin-bottom: 3px;
            margin-top: 3px;
            @apply bg-gray-900 rounded-full transition ease-out duration-200 flex-shrink-0;
        }

        .menu-is-opened & {
            div {
                margin-bottom: 0;
                margin-top: 0;

                &:first-child {
                    transform: translateY(calc(50% + 2px)) rotate(45deg);
                }

                &:nth-child(2) {
                    opacity: 0;
                    width: 0px;
                }

                &:last-child {
                    transform: translateY(calc(50% - 2px)) rotate(-45deg);
                }
            }
        }
    }
}
</style>
