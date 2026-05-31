<template>
    <div class="flex justify-between pb-3 space-x-2 xl:space-x-4 md:space-x-3 xl:pb-6 md:pb-4">
        <h2 class="display-3 text-primary">
            {{ item.title }}
        </h2>
        <Link v-if="item.url" :href="item.url" class="btn btn-primary btn-lg" :class="isHome ? '!px-[69px]' : ''">{{
            tt('Xem tất cả')
        }}</Link>
    </div>
</template>

<script>
export default {
    props: ['item', 'isHome'],
}
</script>
