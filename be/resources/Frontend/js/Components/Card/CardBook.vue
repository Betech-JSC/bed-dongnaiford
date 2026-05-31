<template>
    <Link :href="route('products.show', { slug: item.slug })" class="relative group rounded-[16px] overflow-hidden p-3 space-y-4 bg-white block h-full">
        <div class="relative aspect-w-1 aspect-h-1 rounded-[12px] overflow-hidden">
            <JPicture
                :src="item.image_url || '/assets/placeholder-col.jpg'"
                :alt="item.title || 'image product'"
                wrapperClass="picture-cover h-full w-full lg:group-hover:scale-105 duration-300 ease-in-out"
            />
        </div>
        <div class="title-2 font-bold text-gray-900 lg:group-hover:text-primary-600 line-clamp-2 min-h-[52px] duration-300 ease-in-out notranslate" translate="no">
            {{ item.title }}
        </div>
    </Link>
</template>

<script>
export default {
    props: ['item'],
}
</script>
