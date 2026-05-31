<template>
    <section class="xl:py-[70px] md:py-[49px] py-[35px] bg-img" id="auto-count">
        <div class="container">
            <div class="grid grid-cols-2 lg:grid-cols-3 max-md:gap-y-4">
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter0`"
                            :startAmount="aboutList[0].start"
                            :endAmount="aboutList[0].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[0].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[0].title"></div>
                </div>
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter1`"
                            :startAmount="aboutList[1].start"
                            :endAmount="aboutList[1].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[1].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[1].title"></div>
                </div>
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter2`"
                            :startAmount="aboutList[2].start"
                            :endAmount="aboutList[2].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[2].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[2].title"></div>
                </div>
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter3`"
                            :startAmount="aboutList[3].start"
                            :endAmount="aboutList[3].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[3].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[3].title"></div>
                </div>
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter4`"
                            :startAmount="aboutList[4].start"
                            :endAmount="aboutList[4].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[4].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[4].title"></div>
                </div>
                <div class="xl:py-3 md:py-2 py-1.5 xl:px-6 md:px-[17px] px-3" ref="counterWrapper">
                    <div
                        class="text-white font-semibold xl:mb-4 md:mb-2 mb-1.5 lg:tracking-[-0.02em] xl:text-[52px] md:text-[2.5rem] text-[1.75rem] leading-[140%]"
                    >
                        <vue3-autocounter
                            :ref="`counter5`"
                            :startAmount="aboutList[5].start"
                            :endAmount="aboutList[5].number * 1"
                            :duration="3"
                            separator="."
                            :suffix="aboutList[5].suffix"
                            decimalSeparator=""
                            :autoinit="true"
                        />
                    </div>

                    <div class="text-white title-3" v-html="aboutList[5].title"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import Vue3Autocounter from 'vue3-autocounter'
export default {
    components: { Vue3Autocounter },
    data() {
        return {
            aboutList: [
                {
                    title: this.tt('Địa điểm kinh doanh'),
                    number: this.tt('21'),
                    start: 0,
                    suffix: '',
                },
                {
                    title: this.tt('Năm hoạt động tại <br class="md:hidden"/> Việt Nam'),
                    number: this.tt('26'),
                    start: 0,
                    suffix: '',
                },
                {
                    title: this.tt('Năm kinh nghiệm tại <br class="md:hidden"/> Nhật Bản'),
                    number: this.tt('140'),
                    start: 0,
                    suffix: '',
                },
                {
                    title: this.tt('Diện tích kho bãi'),
                    number: this.tt('62500'),
                    start: 31250,
                    suffix: ' m²',
                },
                {
                    title: this.tt('Đối tác vận tải <br class="md:hidden"/> toàn cầu'),
                    number: this.tt('20000'),
                    start: 10000,
                    suffix: '',
                },
                {
                    title: this.tt('Nhân viên'),
                    number: this.tt('650'),
                    start: 325,
                    suffix: '',
                },
            ],
            isPending: false,
        }
    },
    mounted() {
        window.addEventListener('scroll', this.scrollAutoCount)
    },
    unmounted() {
        window.removeEventListener('scroll', this.scrollAutoCount)
    },
    methods: {
        scrollAutoCount() {
            const section = document.getElementById('auto-count').scrollHeight
            const map = document.getElementById('section-map').scrollHeight
            const reason = document.getElementById('section-reason').scrollHeight
            const service = document.getElementById('section-service').scrollHeight
            const post = document.getElementById('section-post').scrollHeight
            const footer = document.getElementById('footer-section').scrollHeight
            if (
                window.innerHeight + window.scrollY >=
                document.body.scrollHeight - section - map - reason - service - post - footer
            ) {
                if (this.isPending) {
                    return
                }
                this.isPending = true
                this.$refs.counter0.start()
                this.$refs.counter1.start()
                this.$refs.counter2.start()
                this.$refs.counter3.start()
                this.$refs.counter4.start()
                this.$refs.counter5.start()
            }
        },
    },
}
</script>
