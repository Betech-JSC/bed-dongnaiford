<template>
    <footer class="relative bg-black">
        <div class="text-white xl:pt-[60px] md:py-[56px] py-12 xl:pb-[84px]">
            <div class="container">
                <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
                    <div class="col-span-full xl:col-span-5 md:space-y-12 space-y-8 xl:space-y-16">
                        <Logo className="max-w-[445px] max-h-[103px]" />
                        <div class="space-y-4">
                            <div class="title-2 font-bold uppercase" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">
                                {{ $page.props.locale.current === 'zh' ? '莲花资本学院有限公司 LOTUS CAPITAL INSTITUTE' : tt('CÔNG TY TNHH LOTUS CAPITAL INSTITUTE') }}
                            </div>
                            <div class="body-2 text-justify" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">
                                {{ $page.props.locale.current === 'zh' ? '我们致力于金融交易培训领域，专注于提供市场分析、资金管理及交易策略等专业课程，帮助投资者提升实战能力，掌握市场机会，实现长期稳健发展。' : tt('Tiên phong trong hoạt động trong lĩnh vực đào tạo  giao dịch tài chính. Công ty tập trung cung cấp các chương trình đào tạo ngắn hạn về phân tích thị trường, quản lý vốn và kỹ năng giao dịch, hướng tới nâng cao năng lực cho cộng đồng nhà đầu tư.') }}
                            </div>
                            <div class="body-2 space-y-3">
                                <div v-for="(itemInfo, indexInfo) in infos" :key="indexInfo">
                                    <span v-if="itemInfo.title" class="mr-1" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ itemInfo.title }}</span>
                                    <span class="text-white lg:hover:text-primary duration-300 ease-in-out">
                                        <a
                                            :href="itemInfo.href"
                                            :target="itemInfo.target"
                                            rel="noopener noreferrer nofollow"
                                            :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''"
                                        >
                                            {{ itemInfo.content }}
                                        </a>
                                    </span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="label-2" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ $page.props.locale.current === 'zh' ? '联系我们' : tt('Kết nối với chúng tôi') }}</div>
                                    <div class="flex items-center gap-3">
                                        <a
                                            v-for="(itemSocial, indexSocial) in socials"
                                            :key="indexSocial"
                                            :href="itemSocial.link"
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                        >
                                            <JPicture
                                                :src="itemSocial.icon"
                                                :alt="itemSocial.alt"
                                                class="w-full h-full object-cover"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-full xl:col-span-6 xl:col-start-7">
                        <div class="grid md:grid-cols-3 md:gap-6 gap-4 xl:gap-8">
                            <div v-for="(itemMenu, indexMenu) in menus" :key="indexMenu" class="md:space-y-4 space-y-3 xl:space-y-6">
                                <h3 class="title-3 font-bold" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">{{ itemMenu.title }}</h3>
                                <div v-if="itemMenu.items && itemMenu.items.length > 0" class="md:space-y-3 space-y-2 xl:space-y-6 body-1">
                                    <template v-for="(itemSubMenu, indexSubMenu) in itemMenu.items" :key="indexSubMenu">
                                        <Link
                                        v-if="itemSubMenu.slug"
                                        :href="itemSubMenu.slug"
                                        class="block lg:hover:text-primary duration-300 ease-in-out"
                                        :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''"
                                    >
                                        {{ itemSubMenu.title }}
                                    </Link>
                                    <a v-else :href="itemSubMenu.link" target="_blank" rel="noopener noreferrer nofollow" class="block lg:hover:text-primary duration-300 ease-in-out" :class="$page.props.locale.current === 'zh' ? 'notranslate' : ''">
                                        {{ itemSubMenu.title }}
                                    </a>
                                    </template>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-copyright py-3">
            <div class="container">
                <div class="flex md:flex-row flex-col items-center justify-between gap-4 md:gap-0 text-black body-2">
                    <div>{{ tt('©2024 Công ty TNHH Lotus Capital Institute. GCNĐKDN số 0318785705, cấp ngày 18/12/2024 bởi Phòng ĐKKD - Sở Tài chính TP.HCM.') }}</div>
                    <div class="flex items-center gap-3 body-2">
                        <div
                            v-for="(itemPolicy, indexPolicy) in policies"
                            :key="indexPolicy"
                            class="lg:hover:text-primary-900 duration-300 ease-in-out"
                        >
                            <Link :href="route('policies.index')">
                                {{ itemPolicy.title }}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
import Facebook from './Icons/Facebook.vue'
import Instagram from './Icons/Instagram.vue'

export default {
    components: { Facebook, Instagram },
    data() {
        return {
            infos: [
                {
                    title: '',
                    content: this.$page.props.locale.current === 'zh' ? '越南胡志明市嘉定郡 Nguyễn Cửu Vân街 84A号' : this.tt('84a Nguyễn Cửu Vân, Phường Gia Định, TP. Hồ Chí Minh'),
                    href: this.tt('https://maps.app.goo.gl/prKvgwcJP63XhRmN9'),
                    target: '_blank',
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '电话:' : this.tt('Điện thoại:'),
                    content: this.$page.props.global.general_phone,
                    href: `tel:${this.$page.props.global.general_phone}`,
                    target: '_self',
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '邮箱:' : 'Email:',
                    content: this.$page.props.global.general_email,
                    href: `mailto:${this.$page.props.global.general_email}`,
                    target: '_self',
                },
            ],
            socials: [
                {
                    link: this.$page.props.global.general_fb_link ?? '',
                    icon: '/assets/svg/social/facebook.svg',
                    alt: 'fb icon',
                },
                {
                    link: this.$page.props.global.general_instagram_link ?? '',
                    icon: '/assets/svg/social/instagram.svg',
                    alt: 'instagram icon',
                },
            ],
            menus: [
                {
                    title: this.$page.props.locale.current === 'zh' ? '莲花学院' : this.tt('Lotus Institute'),
                    items: [
                        {
                            title: this.$page.props.locale.current === 'zh' ? '关于我们' : this.tt('Về Lotus Institute'),
                            slug: this.route('histories.index'),
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? '课程' : this.$page.props.data.lotus_categories?.find(c => c.translations?.some(t => t.slug === 'khoa-hoc'))?.title || this.tt('Khóa học'),
                            slug: this.route('products.categories', { slug: this.$page.props.data.lotus_categories?.find(c => c.translations?.some(t => t.slug === 'khoa-hoc'))?.slug || 'khoa-hoc' }),
                        },  
                        {
                            title: this.$page.props.locale.current === 'zh' ? '产品' : this.tt('Sản phẩm'),
                            slug: this.route('products.index'),
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? '投资市场' : this.tt('Thị trường đầu tư'),
                            slug: this.route('posts'),
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? '联系我们' : this.tt('Liên hệ'),
                            slug: this.route('contact'),
                        },
                    ],
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '学员支持' : this.tt('Hỗ trợ học viên'),
                    items: [
                        {
                            title: this.$page.props.locale.current === 'zh' ? '政策' : this.tt('Chính sách'),
                            slug: this.route('policies.index'),
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? '学员权益' : this.tt('Lợi ích học viên'),
                            slug: this.route('products.index'),
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? 'Zalo社群' : this.tt('Cộng đồng Zalo'),
                            link: this.$page.props.global.general_zalo_link,
                        },
                        {
                            title: this.$page.props.locale.current === 'zh' ? 'Facebook社群' : this.tt('Cộng đồng Facebook'),
                            link: this.$page.props.global.general_fb_link,
                        },
                    ],
                },
                // {
                //     title: this.$page.props.locale.current === 'zh' ? '投资市场' : this.tt('Thị trường đầu tư'),
                //     items: [
                //         {
                //             title: this.$page.props.locale.current === 'zh' ? '政策' : this.tt('Chính sách'),
                //             slug: this.route('policies.index'),
                //         },
                //         {
                //             title: this.$page.props.locale.current === 'zh' ? '学员权益' : this.tt('Lợi ích học viên'),
                //             slug: this.route('products.index'),
                //         },
                //         {
                //             title: this.$page.props.locale.current === 'zh' ? 'Zalo社群' : this.tt('Cộng đồng Zalo'),
                //             link: this.$page.props.global.general_zalo_link,
                //         },
                //         {
                //             title: this.$page.props.locale.current === 'zh' ? 'Facebook社群' : this.tt('Cộng đồng Facebook'),
                //             link: this.$page.props.global.general_fb_link,
                //         },
                //     ],
                // },
            ],
            currentYear: '',
        }
    },
    computed: {
        categories() {
            return this.$page.props.data.footer_categories || []
        },
        products() {
            return this.$page.props.data.footer_products || []
        },
        policies() {
            return this.$page.props.data.policies || [
                {
                    title: "Điều khoản sử dụng",
                    slug: this.route('policies.index'),
                },
                {
                    title: "Chính sách bảo mật",
                    slug: this.route('policies.index'),
                },
            ]
        },
        global() {
            return this.$page.props.data.global
        },
    },
    created: function () {
        this.currentYear = new Date().getFullYear()
    },
}
</script>
<style lang="scss" scoped>
.bg-copyright {
    background: linear-gradient(90.03deg, #ffc13b -1.21%, #fbe56a 52.3%, #ce9300 99.98%);
}
</style>
