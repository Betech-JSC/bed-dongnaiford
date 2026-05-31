<template>
    <main class="notranslate">
        <section class="bg-gray-100 pt-10 md:pb-16 pb-12 xl:pb-20">
            <div class="container">
                <div class="grid grid-cols-12 md:gap-x-8 xl:gap-x-10 max-lg:gap-y-4 max-md:gap-y-2">
                    <!-- Mobile -->
                    <div v-if="resolvedListSidebar.length" class="col-span-full lg:hidden">
                        <div @click="togglePolicyMobile"
                            class="relative overflow-hidden bg-white shadow-xs cursor-pointer">
                            <div
                                class="w-full relative py-[10px] px-[12px] md:px-[16px] flex items-center space-x-[8px] border-l-[5px] overflow-hidden text-grey-700 label-1 font-medium border-primary-600 notranslate">
                                {{ resolvedContent.title }}
                            </div>
                            <div
                                class="absolute top-0 right-[12px] md:right-[16px] flex items-center justify-center h-full">
                                <div class="scale-150 -rotate-90 opacity-50" :class="{ '!rotate-90': isOpenMobile }">
                                    <IconCaretDown />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Desktop  -->
                    <div v-if="isOpenMobile" class="fixed inset-0 duration-200 bg-black lg:hidden opacity-70"
                        :class="isOpenMobile && 'z-[80]'" @click="togglePolicyMobile"></div>

                    <div v-if="resolvedListSidebar.length"
                        class="relative col-span-3 max-lg:fixed max-lg:h-screen max-lg:top-[60px] max-lg:left-0 max-lg:duration-200 max-lg:w-1/2 max-md:w-3/4 max-lg:bg-white max-lg:p-2"
                        :class="[
                            isOpenMobile ? '' : 'max-lg:transform max-lg:translate-x-[-100%]',
                            isOpenMobile ? 'z-[80]' : '',
                        ]">
                        <div
                            class="md:sticky md:top-[88px] xl:space-y-[12px] md:space-y-[8px] space-y-[6px] font-medium rounded-xl py-6 bg-white">
                            <Link :href="route('policies.show', policy.slug)"
                                v-for="(policy, index) in resolvedListSidebar" :key="index"
                                class="label-1 font-medium py-0.5 px-2 flex items-center text-gray-500 lg:hover:border-primary-600 border-l-[3px] border-transparent policy-item duration-300 ease-in-out notranslate"
                                :class="{
                                    'active-tab-policy': checkActive(policy.slug),
                                }">
                            {{ policy.title }}
                            </Link>
                        </div>
                    </div>

                    <div v-if="resolvedContent" class="col-span-full lg:col-span-9 space-y-[1rem]">
                        <div class="bg-white rounded-xl space-y-3 md:p-5 p-3 xl:p-6">
                            <h1 class="title-1 text-gray-900 font-bold capitalize notranslate">
                                {{ resolvedContent.title }}
                            </h1>
                            <div v-html="resolvedContent.content" class="prose prose-policy notranslate" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
export default {
    props: ['list_sidebar', 'content'],
    data() {
        return {
            isOpenMobile: false,
            /** Dùng khi không có dữ liệu từ server (preview / dev). Cùng cấu trúc transform() backend. */
            demoListSidebar: [],
        }
    },

    computed: {
        resolvedListSidebar() {
            if (this.list_sidebar && this.list_sidebar.length) {
                return this.list_sidebar
            }
            return this.demoListSidebar
        },
        resolvedContent() {
            if (this.content) {
                return this.content
            }
            const slug = this.$page.url.split('/').filter(Boolean).pop()
            const match = this.demoListSidebar.find((p) => p.slug === slug)
            return match || this.demoListSidebar[0]
        },
    },

    methods: {
        togglePolicyMobile() {
            this.isOpenMobile = !this.isOpenMobile
        },

        checkActive(url) {
            const fullPath = this.$page.url
            const arrPath = fullPath.split('/')
            this.currentPolicy = this.resolvedListSidebar.find((x) => x.slug === arrPath[arrPath.length - 1])
            return url == arrPath[arrPath.length - 1]
        },
    },
}
</script>

<style lang="scss">
.active-tab-policy {
    @apply text-gray-900 border-primary-600;
}
</style>
