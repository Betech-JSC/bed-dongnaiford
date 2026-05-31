<template>
    <div class="space-y-3">
        <div class="body-2">{{ title }}</div>
        <div class="flex items-center gap-2">
            <div class="flex items-center max-md:justify-end">
                <div class="relative">
                    <div @click="copyLink()"
                        class="w-8 h-8 bg-[#F2F2F2] text-brand-100 rounded-full flex items-center justify-center duration-150 cursor-pointer lg:hover:bg-brand-100 lg:hover:text-[#F2F2F2]">
                        <Share />
                    </div>
                    <input id="input-copy" type="hidden" />
                    <div class="absolute lg:top-[110%] top-[120%] bg-primary-800 rounded-lg text-white duration-300 py-[4px] px-[12px] w-max lg:left-[40%] left-[-200%]"
                        :class="copySuccess ? 'opacity-100' : 'opacity-0'">
                        {{ tt('Đã copy link') }}
                    </div>
                </div>
            </div>
            <a :href="instagramUrl" target="_blank"
                class="w-8 h-8 bg-[#F2F2F2] text-brand-100 rounded-full flex items-center justify-center duration-150 cursor-pointer lg:hover:bg-brand-100 lg:hover:text-[#F2F2F2]">
                <LinkedIn />
            </a>
            <a :href="twitterUrl" target="_blank"
                class="w-8 h-8 bg-[#F2F2F2] text-brand-100 rounded-full flex items-center justify-center duration-150 cursor-pointer lg:hover:bg-brand-100 lg:hover:text-[#F2F2F2]">
                <Twitter />
            </a>
            <a :href="facebookUrl" target="_blank"
                class="w-8 h-8 bg-[#F2F2F2] text-brand-100 rounded-full flex items-center justify-center duration-150 cursor-pointer lg:hover:bg-brand-100 lg:hover:text-[#F2F2F2]">
                <Facebook />
            </a>
        </div>
    </div>
</template>

<script>
import Facebook from '@/Components/Icon/Facebook.vue'
import Twitter from '@/Components/Icon/Twitter.vue'
import LinkedIn from '@/Components/Icon/LinkedIn.vue'
import Share from '@/Components/Icon/Share.vue'

export default {
    components: { Facebook, Share, Twitter, LinkedIn },
    props: {
        title: {
            type: String,
            default: 'Share this article',
        },
    },
    data() {
        return {
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
