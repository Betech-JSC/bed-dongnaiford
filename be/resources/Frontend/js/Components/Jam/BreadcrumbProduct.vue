<template>
    <div v-if="items && items.length" class="breadcrumbs caption body-2 py-[12px]">
        <div class="flex items-center overflow-hidden overflow-x-scroll whitespace-nowrap">
            <a class="text-gray-500" :href="route('home')">{{ tt('Trang chủ') }}</a>
            <template v-for="(item, index) in items" :key="index">
                <template v-if="item.link">
                    <span class="text-gray-500 separator">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.79263 13.3548L11.8986 10.258C11.9355 10.2211 11.9615 10.1812 11.9768 10.1382C11.9923 10.0952 12 10.0491 12 9.99992C12 9.95077 11.9923 9.90469 11.9768 9.86168C11.9615 9.81866 11.9355 9.77873 11.8986 9.74186L8.79263 6.63587C8.70661 6.54985 8.59908 6.50684 8.47005 6.50684C8.34101 6.50684 8.23041 6.55292 8.13825 6.64508C8.04608 6.73725 8 6.84478 8 6.96767C8 7.09055 8.04608 7.19808 8.13825 7.29025L10.8479 9.99992L8.13825 12.7096C8.05223 12.7956 8.00922 12.9016 8.00922 13.0274C8.00922 13.1535 8.0553 13.2626 8.14747 13.3548C8.23963 13.4469 8.34716 13.493 8.47005 13.493C8.59293 13.493 8.70046 13.4469 8.79263 13.3548Z"
                                fill="#667085"
                            />
                        </svg>
                    </span>
                    <a class="text-gray-500" :href="item.link">{{ item.title }}</a>
                </template>
                <template v-else>
                    <span class="text-gray-500" v-if="!ish1">{{ item.title }}</span>
                    <h1 class="inline text-gray-500" v-else>{{ item.title }}</h1>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items', 'ish1'],
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
    @apply space-x-[20px];
    > *:not(:last-child) {
        @apply relative;
        &::after {
            content: '';
            pointer-events: none;
            @apply absolute top-0 right-[-11px] w-[4px]  transform translate-x-[50%] h-full bg-no-repeat bg-center;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgNCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC43OTI2MjcgNy43ODY4OUwzLjg5ODYyIDQuNjkwMTJDMy45MzU0OCA0LjY1MzI1IDMuOTYxNTQgNC42MTMzMSAzLjk3Njc3IDQuNTcwM0MzLjk5MjI2IDQuNTI3MjkgNCA0LjQ4MTIxIDQgNC40MzIwNUM0IDQuMzgyOSAzLjk5MjI2IDQuMzM2ODEgMy45NzY3NyA0LjI5MzhDMy45NjE1NCA0LjI1MDc5IDMuOTM1NDggNC4yMTA4NSAzLjg5ODYyIDQuMTczOTlMMC43OTI2MjcgMS4wNjhDMC43MDY2MDUgMC45ODE5NzYgMC41OTkwNzggMC45Mzg5NjUgMC40NzAwNDYgMC45Mzg5NjVDMC4zNDEwMTQgMC45Mzg5NjUgMC4yMzA0MTUgMC45ODUwNDggMC4xMzgyNDkgMS4wNzcyMUMwLjA0NjA4MyAxLjE2OTM4IDAgMS4yNzY5MSAwIDEuMzk5NzlDMCAxLjUyMjY4IDAuMDQ2MDgzIDEuNjMwMjEgMC4xMzgyNDkgMS43MjIzOEwyLjg0NzkzIDQuNDMyMDVMMC4xMzgyNDkgNy4xNDE3M0MwLjA1MjIyNzUgNy4yMjc3NSAwLjAwOTIxNjU1IDcuMzMzNjggMC4wMDkyMTY1NSA3LjQ1OTUyQzAuMDA5MjE2NTUgNy41ODU2IDAuMDU1Mjk5NSA3LjY5NDczIDAuMTQ3NDY1IDcuNzg2ODlDMC4yMzk2MzEgNy44NzkwNiAwLjM0NzE1OCA3LjkyNTE0IDAuNDcwMDQ2IDcuOTI1MTRDMC41OTI5MzQgNy45MjUxNCAwLjcwMDQ2MSA3Ljg3OTA2IDAuNzkyNjI3IDcuNzg2ODlaIiBmaWxsPSIjMzQ0MDU0Ii8+Cjwvc3ZnPgo=');
        }
    }

    > *:not(:last-child) {
        @apply relative text-white opacity-70;
    }
    span {
        @apply text-gray-300 opacity-70;
    }

    &.is-background {
        > *:not(:last-child) {
            &::after {
                background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgNCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC43OTI2MjcgNy4zNTQ3NkwzLjg5ODYyIDQuMjU3OTlDMy45MzU0OCA0LjIyMTEyIDMuOTYxNTQgNC4xODExOCAzLjk3Njc3IDQuMTM4MTdDMy45OTIyNiA0LjA5NTE2IDQgNC4wNDkwOCA0IDMuOTk5OTJDNCAzLjk1MDc3IDMuOTkyMjYgMy45MDQ2OSAzLjk3Njc3IDMuODYxNjhDMy45NjE1NCAzLjgxODY2IDMuOTM1NDggMy43Nzg3MyAzLjg5ODYyIDMuNzQxODZMMC43OTI2MjcgMC42MzU4NjhDMC43MDY2MDUgMC41NDk4NDcgMC41OTkwNzggMC41MDY4MzYgMC40NzAwNDYgMC41MDY4MzZDMC4zNDEwMTQgMC41MDY4MzYgMC4yMzA0MTUgMC41NTI5MTkgMC4xMzgyNDkgMC42NDUwODVDMC4wNDYwODMgMC43MzcyNTEgMCAwLjg0NDc3OCAwIDAuOTY3NjY1QzAgMS4wOTA1NSAwLjA0NjA4MyAxLjE5ODA4IDAuMTM4MjQ5IDEuMjkwMjVMMi44NDc5MyAzLjk5OTkyTDAuMTM4MjQ5IDYuNzA5NkMwLjA1MjIyNzUgNi43OTU2MiAwLjAwOTIxNjU1IDYuOTAxNTUgMC4wMDkyMTY1NSA3LjAyNzM5QzAuMDA5MjE2NTUgNy4xNTM0NyAwLjA1NTI5OTUgNy4yNjI2IDAuMTQ3NDY1IDcuMzU0NzZDMC4yMzk2MzEgNy40NDY5MyAwLjM0NzE1OCA3LjQ5MzAxIDAuNDcwMDQ2IDcuNDkzMDFDMC41OTI5MzQgNy40OTMwMSAwLjcwMDQ2MSA3LjQ0NjkzIDAuNzkyNjI3IDcuMzU0NzZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
            }
        }
        > a:not(:last-child) {
            @apply text-white opacity-100;
        }
        > span:not(:last-child) {
            @apply text-white opacity-100;
        }
        span {
            @apply text-white;
        }
    }
}
</style>
