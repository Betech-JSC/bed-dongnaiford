<template>
    <div v-if="item.slug" class="group">
        <Link
            :href="
                route('posts.show', {
                    slug: item.slug ?? '',
                })
            "
        >
            <div class="block overflow-hidden">
                <div class="aspect-w-3 aspect-h-2">
                    <img
                        :src="item.image?.url || '/assets/images/cover.jpg'"
                        class="picture-cover w-full lg:group-hover:scale-105 lg:duration-[400ms] line-clamp-2"
                        :alt="item.alt || item.title"
                    />
                </div>
            </div>
            <div class="space-y-[8px] p-3 bg-white">
                <p class="title-4 text-gray-500 font-bold">{{ formatDate(item?.published_at) }}</p>
                <p class="text-black title-2 font-bold line-clamp-2 h-[52px]">
                    {{ item?.title }}
                </p>
                <p class="text-gray-700 body-2 font-normal line-clamp-3">
                    {{ item?.description }}
                </p>
            </div>
        </Link>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
}
</script>
