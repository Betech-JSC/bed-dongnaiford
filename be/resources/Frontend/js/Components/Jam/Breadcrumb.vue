<template>
    <div v-if="items && items.length" class="breadcrumbs line-clamp-1 body-2 py-[12px]">
        <div class="flex items-center gap-x-2">
            <a class="duration-300 ease-in-out text-primary-700 lg:hover:text-primary-900" :href="route('home')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.5 8.80384C2.5 8.32521 2.5 8.0859 2.56169 7.86551C2.61633 7.67029 2.70614 7.48667 2.82669 7.32368C2.96278 7.13968 3.15168 6.99276 3.52949 6.6989L9.18141 2.30297C9.47418 2.07526 9.62057 1.9614 9.78221 1.91763C9.92484 1.87902 10.0752 1.87902 10.2178 1.91763C10.3794 1.9614 10.5258 2.07526 10.8186 2.30297L16.4705 6.69891C16.8483 6.99276 17.0372 7.13968 17.1733 7.32368C17.2939 7.48667 17.3837 7.67029 17.4383 7.86551C17.5 8.0859 17.5 8.32521 17.5 8.80384V14.833C17.5 15.7664 17.5 16.2331 17.3183 16.5896C17.1586 16.9032 16.9036 17.1582 16.59 17.318C16.2335 17.4996 15.7668 17.4996 14.8333 17.4996H5.16667C4.23325 17.4996 3.76654 17.4996 3.41002 17.318C3.09641 17.1582 2.84144 16.9032 2.68166 16.5896C2.5 16.2331 2.5 15.7664 2.5 14.833V8.80384Z"
                        stroke="#B61F04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </a>
            <template v-for="(item, index) in items" :key="index">
                <template v-if="item.link">
                    <span class="separator text-gray-900">
                        <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.792627 6.84793L3.89862 3.75115C3.93548 3.71429 3.96154 3.67435 3.97677 3.63134C3.99226 3.58833 4 3.54224 4 3.49309C4 3.44393 3.99226 3.39785 3.97677 3.35484C3.96154 3.31183 3.93548 3.27189 3.89862 3.23502L0.792627 0.129032C0.706605 0.0430107 0.599078 0 0.470046 0C0.341014 0 0.230415 0.046083 0.138249 0.138249C0.046083 0.230415 5.29987e-08 0.337942 5.29987e-08 0.46083C5.29987e-08 0.583717 0.046083 0.691244 0.138249 0.78341L2.84793 3.49309L0.138249 6.20277C0.0522274 6.28879 0.0092165 6.39472 0.0092165 6.52055C0.0092165 6.64664 0.0552995 6.75576 0.147465 6.84793C0.239631 6.94009 0.347158 6.98618 0.470046 6.98618C0.592934 6.98618 0.700461 6.94009 0.792627 6.84793V6.84793Z"
                                fill="#344054" />
                        </svg>
                    </span>
                    <a class="text-primary lg:hover:text-primary-900" :href="item.link">{{ item.title }}</a>
                </template>
                <template v-else>
                    <span class="separator text-gray-900">
                        <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.792627 6.84793L3.89862 3.75115C3.93548 3.71429 3.96154 3.67435 3.97677 3.63134C3.99226 3.58833 4 3.54224 4 3.49309C4 3.44393 3.99226 3.39785 3.97677 3.35484C3.96154 3.31183 3.93548 3.27189 3.89862 3.23502L0.792627 0.129032C0.706605 0.0430107 0.599078 0 0.470046 0C0.341014 0 0.230415 0.046083 0.138249 0.138249C0.046083 0.230415 5.29987e-08 0.337942 5.29987e-08 0.46083C5.29987e-08 0.583717 0.046083 0.691244 0.138249 0.78341L2.84793 3.49309L0.138249 6.20277C0.0522274 6.28879 0.0092165 6.39472 0.0092165 6.52055C0.0092165 6.64664 0.0552995 6.75576 0.147465 6.84793C0.239631 6.94009 0.347158 6.98618 0.470046 6.98618C0.592934 6.98618 0.700461 6.94009 0.792627 6.84793V6.84793Z"
                                fill="#344054" />
                        </svg>
                    </span>
                    <span class="text-primary line-clamp-1" v-if="!ish1">{{ item.title }}</span>
                    <h1 class="inline text-primary line-clamp-1" v-else>{{ item.title }}</h1>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['items', 'ish1', 'isWhite'],
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
    @apply space-x-[20px];

    >*:not(:last-child) {
        @apply relative;

        &::after {
            content: '';
            pointer-events: none;
            @apply absolute top-0 right-[-11px] w-[4px] transform translate-x-[50%] h-full bg-no-repeat bg-center;
            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgNCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC43OTI2MjcgNy43ODY4OUwzLjg5ODYyIDQuNjkwMTJDMy45MzU0OCA0LjY1MzI1IDMuOTYxNTQgNC42MTMzMSAzLjk3Njc3IDQuNTcwM0MzLjk5MjI2IDQuNTI3MjkgNCA0LjQ4MTIxIDQgNC40MzIwNUM0IDQuMzgyOSAzLjk5MjI2IDQuMzM2ODEgMy45NzY3NyA0LjI5MzhDMy45NjE1NCA0LjI1MDc5IDMuOTM1NDggNC4yMTA4NSAzLjg5ODYyIDQuMTczOTlMMC43OTI2MjcgMS4wNjhDMC43MDY2MDUgMC45ODE5NzYgMC41OTkwNzggMC45Mzg5NjUgMC40NzAwNDYgMC45Mzg5NjVDMC4zNDEwMTQgMC45Mzg5NjUgMC4yMzA0MTUgMC45ODUwNDggMC4xMzgyNDkgMS4wNzcyMUMwLjA0NjA4MyAxLjE2OTM4IDAgMS4yNzY5MSAwIDEuMzk5NzlDMCAxLjUyMjY4IDAuMDQ2MDgzIDEuNjMwMjEgMC4xMzgyNDkgMS43MjIzOEwyLjg0NzkzIDQuNDMyMDVMMC4xMzgyNDkgNy4xNDE3M0MwLjA1MjIyNzUgNy4yMjc3NSAwLjAwOTIxNjU1IDcuMzMzNjggMC4wMDkyMTY1NSA3LjQ1OTUyQzAuMDA5MjE2NTUgNy41ODU2IDAuMDU1Mjk5NSA3LjY5NDczIDAuMTQ3NDY1IDcuNzg2ODlDMC4yMzk2MzEgNy44NzkwNiAwLjM0NzE1OCA3LjkyNTE0IDAuNDcwMDQ2IDcuOTI1MTRDMC41OTI5MzQgNy45MjUxNCAwLjcwMDQ2MSA3Ljg3OTA2IDAuNzkyNjI3IDcuNzg2ODlaIiBmaWxsPSIjMzQ0MDU0Ii8+Cjwvc3ZnPgo=');
        }
    }

    >*:not(:last-child) {
        @apply relative text-primary-700 lg:hover:text-primary-900 duration-300 ease-in-out;
    }

    &.is-background {
        >*:not(:last-child) {
            &::after {
                background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgNCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC43OTI2MjcgNy4zNTQ3NkwzLjg5ODYyIDQuMjU3OTlDMy45MzU0OCA0LjIyMTEyIDMuOTYxNTQgNC4xODExOCAzLjk3Njc3IDQuMTM4MTdDMy45OTIyNiA0LjA5NTE2IDQgNC4wNDkwOCA0IDMuOTk5OTJDNCAzLjk1MDc3IDMuOTkyMjYgMy45MDQ2OSAzLjk3Njc3IDMuODYxNjhDMy45NjE1NCAzLjgxODY2IDMuOTM1NDggMy43Nzg3MyAzLjg5ODYyIDMuNzQxODZMMC43OTI2MjcgMC42MzU4NjhDMC43MDY2MDUgMC41NDk4NDcgMC41OTkwNzggMC41MDY4MzYgMC40NzAwNDYgMC41MDY4MzZDMC4zNDEwMTQgMC41MDY4MzYgMC4yMzA0MTUgMC41NTI5MTkgMC4xMzgyNDkgMC42NDUwODVDMC4wNDYwODMgMC43MzcyNTEgMCAwLjg0NDc3OCAwIDAuOTY3NjY1QzAgMS4wOTA1NSAwLjA0NjA4MyAxLjE5ODA4IDAuMTM4MjQ5IDEuMjkwMjVMMi44NDc5MyAzLjk5OTkyTDAuMTM4MjQ5IDYuNzA5NkMwLjA1MjIyNzUgNi43OTU2MiAwLjAwOTIxNjU1IDYuOTAxNTUgMC4wMDkyMTY1NSA3LjAyNzM5QzAuMDA5MjE2NTUgNy4xNTM0NyAwLjA1NTI5OTUgNy4yNjI2IDAuMTQ3NDY1IDcuMzU0NzZDMC4yMzk2MzEgNy40NDY5MyAwLjM0NzE1OCA3LjQ5MzAxIDAuNDcwMDQ2IDcuNDkzMDFDMC41OTI5MzQgNy40OTMwMSAwLjcwMDQ2MSA3LjQ0NjkzIDAuNzkyNjI3IDcuMzU0NzZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K');
            }
        }

        >a:not(:last-child) {
            @apply text-white opacity-100;
        }

        >span:not(:last-child) {
            @apply text-white opacity-100;
        }

        span {
            @apply text-white;
        }
    }
}
</style>
