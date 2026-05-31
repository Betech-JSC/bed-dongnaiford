<template>
    <div v-if="item.slug" class="flex flex-col group">
        <Link
            :href="
                route('services.show', {
                    slug: item.slug,
                })
            "
            class="block overflow-hidden notranslate"
        >
            <div class="aspect-w-3 aspect-h-2">
                <JPicture
                    :src="item.image?.url || '/assets/images/cover.jpg'"
                    wrapperClass="picture-cover h-full lg:group-hover:scale-105 lg:duration-150"
                    :alt="item.alt || item.title"
                />
            </div>
        </Link>
        <div
            class="flex-1 xl:py-6 md:py-[18px] py-2 xl:px-8 md:px-[22px] px-3 bg-gradient-blue relative overflow-hidden"
        >
            <Link
                :href="
                    route('services.show', {
                        slug: item.slug,
                    })
                "
                class="text-white title-1 line-clamp-2 xl:h-[64px] md:h-14 h-10 lg:group-hover:text-green-default lg:duration-150 relative z-30 notranslate"
            >
                <h3>{{ item.title }}</h3></Link
            >
            <div
                class="w-[221px] h-[221px] absolute right-0 top-0 translate-x-full lg:group-hover:translate-x-[21%] lg:duration-150 z-10"
            >
                <JPicture src="/assets/images/home/shape-big.png" :alt="tt('shape-big')" />
            </div>
            <div
                class="w-[221px] h-[221px] absolute right-0 top-0 translate-x-full lg:group-hover:translate-x-[43%] lg:duration-150 z-20"
            >
                <JPicture src="/assets/images/home/shape-small.png" :alt="tt('shape-small')" />
            </div>
        </div>
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
