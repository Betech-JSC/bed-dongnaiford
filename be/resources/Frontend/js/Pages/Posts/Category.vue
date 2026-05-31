<template>
    <main>
        <JamBanner :image="bannerCategoryBlog" class="banner-sm">
            <div class="container flex items-center h-full">
                <div>
                    <JamBreadcrumb class="is-background" :items="breadcrumbs" />

                    <h1 class="mt-2 text-white xl:mt-4 md:mt-3 display-2">{{ tt('Tin tức') }}</h1>
                </div>
            </div>
        </JamBanner>
        <section
            class="py-5 bg-primary-400"
            v-if="$page.props.data.featured_category && $page.props.data.featured_category.slug === currentPageUrl"
        >
            <div class="container">
                <div class="flex flex-col items-center justify-center md:flex-row md:space-x-4">
                    <div class="text-white title-1 max-md:text-center max-md:mb-2">{{ tt('Tìm kiếm bài viết') }}</div>
                    <div class="lg:w-[627px] md:w-[400px] w-full relative" @click="$event.stopPropagation()">
                        <input
                            v-model="textSearch"
                            ref="inputSearchText"
                            @focusin="focusinSearch"
                            @keyup.enter="handleSearch(), $event.target.blur()"
                            :placeholder="`${tt('Tìm kiếm sản phẩm, thương hiệu')}...`"
                            class="block body-2 text-gray-900 w-full bg-white outline-none focus:ring-0 focus:outline-none pl-3 pr-[90px] py-[9.5px]"
                            :class="showPopupSearch ? 'rounded-t md:rounded-r max-md:rounded-b-none' : 'rounded'"
                        />
                        <button class="absolute top-0 right-0 btn btn-primary !h-10 !rounded-r" @click="handleSearch()">
                            {{ tt('Tìm kiếm') }}
                        </button>
                        <div
                            :class="showPopupSearch ? 'block' : 'hidden'"
                            class="absolute bottom-0 left-0 xl:right-[91px] lg:right-[90px] md:right-[91px] right-0 translate-y-full z-10"
                        >
                            <div class="w-full overflow-hidden bg-white rounded-b shadow-md">
                                <div class="overflow-y-auto lg:max-h-[346px] md:max-h-[288px] max-h-[256px]">
                                    <Link
                                        :href="
                                            route('nested_posts.show', {
                                                nested: searchPost.category.slug,
                                                slug: searchPost.slug,
                                            })
                                        "
                                        class="flex p-3 space-x-4 border-t border-t-gray-100 group"
                                        v-for="(searchPost, searchPostIndex) in searchPosts"
                                        :key="searchPostIndex"
                                        @click="togglePopupSearch"
                                    >
                                        <div class="flex-shrink-0 w-10 h-10 overflow-hidden">
                                            <div class="aspect-w-1 aspect-h-1">
                                                <JPicture
                                                    :src="
                                                        searchPost.image && searchPost.image.url
                                                            ? searchPost.image.url
                                                            : '/cover.jpg'
                                                    "
                                                    wrapperClass="picture-cover h-full"
                                                    :alt="
                                                        searchPost.image && searchPost.image.alt
                                                            ? searchPost.image.alt
                                                            : searchPost.title
                                                    "
                                                />
                                            </div>
                                        </div>
                                        <div
                                            class="text-gray-900 line-clamp-2 lg:group-hover:text-primary-500 lg:duration-150"
                                        >
                                            {{ searchPost.title }}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="container mb-4 xl:mt-14 md:mt-10 mt-7 xl:mb-8 md:mb-6" v-if="top_posts && top_posts.length > 0">
            <HeadlineBlog :item="{ title: category.title }" />

            <BlogHighlight :posts="top_posts" />
        </section>

        <section class="py-12" v-if="posts && posts.data && posts.data.length === 0 && $page.props.route.query.keyword">
            <div class="container">
                <div class="flex justify-center">
                    <img src="/assets/images/image-page.webp" alt="error image" />
                </div>
                <div class="flex flex-wrap justify-center mt-4 space-x-1 font-medium text-gray-900">
                    <span>{{ tt('Không tìm thấy kết quả cho từ khóa') }}</span
                    ><span>"{{ $page.props.route.query.keyword }}"</span>
                </div>
            </div>
        </section>

        <section v-if="posts && posts.data && posts.data.length" class="container xl:mb-[72px] md:mb-[50px] mb-[36px]">
            <div class="mb-4 border-b border-gray-200 xl:mb-8 md:mb-6"></div>
            <div class="grid grid-cols-11 xl:gap-x-8 md:gap-x-6 gap-x-4">
                <div class="md:col-span-8 col-span-full">
                    <div class="xl:space-y-3 md:space-y-2 space-y-1.5">
                        <JCardBlog
                            v-for="(post, index) in posts_data"
                            :key="index"
                            class="card-blog-md card-blog-row"
                            :item="post"
                            :language="$page.props.locale.current"
                        />
                    </div>
                    <div class="flex justify-center mt-3 xl:mt-6 md:mt-4" v-if="posts.current_page < posts.last_page">
                        <button @click="seeMore" class="btn xl:!px-[70px] md:!px-[49px] !px-[35px]">
                            {{ tt('Xem thêm') }}
                        </button>
                    </div>
                </div>
                <div class="md:col-span-3 max-md:hidden">
                    <JBannerAds class="md:sticky md:top-0" :item="banner" />
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import JamBreadcrumb from '@/Components/Jam/Breadcrumb.vue'
import axios from 'axios'

export default {
    components: { JamBreadcrumb },

    props: ['category', 'posts', 'top_posts', 'banner'],

    data() {
        return {
            bannerCategoryBlog: {
                url: '/assets/images/posts/banner.webp',
                alt: 'banner tin tuc',
            },
            posts_data: this.posts.data,
            isPending: false,

            breadcrumbs: [
                { title: this.tt('Tin tức'), link: this.route('posts') },
                {
                    title: this.category.title,
                },
            ],
            isLoading: false,
            showPopup: false,
            textSearch: this.$page.props.route.query.keyword || '',
            searchPosts: [],
            currentPageUrl: null,
        }
    },

    mounted() {
        const splitPath = this.$attrs.route.url.split('/')
        this.currentPageUrl = splitPath[splitPath.length - 1]
    },

    watch: {
        showPopup(newVal) {
            if (newVal) {
                document.body.addEventListener('click', this.togglePopupSearch)
            } else {
                document.body.removeEventListener('click', this.togglePopupSearch)
            }
        },
        textSearch(newVal) {
            if (newVal?.trim().length > 0) {
                this.getInstantSearch()
            } else {
                this.searchPosts = []
            }
        },
    },

    computed: {
        showPopupSearch() {
            return this.showPopup && this.searchPosts.length > 0
        },
    },

    methods: {
        togglePopupSearch() {
            this.showPopup = !this.showPopup
        },

        focusinSearch() {
            this.showPopup = true
        },

        async getInstantSearch() {
            if (this.isLoading) return
            this.isLoading = true
            const { data } = await axios.get(this.route('posts.instant_search', { keyword: this.textSearch }))
            this.searchPosts = data.data.posts
            this.isLoading = false
        },

        handleSearch() {
            const BASE_URL = this.route('posts.category', { slug: this.category.slug })
            if (this.textSearch.trim() === '') {
                this.$inertia.visit(BASE_URL, {
                    preserveScroll: true,
                })
            } else {
                this.showPopup = false
                this.$inertia.visit(BASE_URL, {
                    preserveScroll: true,
                    data: {
                        keyword: this.textSearch,
                    },
                })
            }
        },
        seeMore() {
            if (this.isPending) {
                return
            }
            this.isPending = true

            const self = this
            this.$inertia.visit(this.posts.next_page_url, {
                preserveScroll: true,
                preserveState: true,
                only: ['posts'],
                onFinish() {
                    self.posts_data.push(...self.posts.data)
                    self.isPending = false
                },
            })
        },
    },
}
</script>
