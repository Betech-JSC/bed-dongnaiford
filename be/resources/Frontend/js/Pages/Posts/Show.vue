<template>
    <main>
        <section class="pt-10 md:pb-16 pb-12 xl:pb-20 bg-gray-100">
            <div class="container">
                <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
                    <div class="col-span-full xl:col-span-8 xl:col-start-3 space-y-3 text-center">
                        <div class="flex items-center justify-center gap-[22px]">
                            <div
                                class="bg-primary-400 text-gray-900 rounded-full px-2.5 py-0.5 body-1 w-fit font-medium notranslate">
                                {{ post?.category?.title }}
                            </div>
                            <div class="body-1 font-medium text-gray-900">
                                {{ formatDate(post?.published_at) }}
                            </div>
                        </div>
                        <h1 class="headline-1 font-bold text-gray-900 notranslate">
                            {{ post?.title }}
                        </h1>
                        <div class="body-1 text-gray-900 notranslate">
                            {{ post?.description }}
                        </div>
                    </div>
                    <div class="col-span-full">
                        <div
                            class="aspect-w-2 aspect-h-1 md:rounded-xl rounded-lg xl:rounded-3xl relative overflow-hidden">
                            <JPicture :src="post?.image?.url || '/cover.jpg'" :alt="post?.image?.alt || post?.title"
                                class="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div class="xl:col-span-8 xl:col-start-3 col-span-full">
                        <div class="prose prose-blog notranslate" v-html="post?.content" translate="no"></div>
                    </div>
                </div>
            </div>
        </section>
        <SectionRelatedPosts v-if="related_posts && related_posts.length > 0" :items="related_posts" />
    </main>
</template>

<script>
export default {
    props: ['post', 'related_posts'],
}
</script>
