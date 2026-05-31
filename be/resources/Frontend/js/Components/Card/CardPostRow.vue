<template>
    <div v-if="item?.slug"
        class="flex md:flex-row flex-col items-start gap-4 xl:gap-6 group rounded-xl bg-white border border-gray-200 md:py-6 p-3 xl:py-8 md:px-2.5 xl:px-3.5">
        <Link :href="route('posts.show', {
            slug: item.slug,
        })
            "
            class="md:max-w-[350px] lg:max-w-[450px] xl:max-w-[595px] w-full relative overflow-hidden md:rounded-[24px] rounded-[16px] xl:rounded-[40px] block">
        <div class="aspect-w-3 aspect-h-2">
            <JPicture :src="item.image.url || '/cover.jpg'" :alt="item.image.alt || item.title || 'image card post'"
                wrapperClass="picture-cover"
                class="w-full h-full object-cover lg:group-hover:scale-105 duration-300 ease-in-out" />
        </div>
        </Link>

        <div class="flex-1 my-auto w-full space-y-6">
            <div class="body-2 font-medium text-[#DC2B46] bg-[#4B6BFB]/5 py-1 px-2.5 rounded-md uppercase w-fit">
                Mới nhất
            </div>
            <Link :href="route('posts.show', {
                slug: item.slug,
            })
                "
                class="headline-2 line-clamp-3 font-bold text-gray-800 lg:group-hover:text-primary duration-300 ease-in-out notranslate" translate="no">
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
        default: () => ({
            title: '',
            description: '',
            image: '',
            date: '',
            readTime: 0,
        }),
    },
})

const formatDateTime = (date) => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}
</script>
