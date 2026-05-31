<template>
    <main>
        <BannerAbout :item="banner_about" />
        <section class="relative overflow-hidden py-12 md:py-14">
            <div class="container md:space-y-12 space-y-8 xl:space-y-16">
                <div
                    class="relative rounded-xl md:rounded-b-[20px] md:rounded-t-[56px] xl:rounded-b-[25px] xl:rounded-t-[75px] overflow-hidden max-w-[1152px] mx-auto">
                    <div class="absolute inset-0">
                            <JPicture src="/assets/images/about/bg-author.jpg" alt="background author"
                            wrapperClass="picture-cover" class="w-full h-full object-cover" />
                    </div>
                    <div class="relative pt-12 xl:pt-24">
                        <AnimatedAppear class="max-w-[400px] xl:max-w-[480px] w-full max-lg:mx-auto">
                            <div class="aspect-w-2 aspect-h-3">
                                <JPicture src="/assets/images/about/author.png" alt="author"
                                    wrapperClass="picture-cover" class="w-full h-full object-fit" />
                            </div>
                        </AnimatedAppear>
                        <div class="lg:absolute lg:top-1/2 lg:-translate-y-1/2 right-0">
                        <AnimatedAppear
                            animate="slideright"
                            class="bg-linear-author md:p-4 p-3 xl:p-6 lg:rounded-tl-[12px] lg:rounded-bl-[12px] md:space-y-4 space-y-2 xl:space-y-6 lg:max-w-[540px] xl:max-w-[660px] w-full">
                            <div class="space-y-2">
                                <h3 class="headline-3 font-bold" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ $page.props.locale.current === 'zh' ? 'Mr. Zhouyi (周一)' : tt('CHÂU NHẤT (Zhouyi)') }}</h3>
                                <div class="bg-linear-gold title-3 font-bold p-2 w-fit">
                                    {{ tt('Viện trưởng học viên - Nhà sáng lập LOTUS INSTITUTE') }}
                                </div>
                            </div>
                            <div class="body-1 md:space-y-3 space-y-2 xl:space-y-4 text-justify">
                                <p><span class="text-[#EB0004]">{{ tt('“Tại sao nhà đầu tư cá nhân thường thất bại?”') }}</span>{{ tt('. Đó là câu hỏi mà tôi Châu Nhất luôn trăn trở suốt hơn hai thập kỷ chinh chiến trên thị trường tôi gia dịch tài chính. Giao dịch không chiến lược, thiếu nền tảng, chạy theo phong trào - tôi đã chứng kiến quá nhiều người đánh đổi tiền bạc và thời gian cho những bài học sai cách. ') }}</p><p><span class="text-[#EB0004]">{{ tt('Với 25 năm giao dịch cá nhân') }}</span>{{ tt(', 15 năm quản lý tài sản quốc tế và 10 năm đào tạo nhà đầu tư, tôi không chỉ là người thực chiến, mà còn là người đồng hành phía sau thành công của nhiều trader tại châu Á.') }}</p>
                                <p>{{ tt('Tôi cũng là tác giả hệ thống') }} <span class="text-[#EB0004]">{{ tt('“Hệ thống lọc cộng hưởng đa chỉ báo FT-17"') }}</span> {{ tt('và') }} <span class="text-[#EB0004]">{{ tt('"Phương thức giao dịch lướt sóng"') }}</span> {{ tt('được thị trường đánh giá cao về tính kỷ luật và hiệu quả. Nhưng sau tất cả, tôi nhận ra: một hệ thống tốt là chưa đủ - nhà đầu tư cần một môi trường rèn luyện thực tế.') }}</p><p>{{ tt('Lotus Institute ra đời từ chính niềm tin ấy. Đào tạo tài chính phải đi từ thực chiến. Không lý thuyết suông, không giáo trình khô khan. Học viên được dẫn dắt để hiểu thị trường, làm chủ chiến lược và tự tin giao dịch với hệ thống đã được kiểm chứng qua thời gian.') }}</p>
                            </div>
                        </AnimatedAppear>
                        </div>
                    </div>
                </div>
                <SliderActivity :items="[...activities, ...activities]" />
            </div>
        </section>
        <section class="bg-gray-50 md:py-16 py-12 xl:py-20">
            <div class="container space-y-6 md:space-y-8 xl:space-y-12">
                <AnimatedAppear class="space-y-6 flex flex-col justify-center items-center text-center">
                    <h2 class="display-3 font-bold uppercase">{{ tt('Con đường thành công trong giao dịch') }}</h2>
                    <div class="max-w-[880px] w-full body-1">
                        {{ tt('Lotus Institute cam kết đào tạo thế hệ nhà đầu tư chuyên nghiệp, kết hợp nền tảng học thuật vững chắc với kỹ năng và thực chiến.Chúng tôi hướng tới việc mang lại kết quả đầu tư dài hạn vượt trội, đồng thời trở thành đối tác tin cậy của các nhà đầu tư trong nước và quốc tế khi tham gia đầu tư vào thị trường Việt Nam.') }}
                    </div>
                </AnimatedAppear>
                <div class="bg-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-[1px]">
                    <AnimatedAppear v-for="(itemValue, indexValue) in values" :key="indexValue" :delay="indexValue * 100"
                        class="py-8 md:px-0 px-2 xl:px-6 bg-gray-50 relative group">
                        <div
                            class="absolute inset-0 bg-linear-value lg:group-hover:opacity-100 opacity-0 duration-300 ease-in-out">
                        </div>
                        <div class="relative space-y-1.5 text-center">
                            <div class="display-3 font-bold" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ itemValue.title }}</div>
                            <div class="body-1" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ itemValue.description }}</div>
                        </div>
                    </AnimatedAppear>
                </div>
            </div>
        </section>
        <section class="bg-gray-50 md:py-16 py-12 xl:py-20">
            <div class="container md:space-y-12 space-y-6 xl:space-y-16">
                <AnimatedAppear class="space-y-9">
                    <h2 class="display-2 font-bold">{{ tt('Đội ngũ') }}</h2>
                    <h2 class="display-2 font-bold bg-linear-team px-3 py-2 text-white w-fit">{{ tt('Chuyên viên') }}
                    </h2>
                </AnimatedAppear>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:gap-5 gap-3 xl:gap-12">
                    <AnimatedAppear v-for="(itemTeam, indexTeam) in teams" :key="indexTeam" :delay="indexTeam * 100">
                        <CardTeam :item="itemTeam" />
                    </AnimatedAppear>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import SliderActivity from '@/Components/SliderActivity.vue';
import CardTeam from '@/Components/Card/CardTeam.vue';
import BannerAbout from '@/Components/BannerAbout.vue';

export default {
    props: ['teams', 'banner_about', 'activities'],
    components: { SliderActivity, CardTeam, BannerAbout },
    data() {
        return {
            values: [
                {
                    title: this.$page.props.locale.current === 'zh' ? '~500亿美元' : this.tt("~$50 billion"),
                    description: this.$page.props.locale.current === 'zh' ? '学员累计交易规模' : this.tt("Tổng giá trị giao dịch học viên")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '99.2%' : this.tt("99.2%"),
                    description: this.$page.props.locale.current === 'zh' ? '交易盈利率' : this.tt("Giao dịch đạt lợi nhuận")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '~500人' : this.tt("~500"),
                    description: this.$page.props.locale.current === 'zh' ? '参与专家指导课程' : this.tt("Tham gia chương trình học thuật với chuyên gia tài chính")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '100%' : this.tt("100%"),
                    description: this.$page.props.locale.current === 'zh' ? '对接国际市场体系' : this.tt("LIên kết giáo trình quốc tế trong thị trường thế giới")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '2025' : this.tt("2025"),
                    description: this.$page.props.locale.current === 'zh' ? '正式拓展越南市场' : this.tt("Chính thức phát triển tại Việt nam")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '2,200+' : this.tt("2,200+"),
                    description: this.$page.props.locale.current === 'zh' ? '学员学习目标达成' : this.tt("Có mục tiêu chinh phục các khóa học")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '24/7' : this.tt("24/7"),
                    description: this.$page.props.locale.current === 'zh' ? '全天候市场资讯支持' : this.tt("Hỗ trợ cập nhật tin tức liên tục cho học viên")
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '10,000+' : this.tt("10,000+"),
                    description: this.$page.props.locale.current === 'zh' ? '交易分析信号输出' : this.tt("Lệnh giao dịch được phân tích")
                },
            ],
        }
    },
    mounted() {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.numbers.forEach((item, index) => {
                            const number = parseInt(item.title.replace('+', ''))
                            this.animateCounter(index, number)
                        })
                        observer.unobserve(entry.target) // Only trigger once
                    }
                })
            },
            { threshold: 0.6 }
        )

        if (this.$refs.numberSection) {
            observer.observe(this.$refs.numberSection)
        }
    },
    methods: {
        animateCounter(index, endValue) {
            const duration = 1500
            const start = 0
            const startTime = performance.now()

            const update = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1)
                const currentValue = Math.floor(progress * endValue)

                this.numbers[index].count = currentValue

                if (progress < 1) {
                    requestAnimationFrame(update)
                }
            }

            requestAnimationFrame(update)
        },
    },
}
</script>
<style lang="scss" scoped>
.shadow-style {
    box-shadow: 0px 2px 12px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
}

.bg-linear-author {
    background: linear-gradient(90deg, #FFFFFF 0%, #FFF5CD 100%);
}

.bg-linear-gold {
    background: linear-gradient(90.03deg, #FFC13B -1.21%, #FBE56A 52.3%, #CE9300 99.98%);
}

.bg-linear-value {
    background: linear-gradient(114.93deg, #FFF1C7 0%, rgba(255, 195, 16, 0.8) 100%);
}

.bg-linear-team {
    background: linear-gradient(90deg, #FFC310 0%, #161204 100%);
}
</style>
