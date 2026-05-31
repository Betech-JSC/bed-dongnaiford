<template>
    <article v-if="item.slug" class="relative space-y-6 group">
        <Link
            :href="
                route('posts.show', {
                    slug: item.slug,
                })
            "
            class="aspect-w-8 aspect-h-5 relative overflow-hidden block"
        >
            <JPicture
                :src="item.image.url || '/cover.jpg'"
                :alt="item.image.alt || item.title || 'image card sign'"
                wrapperClass="picture-cover"
                class="w-full h-full object-cover lg:group-hover:scale-105 duration-300 ease-in-out"
            />
        </Link>
        <div class="relative space-y-1">
            <Link
                :href="
                    route('posts.show', {
                        slug: item.slug,
                    })
                "
                class="title-1 text-primary lg:group-hover:text-primary-900 duration-300 ease-in-out notranslate" translate="no"
            >
                {{ item.title }}
            </Link>
            <Link
                :href="
                    route('posts.show', {
                        slug: item.slug,
                    })
                "
                class="flex items-center gap-2 text-primary-700 lg:hover:text-primary-900 duration-300 ease-in-out"
            >
                <ArrowCircle />
                <span>Xem thêm</span>
            </Link>
        </div>
    </article>
</template>
<script>
import ArrowCircle from '@/Components/Icons/ArrowCircle.vue'

export default {
    components: { ArrowCircle },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
