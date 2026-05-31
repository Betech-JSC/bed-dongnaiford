<template>
    <div v-if="item.slug" class="space-y-3 group">
        <Link :href="route('products.show', {
            slug: item.slug,
        })
            " class="aspect-w-1 aspect-h-1 block relative overflow-hidden rounded-xl">
        <JPicture :src="item.image?.static_url || '/assets/images/placeholder-square.png'"
            :alt="item.image?.alt || item.title" wrapperClass="picture-cover"
            class="w-full h-full object-cover lg:group-hover:scale-95 duration-300 ease-in-out" />
        </Link>
        <div class="md:space-y-4 space-y-3 xl:space-y-6 p-3 rounded-xl">
            <div class="space-y-1">
                <div class="body-2 text-gray-900 notranslate" translate="no">{{ item.title_en || 'Chưa cập nhật' }}</div>
                <Link :href="route('products.show', {
                    slug: item.slug,
                })
                    "
                    class="label-1 font-semibold text-brand-100 lg:group-hover:text-primary duration-300 ease-in-out notranslate" translate="no">
                {{ item.title }}
                </Link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
