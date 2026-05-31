<template>
    <div class="relative group">
        <button type="button" class="w-8 h-8 relative rounded-full overflow-hidden">
            <JPicture :src="languages.find(l => l.code === $page.props.locale.current).image" alt="" class="w-full h-full object-cover" />
        </button>
        <div class="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 min-w-[50px]">
            <ul class="bg-white rounded-md flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden py-2 border border-gray-100">
                <li v-for="lang in languages" :key="lang.code">
                    <button
                        type="button"
                        class="w-8 h-8 relative rounded-full overflow-hidden"
                        :class="$page.props.locale.current == lang.code ? 'bg-brand-50 text-brand-500 font-bold' : 'text-gray-900'"
                        @click="$emit('switch', lang.code)"
                    >
                        <JPicture :src="lang.image" :alt="lang.label" class="w-full h-full object-cover" />
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ChervonDown from './Icon/ChervonDown.vue'

export default {
    name: 'LanguageSwitcher',
    components: { ChervonDown },
    emits: ['switch'],
    data() {
        return {
            languages: [
                { code: 'vi', label: 'VI', image: '/assets/flag-vi.png' },
                { code: 'en', label: 'EN', image: '/assets/flag-en.png' },
                { code: 'zh', label: 'ZH', image: '/assets/flag-zh.png' },
            ]
        }
    }
}
</script>
