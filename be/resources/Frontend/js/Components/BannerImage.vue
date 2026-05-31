<template>
    <section>
        <div class="relative" :class="classBanner ? classBanner : 'h-[280px] md:h-[320px] xl:h-[480px]'">
            <div class="absolute inset-0">
                <JPicture :src="banner.image_url" :srcMb="banner.image_mobile_url" loading="eager"
                    class="object-fit h-full w-full object-cover" :alt="banner.title" />
            </div>
            <div class="absolute bg-linear inset-0 w-full h-full"></div>
        </div>
    </section>
</template>
<script>
import JamBreadcrumb from '@/Components/Jam/Breadcrumb.vue'
import LogoSymbol from '@/Components/Icons/LogoSymbol.vue'
import JPicture from '@toannguyen112/bed-library-essentials/src/js/components/JPicture.vue'

export default {
    components: {
        JamBreadcrumb,
        LogoSymbol,
        JPicture,
    },
    props: ["banner", "classBanner"]
}
</script>
<style lang="scss" scoped>
.bg-linear {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 66.83%, #F5F5F4 95.23%);
}
</style>