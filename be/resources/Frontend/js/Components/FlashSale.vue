<template>
    <div v-if="products && products.length > 0 && !isFlashSalePage" class="bg-white py-[32px]">
        <SliderSwiper
            :products="products"
            :breakpoints="{
                320: { slidesPerView: 2.2, spaceBetween: 10 },
                768: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 30 },
            }"
        />
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: ['products'],
    data() {
        return {
            isFlashSalePage: false, // Trạng thái kiểm tra đường dẫn
            isLoading: true, // Trạng thái loading
        }
    },
    created() {
        this.checkRoute()
    },
    methods: {
        async fetchData() {
            try {
                const { data } = await axios.get('/api/product-sale')
                this.products = data.data.products
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.isLoading = false // Kết thúc trạng thái loading
            }
        },
        checkRoute() {
            this.isFlashSalePage = window.location.pathname === '/flash-sale'
        },
    },
}
</script>
