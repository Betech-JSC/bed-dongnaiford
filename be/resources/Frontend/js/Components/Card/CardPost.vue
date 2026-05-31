<template>
    <div v-if="item?.slug" class="group space-y-2 md:space-y-4 p-2 md:p-4 border border-gray-200 bg-white rounded-xl">
        <Link :href="route('posts.show', {
            slug: item.slug,
        })
            " class="aspect-w-3 aspect-h-2 relative rounded-md overflow-hidden block">
        <JPicture :src="item.image.url || '/cover.jpg'" :alt="item.image.alt || item.title || 'image card post'"
            wrapperClass="picture-cover"
            class="w-full h-full object-cover lg:group-hover:scale-105 duration-300 ease-in-out" />
        </Link>
        <div class="md:p-2 space-y-3 md:space-y-5">
            <Link :href="route('posts.show', {
                slug: item.slug,
            })
                "
                class="headline-3 line-clamp-2 font-bold text-gray-800 lg:group-hover:text-primary duration-300 ease-in-out block notranslate" translate="no">
            {{ item.title }}
            </Link>
            <p class="body-1 text-gray-400">
                {{ formatDateTime(item.published_at) }}
            </p>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps({
    item: {
        type: Object,
        required: true,
    },
})

const formatDateTime = (date) => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY')
}
</script>
