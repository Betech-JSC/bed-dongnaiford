<template>
    <div class="w-full min-w-[160px]">
        <div class="relative" @click="toggleDropdown">
            <div class="flex items-center gap-2 cursor-pointer border-b border-gray-500 py-1 px-2 body-1 text-gray-500">
                <div class="w-full">
                    {{ selectedOption ? selectedOption.title : title }}
                </div>
                <ChervonDown class="duration-300 ease-in-out" :class="isOpen ? '-rotate-180' : ''" />
            </div>
            <div
                v-if="isOpen"
                class="absolute top-full w-full mt-2 left-0 bg-primary-25 border border-primary-100 max-h-[200px] z-[1000] overflow-y-auto"
            >
                <div
                    v-for="option in options"
                    :key="option.value"
                    class="body-1 text-gray-500 px-3 py-2 lg:hover:text-primary-800 duration-300 ease-in-out cursor-pointer"
                    @click="selectOption(option)"
                >
                    {{ option.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Inertia } from '@inertiajs/inertia'
import ChervonDown from './Icon/ChervonDown.vue'

export default {
    components: { ChervonDown },
    name: 'CustomSelect',
    props: {
        title: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'product',
        },
        options: {
            type: Array,
            required: true,
            default: () => [],
        },
        filterKey: {
            type: String,
            required: true, // ví dụ "category" hoặc "sort"
        },
    },
    data() {
        return {
            isOpen: false,
            selectedOption: null,
        }
    },
    mounted() {
        // giữ lại trạng thái filter từ query string
        const current = this.$page.url.split('?')[1]
        if (current) {
            const params = new URLSearchParams(current)
            const value = params.get(this.filterKey)
            if (value) {
                this.selectedOption = this.options.find((o) => String(o.value) === value) || null
            }
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen
        },
        selectOption(option) {
            this.selectedOption = option
            this.isOpen = false

            // build query params hiện tại + option mới
            const current = this.$page.url.split('?')[1]
            const params = new URLSearchParams(current || '')

            if (option?.value) {
                params.set(this.filterKey, option.value)
            } else {
                params.delete(this.filterKey)
            }

            if (this.type === 'product') {
                Inertia.get(this.route('products.index'), Object.fromEntries(params.entries()), {
                    preserveState: true,
                    replace: true,
                })
            }

            if (this.type === 'post') {
                Inertia.get(this.route('posts'), Object.fromEntries(params.entries()), {
                    preserveState: true,
                    replace: true,
                })
            }
        },
    },
}
</script>
