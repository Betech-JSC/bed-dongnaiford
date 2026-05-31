<template>
    <main>
        <section>
            <div class="container pt-6 pb-8">
                <div class="space-y-[12px]">
                    <h1 class="text-gray-900 text-[24px]">
                        kết quả cho
                        <span class="headline_3">“{{ keyword }}”</span>
                    </h1>
                    <JBreadcrumb :items="breadcrumbs" />
                </div>
            </div>
        </section>
        <section v-if="isLoadingInit" class="xl:pt-[26px] md:pt-[18px] pt-[13px] xl:pb-[48px] md:pb-[34px] pb-[24px]">
            <div class="container xl:space-y-[50px] md:space-y-[35px] space-y-[25px]">
                <div
                    class="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-3 md:gap-y-4 xl:gap-y-6 xl:mt-[14px] md:mt-[10px] mt-[7px]"
                >
                    <div v-for="(_, index) in 10" :key="index" class="p-4 bg-white rounded">
                        <div class="bg-gray-100 rounded aspect-w-1 aspect-h-1"></div>
                        <div class="h-8 mt-3 bg-gray-100 rounded"></div>
                        <div class="h-5 mt-3 bg-gray-100 rounded"></div>
                        <div class="h-5 mt-3 w-[80%] bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>
        </section>

        <section
            id="products"
            v-if="products && products.length"
            class="xl:pt-[26px] md:pt-[18px] pt-[13px] xl:pb-[48px] md:pb-[34px] pb-[24px]"
        >
            <div class="container xl:space-y-[50px] md:space-y-[35px] space-y-[25px]">
                <div>
                    <h2 class="text-gray-900 headline_2">
                        {{ tt('Sản phẩm') }}
                    </h2>
                    <div
                        class="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-3 md:gap-y-4 xl:gap-y-6 xl:mt-[14px] md:mt-[10px] mt-[7px]"
                    >
                        <CardProduct v-for="(product, index) in products" :key="index" :product="product" />
                    </div>

                    <div class="xl:mt-[32px] md:mt-[22px] mt-[16px] flex justify-center">
                        <button
                            v-if="productTotal > productLimit * productPage"
                            @click="productPage = productPage + 1"
                            as="button"
                            :class="isLoading && 'pointer-events-none opacity-70'"
                            class="btn tertiary lg:min-w-[330px] md:min-w-[260px] max-md:w-full up !h-[42px] uppercase !border-primary-600 text-center flex justify-center"
                        >
                            <i class="mr-1 gg-spinner" v-if="isLoading"></i>
                            {{ tt('xem thêm') }}
                            {{ productTotal - products.length }}
                            {{ tt('sản phẩm') }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="isEmptySearch">
            <div
                class="container xl:pt-[24px] md:pt-[17px] pt-[12px] xl:pb-[48px] md:pb-[34px] pb-[24px] grid grid-cols-12 xl:gap-x-[32px] md:gap-x-[22px] xl:gap-y-[8px] md:gap-y-[6px] gap-y-[4px]"
            >
                <div class="md:col-span-8 col-span-full md:col-start-3 lg:col-span-6 lg:col-start-4">
                    <JPicture
                        loading="eager"
                        :alt="tt('tim kiem rong')"
                        class="picture-contain"
                        :src="tt('/assets/images/filter-empty.webp')"
                    />
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import axios from 'axios'
import { scrollToSection } from '@/lib/scroll'
export default {
    data() {
        return {
            breadcrumbs: [{ title: this.tt('Kết quả tìm kiếm') }],
            // Product
            products: [],
            productLimit: 10,
            productPage: 1,
            productTotal: 0,

            //
            keyword: this.$page.props.route.query.keyword || '',

            isLoading: false,
            isLoadingInit: false,
        }
    },
    computed: {
        isEmptySearch() {
            return !this.isLoading && !this.products.length
        },
    },
    watch: {
        productPage() {
            this.fetchProducts()
        },
    },
    created() {
        this.fetchDataInit()
    },

    methods: {
        scrollToSection,
        async fetchDataInit() {
            this.isLoadingInit = true
            await Promise.all([this.fetchProducts()])
            this.isLoadingInit = false
        },
        async fetchProducts() {
            if (this.isLoading) return
            this.isLoading = true
            const { data } = await axios.get(
                this.route('api.search', {
                    type: 'PRODUCT',
                    page: this.productPage,
                    keyword: this.keyword,
                    limit: this.productLimit,
                })
            )
            if (data.success) {
                const { total, data: products } = data.data
                this.products = [...this.products, ...products]
                this.productTotal = total
            }
            this.isLoading = false
        },
    },
}
</script>

<style lang="scss" scoped>
ul {
    @apply marker:text-gray-700 xl:pl-[22px] md:pl-[18px] pl-[14px] list-disc;
    li {
        @apply xl:pl-[6px] md:pl-[4px] pl-[3px];
        &::marker {
            @apply text-sm;
        }
    }
}
</style>
