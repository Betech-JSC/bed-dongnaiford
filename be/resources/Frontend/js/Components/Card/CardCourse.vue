<template>
    <Link :href="route('products.show', { slug: item.slug })" class="relative group rounded-[16px] overflow-hidden p-3 space-y-4 bg-white block h-full">       
        <div class="relative">
        <div v-if="discountPercent > 0" class="absolute top-2 right-2 z-10 bg-primary-600 text-white px-3 py-1 rounded-md body-1 font-semibold">
                -{{ discountPercent }}%
            </div>
        <div class="relative aspect-w-1 aspect-h-1 rounded-[12px] overflow-hidden">
            
            <JPicture
                :src="item.image_url || '/assets/placeholder-col.jpg'"
                :alt="item.title || 'image product'"
                class="object-cover h-full w-full lg:group-hover:scale-105 duration-300 ease-in-out"
            />
        </div>
        </div>
        
        <div class="space-y-2">
            <div class="title-2 font-bold text-gray-900 lg:group-hover:text-primary-600 line-clamp-2 min-h-[52px] duration-300 ease-in-out notranslate" translate="no">
                {{ item.title }}
            </div>
            
            <!-- Price Section -->
            <div class="flex items-center gap-2 flex-wrap">
                <!-- Sale Price (if exists) -->
                <div v-if="item.price_sale && item.price_sale > 0" class="text-xl font-bold text-primary-600 notranslate">
                    {{ formatPrice(item.price_sale) }}
                </div>
                
                <!-- Original Price -->
                <div 
                    class="notranslate"
                    :class="item.price_sale && item.price_sale > 0 ? 'text-sm text-gray-500 line-through' : 'text-xl font-bold text-primary-600'">
                    {{ formatPrice(item.price) }}
                </div>
            </div>
        </div>
    </Link>
</template>

<script>
export default {
    props: ['item'],
    
    computed: {
        discountPercent() {
            if (!this.item.price_sale || this.item.price_sale <= 0 || !this.item.price || this.item.price <= 0) {
                return 0
            }
            
            const discount = ((this.item.price - this.item.price_sale) / this.item.price) * 100
            return Math.round(discount)
        }
    },
    
    methods: {
        formatPrice(price) {
            if (!price || price <= 0) {
                return this.tt('Miễn phí')
            }
            
            // Format number with thousand separators
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price)
        }
    }
}
</script>
