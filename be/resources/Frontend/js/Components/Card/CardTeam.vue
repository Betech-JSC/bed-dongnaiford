<template>
    <Link :href="item.slug" class="relative group rounded-[16px] overflow-hidden p-2 md:p-3 lg:p-4 md:space-y-4 space-y-3 xl:space-y-6 bg-white block h-full lg:hover:shadow-lg duration-300 ease-in-out">
        <div class="relative aspect-w-3 aspect-h-4 rounded-[12px] overflow-hidden">
            <JPicture
                :src="item.image?.url"
                :alt="item.image?.alt || item.title"
                class="object-cover h-full w-full lg:group-hover:scale-105 duration-300 ease-in-out"
            />
        </div>
        <div class="space-y-1 5">
            <div class="title-2 font-bold text-gray-900 lg:group-hover:text-primary-700 line-clamp-1 duration-300 ease-in-out notranslate" translate="no">
                {{ item.title }}
            </div>
            <div class="body-2 notranslate" translate="no">{{ item.position }}</div>
        </div>
    </Link>
</template>

<script>
export default {
    props: ['item'],
}
</script>
