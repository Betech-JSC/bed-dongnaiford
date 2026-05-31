<template>
    <main class="bg-primary-25">
        <BannerIcon :banner="banner" />
        <section class="py-12">
            <div class="container">
                <div class="max-w-[800px] w-full mx-auto space-y-8">
                    <div class="prose prose-blog notranslate" v-html="service.content"></div>

                    <div class="border-t border-gray-200 pt-6">
                        <div class="flex items-center justify-end space-x-[16px]">
                            <div class="flex items-center max-md:justify-end">
                                <div class="relative">
                                    <div
                                        @click="copyLink()"
                                        class="text-gray-300 duration-150 cursor-pointer hover:text-green-500"
                                    >
                                        <Share />
                                    </div>
                                    <input id="input-copy" type="hidden" />
                                    <div
                                        class="absolute lg:top-[110%] top-[120%] bg-primary-800 rounded-lg text-white duration-300 py-[4px] px-[12px] w-max lg:left-[40%] left-[-200%]"
                                        :class="copySuccess ? 'opacity-100' : 'opacity-0'"
                                    >
                                        {{ tt('Đã copy link') }}
                                    </div>
                                </div>
                            </div>
                            <a :href="twitterUrl" target="_blank" class="inline-block">
                                <Twitter />
                            </a>
                            <a :href="facebookUrl" target="_blank" class="inline-block">
                                <Facebook />
                            </a>
                            <a :href="instagramUrl" target="_blank" class="inline-block">
                                <LinkedIn />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <SectionContact class="max-md:pb-12" />
    </main>
</template>

<script>
import Facebook from '@/Components/Icon/Facebook.vue'
import Twitter from '@/Components/Icon/Twitter.vue'
import LinkedIn from '@/Components/Icon/LinkedIn.vue'
import Share from '@/Components/Icon/Share.vue'
export default {
    components: { Facebook, Share, Twitter, LinkedIn },
    props: ['service'],
    data() {
        return {
            banner: {
                title: this.service.title,
                image: '/assets/images/home/bg-story.webp',
                breadcrumbs: [
                    {
                        title: this.tt('Dịch vụ'),
                    },
                ],
            },

            facebookUrl: null,
            copySuccess: false,
        }
    },
    mounted() {
        this.facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
        this.instagramUrl = `http://twitter.com/share?text=${window.location.href}`
        this.twitterUrl = `http://twitter.com/share?text=${window.location.href}`
        const isScreenPC = window.matchMedia('(min-width: 768px)').matches
        if (isScreenPC) {
            this.isShowTOC = true
        } else {
            this.isShowTOC = false
        }
    },
    methods: {
        copyLink() {
            const input = document.querySelector('#input-copy')
            input.value = window.location.href
            input.setAttribute('type', 'text')
            input.select()
            input.setSelectionRange(0, 99999)
            document.execCommand('copy')
            input.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
            this.copySuccess = true
            setTimeout(() => {
                this.copySuccess = false
            }, 1000)
        },
    },
}
</script>

<style></style>
