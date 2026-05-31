<template>
    <div class="md:w-[48px] w-[40px] md:h-[48px] h-[40px] overflow-hidden cursor-pointer rounded-full bg-primary lg:hover:bg-brand-300 ease-in-out duration-300 fixed xl:bottom-[50px] bottom-5 xl:right-[26px] md:right-4 right-2 z-[100] text-center flex flex-col items-center justify-center text-white"
        :class="isShowBtn ? 'translate-y-0' : 'translate-y-[200px]'" @click="scrollToTop">
        <IconArrowUp class="text-white -rotate-90" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            isShowBtn: false,
        }
    },
    mounted() {
        const self = this
        window.addEventListener('scroll', function () {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 500) {
                self.isShowBtn = true
            } else {
                self.isShowBtn = false
            }
        })
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        },
    },
}
</script>
