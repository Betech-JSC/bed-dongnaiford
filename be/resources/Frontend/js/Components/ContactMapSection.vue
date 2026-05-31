<template>
    <div class="container">
        <div class="flex lg:flex-row flex-col xl:space-x-8 lg:space-x-[22px]">
            <div class="lg:w-[432px] w-full flex-shrink-0">
                <div class="p-2 rounded-lg xl:p-4 md:p-3 contact-box">
                    <div
                        class="pr-2 overflow-y-auto xl:max-h-[578px] max-h-[500px] region-box"
                        v-if="currentTab && currentTab.agencies.length > 0"
                    >
                        <div
                            class="pt-3 px-3 pb-3.5 space-y-2 border-b border-gray-300 last:border-b-0 cursor-pointer bg-white group"
                            v-for="(tab, tabIndex) in currentTab.agencies"
                            :key="tabIndex"
                            @click="toggleMap(tab)"
                        >
                            <div
                                class="lg:group-hover:text-blue-600 lg:duration-150 title-2"
                                :class="currentMap && currentMap.code === tab.code ? 'text-blue-600' : 'text-gray-900'"
                            >
                                {{ tab.title }}
                            </div>
                            <div class="space-y-1">
                                <div class="flex space-x-1.5" v-if="tab.location">
                                    <ContactMapPin class="flex-shrink-0 w-5 h-5" />
                                    <a
                                        :href="tab.link_google_map"
                                        target="_blank"
                                        rel="nofollow noreferrer"
                                        class="text-gray-700 body-1 lg:hover:text-blue-600 lg:duration-150"
                                        >{{ tab.location }}</a
                                    >
                                </div>
                                <div class="flex space-x-1.5" v-if="tab.email">
                                    <Mail class="flex-shrink-0 w-5 h-5 text-blue-600" />
                                    <a
                                        :href="`mailto:${tab.email}`"
                                        class="text-gray-700 body-1 lg:hover:text-blue-600 lg:duration-150"
                                        >{{ tab.email }}</a
                                    >
                                </div>
                                <div class="flex space-x-1.5" v-if="tab.phone">
                                    <Phone class="flex-shrink-0 w-5 h-5" />
                                    <a
                                        :href="`tel:${tab.phone}`"
                                        class="text-gray-700 body-1 lg:hover:text-blue-600 lg:duration-150"
                                        >{{ tab.phone }}</a
                                    >
                                </div>
                            </div>
                            <a
                                :href="tab.link_google_map"
                                target="_blank"
                                rel="nofollow noreferrer"
                                class="inline-flex items-center space-x-2 text-blue-dark-700 lg:hover:text-green-default lg:duration-150"
                                v-if="tab.link_google_map"
                            >
                                <div class="label-2">{{ tt('Xem chỉ đường') }}</div>
                                <ChevronContact />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="xl:h-[670px] h-[586px] w-full contact-map max-lg:hidden"
                v-if="currentMap && currentMap.code !== null"
                v-html="currentMap.code"
            ></div>
        </div>
    </div>
</template>
<script>
import ContactMapPin from '@/Components/Icons/ContactMapPin.vue'
import Mail from '@/Components/Icons/Mail.vue'
import Phone from '@/Components/Icons/Phone.vue'
import ChevronContact from '@/Components/Icons/ChevronContact.vue'
export default {
    props: {
        agencies: {
            type: Array,
            default: [],
        },
    },
    components: { ContactMapPin, Mail, Phone, ChevronContact },
    data() {
        return {
            currentTab: null,
            currentMap: null,
        }
    },
    mounted() {
        if (this.agencies && this.agencies.length > 0) {
            this.currentTab = this.agencies[0]
            this.currentMap = this.agencies[0].agencies[0]
        }
    },
    methods: {
        toggleRegion(item) {
            this.currentTab = item
            this.currentMap = this.currentTab.agencies[0]
        },
        toggleMap(item) {
            this.currentMap = item
        },
    },
}
</script>
<style lang="scss" scoped>
.contact-box {
    box-shadow: 0px 12px 16px 6px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
}
.region-shadow {
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
}
/* width */
::-webkit-scrollbar {
    width: 8px;
    background: white;
    border-radius: 30px;
}
/* Handle */
::-webkit-scrollbar-thumb {
    @apply bg-gray-200 rounded-[30px];
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
}
:deep(.contact-map) {
    iframe {
        @apply w-full h-full;
    }
}
</style>
