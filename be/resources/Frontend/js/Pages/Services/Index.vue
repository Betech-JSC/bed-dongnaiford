<template>
    <main class="bg-primary-25">
        <BannerImage :banner="banner" classBanner="h-[320px]" />
        <section v-if="services && services.length" class="py-12 md:py-16 xl:py-20">
            <div class="container">
                <div class="grid md:grid-cols-3 gap-x-4 xl:gap-x-6 md:gap-y-6 gap-y-4 xl:gap-y-8">
                    <CardCardService class="col-span-full" :item="services[0]" :isLarge="true" />
                    <CardCardService
                        v-for="(itemService, indexService) in services.slice(1)"
                        :key="indexService"
                        :item="itemService"
                    />
                </div>
            </div>
        </section>
        <SectionContact class="max-md:pb-12" />
    </main>
</template>
<script>
import CardService from '@/Components/Card/CardService.vue'

export default {
    components: { CardService },

    props: ['services', 'banner'],
    data() {
        return {
            banner: {
                title: this.tt('Dịch vụ của chúng tôi'),
                image: '/assets/images/services/bg-banner.webp',
                breadcrumbs: [
                    {
                        title: this.tt('Dịch vụ'),
                    },
                ],
            },
        }
    },
}
</script>
