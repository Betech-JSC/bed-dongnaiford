<template>
    <div class="grid grid-cols-1 mt-3 md:grid-cols-2 xl:mt-6 md:mt-4 xl:gap-x-8 md:gap-x-6 max-md:gap-y-4">
        <JCardBlog :item="posts[0]" :language="$page.props.locale.current" />

        <div class="xl:space-y-[30px] md:space-y-[21px] space-y-[15px]">
            <JCardBlog
                v-for="(post, index) in posts.slice(1, 4)"
                :key="index"
                class="card-blog-sm card-blog-row card-blog-no-description"
                :item="post"
                :language="$page.props.locale.current"
            />
        </div>
    </div>
</template>
<script>
export default {
    props: ['posts'],
}
</script>
