<template>
    <main>
        <SectionHeroSlider :items="banner_hero" />
        <SectionValue :values="values" />
        <section class="py-14">
            <div class="container">
                <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-[120px]">
                    <div class="flex items-center justify-center">
                        <AnimatedAppear>
                            <h2 class="headline-1 font-bold text-gray-900">{{ introduce_block?.title ?? tt('Tại Lotus Institute') }}</h2>
                            <div class="body-1 text-gray-700 mt-4 mb-4 md:mb-6 xl:mb-8">
                                {{ introduce_block?.description ?? tt('Chúng tôi tin rằng tri thức là nền tảng cho sự phát triển bền vững. Chúng tôi tự hào đồng hành cùng cộng đồng đầu tư Việt trên hành trình nâng cao năng lực và kiến tạo giá trị dài lâu.') }}
                            </div>
                            <Link :href="route('histories.index')" class="btn btn-secondary">{{ tt('Về chúng tôi') }}
                            </Link>
                        </AnimatedAppear>
                    </div>
                    <AnimatedAppear :delay="500" class="relative overflow-hidden rounded-[12px] aspect-w-6 aspect-h-5">
                        <video
                            ref="introduceVideo"
                            v-observe-visibility="{ callback: visibilityChanged, throttle: 300 }"
                            :src="introduce_block?.video_url ?? '/assets/video/tvc-lotus-institute.mp4'"
                            class="w-full h-full object-cover"
                            poster="/assets/poster.jpg"
                            loop
                            playsinline
                            webkit-playsinline
                            controls
                        ></video>
                    </AnimatedAppear>
                </div>
            </div>
        </section>
        <section v-if="banner_advise">
            <div class="aspect-w-13 aspect-h-5 overflow-hidden">
                <video
                    v-if="banner_advise?.video_url"
                    :src="banner_advise.video_url"
                    class="w-full h-full object-cover"
                    autoplay
                    loop
                    muted
                    playsinline
                    webkit-playsinline
                ></video>
                <JPicture v-else :src="banner_advise?.image_url" :alt="banner_advise?.title" wrapperClass="picture-cover"
                    class="w-full h-full object-cover" />
            </div>
        </section>
        <section class="md:py-16 py-12 xl:py-20">
            <div class="container flex flex-col items-center justify-center">
                <h2 class="display-2 font-bold text-center uppercase">{{ tt('Chuẩn hóa chất lượng giao dịch') }}</h2>
                <div class="relative md:mt-12 mt-8 xl:mt-16 md:mb-8 mb-6 xl:mb-10 w-full">
                    <div class="grid md:grid-cols-10 gap-3">
                        <AnimatedAppear :delay="700" class="md:col-span-3 md:flex md:items-end md:justify-end">
                            <CardCourse :item="courses[2]" class="!h-auto w-full" />
                        </AnimatedAppear>
                        <AnimatedAppear :delay="100" class="md:col-span-4">
                            <CardCourse :item="courses[0]" class="!h-auto w-full" />
                        </AnimatedAppear>
                       <AnimatedAppear :delay="700" class="md:col-span-3 md:flex md:items-end md:justify-end">
                            <CardCourse :item="courses[1]" class="!h-auto w-full" />
                        </AnimatedAppear>
                    </div>
                </div>
                <Link :href="route('products.index')" class="btn btn-secondary">{{ tt('Khám phá thêm') }}</Link>
            </div>
        </section>
        <SliderCertificate :items="[...certificates,...certificates]" />
        <SectionRelatedPosts v-if="posts && posts.length > 0" :title="tt('Tin tức nổi bật')" :items="posts" customClass="md:py-16 py-12 xl:py-20"/>
        <SectionRating :items="[...reviews, ...reviews]" :sponsors="sponsors" />
    </main>
</template>
<script>
import SectionHeroSlider from '@/Components/SectionHeroSlider.vue'

import CardCourse from '@/Components/Card/CardCourse.vue';
import SliderCertificate from '@/Components/SliderCertificate.vue';
import SectionRating from '@/Components/SectionRating.vue';
import SectionValue from '@/Components/SectionValue.vue';
import SectionRelatedPosts from '@/Components/SectionRelatedPosts.vue';

export default {
    components: { SectionHeroSlider, CardCourse, SliderCertificate, SectionRating, SectionValue, SectionRelatedPosts },
    props: ['courses', 'reviews', 'sponsors', 'banner_hero', 'banner_edu', 'banner_advise', 'certificates', 'posts', 'introduce_block'],
    data() {
        return {
            values: [
                {
                    symbolHead: this.$page.props.locale.current === 'zh' ? "~" : "~$",
                    number: this.$page.props.locale.current === 'zh' ? 50 : 500,
                    symbolTail: this.$page.props.locale.current === 'zh' ? "亿美元" : "billion",
                    title: this.$page.props.locale.current === 'zh' ? '盈利交易成功率' : this.tt('Xác xuất giao dịch chuẩn lợi nhuận')
                },
                {
                    symbolHead: this.$page.props.locale.current === 'zh' ? "~" : "~$",
                    number: 10000,
                    symbolTail: this.$page.props.locale.current === 'zh' ? "美元" : "",
                    title: this.$page.props.locale.current === 'zh' ? '交易员奖励金' : this.tt('Tiền thưởng trao tặng trader Lotus Institute')
                },
                {
                    symbolHead: "~",
                    number: 500,
                    symbolTail: this.$page.props.locale.current === 'zh' ? "人" : "",
                    title: this.$page.props.locale.current === 'zh' ? '参与专家培训' : this.tt('Tham gia chương trình học với chuyên gia')
                },
                {
                    symbolHead: "+",
                    number: 25,
                    symbolTail: this.$page.props.locale.current === 'zh' ? "%" : "%/năm",
                    title: this.$page.props.locale.current === 'zh' ? '年均收益率' : this.tt('ROI trung bình')
                },
            ],
        }
    },
    methods: {
        visibilityChanged(isVisible) {
            const video = this.$refs.introduceVideo;
            if (video) {
                if (isVisible) {
                    video.play().catch(() => {
                        // Silent fail if blocked by browser
                    });
                } else {
                    video.pause();
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.bg-linear-white {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 60%, #ffffff 100%, #ffffff 100%, #ffffff 100%);
}
</style>
