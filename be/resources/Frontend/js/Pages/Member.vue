<template>
    <main>
        <section class="relative pt-8 md:pt-10 md:pb-16 pb-12 xl:pb-20">
            <div class="absolute inset-0 bg-linear"></div>
            <div class="relative">
                <div class="container">
                    <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
                        <div class="col-span-full md:col-span-4">
                            <div
                                class="sticky top-[110px] group rounded-[16px] overflow-hidden p-3 md:p-3 lg:p-4 md:space-y-4 space-y-3 xl:space-y-6 bg-white block lg:hover:shadow-lg duration-300 ease-in-out shadow-lg">
                                <div class="relative aspect-w-3 aspect-h-4 rounded-[12px] overflow-hidden">
                                    <JPicture :src="member.avatar_url" :alt="member.name"
                                        class="object-cover h-full w-full lg:group-hover:scale-105 duration-300 ease-in-out" />
                                </div>
                                <div class="space-y-1.5">
                                    <div class="headline-3 font-bold text-gray-900 lg:group-hover:text-primary-700 line-clamp-1 duration-300 ease-in-out notranslate">
                                        {{ member.name }}
                                    </div>
                                    <div class="body-1 notranslate">{{ member.job_title }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-full md:col-span-8">
                            <div class="relative md:p-4 px-3 py-6 xl:p-6 rounded-[24px] overflow-hidden md:space-y-6 space-y-4 xl:space-y-8 bg-white">
                                <div class="space-y-4">
                                    <h1 class="display-2 font-bold notranslate">{{ member.name }}</h1>
                                    <div class="title-1 font-bold notranslate">{{ member.job_title }}</div>
                                    <div class="prose prose-member body-1 notranslate" v-html="member.bio" translate="no"></div>
                                </div>
                                <a :href="`mailto:${member.email}`" target="_blank" rel="noopener noreferrer nofollow" class="btn btn-contact title-2 uppercase !font-normal text-white">
                                    {{ tt('Liên hệ ngay với chúng tôi') }}
                                </a>
                                <div class="space-y-4">
                                    <div v-for="(itemGallery, indexGallery) in member.gallery" :key="indexGallery">
                                        <JPicture :src="itemGallery.image_url || '/assets/placeholder.jpg'" :alt="itemGallery.caption" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import CardTeam from '@/Components/Card/CardTeam.vue';

export default {
    props: ['member'],
    components: { CardTeam }
}
</script>
<style lang="scss" scoped>
.bg-linear {
    background: linear-gradient(180deg, #FFFFFF 3.53%, rgba(252, 255, 166, 0.1) 62.59%, #E6C200 106.32%), #F5F5F4;
}
.btn-contact {
    background: linear-gradient(135deg, #210DFF 0%, #5FA4E6 44.76%, #FFC310 100%);
}
</style>