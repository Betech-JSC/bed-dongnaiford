<template>
    <div>
        <Header />
        <slot />
        <Footer />
        <JamBackToTop />
        <PopupCartSuccess :open="isShowPopup" />
        <CourseRegistrationNotification />
        <SocialFixed />
    </div>
</template>
<script>
import { useAppStore } from '@/stores/index'

export default {
    data() {
        return {
            isShowPopup: false,
        }
    },
    watch: {
        '$page.url': function (newUrl, oldUrl) {
            const seo = this.$page.props?.seo
            const global = this.$page.props?.global

            let seo_meta_title = seo?.seo_meta_title ?? global?.seo_meta_title ?? 'Lotus Institute'
            let seo_meta_description = seo?.seo_meta_description ?? global?.seo_meta_description ?? 'Lotus Institute'
            let seo_meta_robots = seo?.seo_meta_robots ?? global?.seo_meta_robots ?? 'robots.txt'
            let seo_meta_keywords = seo?.seo_meta_keywords ?? global?.seo_meta_keywords ?? 'Lotus Institute'
            let seo_image = seo?.seo_image ?? global?.seo_image ?? '/cover.jpg'

            document.querySelector('title').innerHTML = seo_meta_title
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo_meta_title)
            document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo_meta_title)

            document.querySelector('meta[name="description"]')?.setAttribute('content', seo_meta_description)
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo_meta_description)
            document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo_meta_description)

            document.querySelector('meta[name="robots"]')?.setAttribute('content', seo_meta_robots)

            document.querySelector('meta[name="keywords"]')?.setAttribute('content', seo_meta_keywords)

            document
                .querySelector('meta[property="og:image"]')
                ?.setAttribute('content', `${window.location.href}${seo_image}`)

            document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href)
            document.querySelector('link[rel="canonical"]')?.setAttribute('href', window.location.href)
        },
    },
    computed: {
        appStore() {
            return useAppStore()
        },
    },
    mounted() {
        this.setVh()
        window.addEventListener('resize', this.setVh)
        this.$bus.on('popup-cart-success', () => {
            if (this.isShowPopup) return

            this.isShowPopup = true
            var timeoutID = setTimeout(() => {
                this.isShowPopup = false
                clearTimeout(timeoutID)
            }, 5000)
        })
    },
    created() {
        this.appStore.fetchCart()
    },
}
</script>

<style>
.cursor-follow-enter-active,
.cursor-follow-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.cursor-follow-enter {
    transform: scale(0.5) translateY(-20px);
    opacity: 0;
}

.cursor-follow-leave-to {
    transform: scale(0.5) translateY(20px);
    opacity: 0;
}
</style>