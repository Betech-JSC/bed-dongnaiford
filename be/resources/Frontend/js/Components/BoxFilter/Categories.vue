<template>
    <div class="box-category space-y-2">
        <nav class="flex flex-col gap-2">
            <!-- Category Title -->
            <div class="flex items-center justify-between">
                <Link
                    :href="route('products.categories', { slug: item.slug })"
                    class="label-1 font-semibold text-gray-800"
                >
                    {{ item.title }}
                </Link>
                <button
                    v-if="item.nodes.length"
                    :class="isShowMore ? 'rotate-180' : 'rotate-0'"
                    class="transition-transform duration-300"
                    @click="toggleShowMore"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M15 12.5L10 7.5L5 12.5"
                            stroke="#101828"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <!-- Render Categories with Animation -->
            <transition-group name="fade" tag="div" class="space-y-[8px]">
                <div v-for="(category, index) in visibleNodes" :key="category.slug" class="ml-3">
                    <Link
                        :href="route('products.categories', { slug: category.slug })"
                        class="label-1 font-semibold text-gray-600 block"
                    >
                        {{ category.title }}
                    </Link>
                    <!-- Render Level 3 Subcategories -->
                    <div v-if="category.nodes && category.nodes.length" class="ml-6 space-y-[8px]">
                        <Link
                            v-for="subCategory in category.nodes"
                            :key="subCategory.slug"
                            :href="route('products.categories', { slug: subCategory.slug })"
                            class="label-1 font-semibold text-gray-600 block"
                        >
                            {{ subCategory.title }}
                        </Link>
                    </div>
                </div>
            </transition-group>
        </nav>
    </div>
</template>


<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        quantityInit: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            quantity: this.quantityInit,
        }
    },
    computed: {
        isShowMore() {
            return this.quantity < this.item.nodes.length
        },
        visibleNodes() {
            return this.item.nodes.slice(0, this.quantity)
        },
    },
    methods: {
        toggleShowMore() {
            this.quantity = this.isShowMore ? this.item.nodes.length : this.quantityInit
        },
    },
}
</script>


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 1s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>