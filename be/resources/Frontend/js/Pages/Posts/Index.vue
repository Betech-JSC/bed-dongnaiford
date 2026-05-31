<template>
    <main>
        <BannerImage :banner="banners[0]" />
        <section class="py-20 bg-gray-100">
            <div class="container md:space-y-6 space-y-4 xl:space-y-16">
                <AnimatedAppear>
                    <CardCardPostRow :item="top_posts[0]" />
                </AnimatedAppear>
                <div class="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3 xl:gap-x-5 xl:gap-y-16">
                    <AnimatedAppear v-for="(itemPost, indexPost) in posts?.data" :key="indexPost">
                        <CardCardPost :item="itemPost" />
                    </AnimatedAppear>
                </div>
                <Pagination :links="posts?.links" />
            </div>
        </section>
    </main>
</template>
<script>
import Pagination from '@/Components/Paginate.vue'

export default {
    components: { Pagination },
    props: ['categories', 'posts', 'top_posts', 'banners'],
}
</script>
