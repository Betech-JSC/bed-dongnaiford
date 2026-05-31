<template>
    <section>
        <div class="h-[280px] md:h-[320px] xl:h-[330px] relative">
            <div class="absolute inset-0">
                <JPicture
                    :src="banner.image"
                    loading="eager"
                    class="object-fit h-full w-full object-cover"
                    :alt="banner.title"
                />
            </div>
            <div class="relative h-full">
                <div class="container h-full flex items-center justify-center">
                    <div class="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
                        <div
                            class="col-span-full md:col-span-10 md:col-start-2 space-y-5 flex flex-col justify-center items-center"
                        >
                            <JamBreadcrumb :items="banner.breadcrumbs" />
                            <div class="space-y-3">
                                <h1
                                    class="text-primary-800 display-2 inline-block uppercase text-center"
                                    v-html="banner.title"
                                ></h1>
                                <div class="max-w-[254px] w-full mx-auto text-primary-800 flex items-center gap-3">
                                    <div class="w-full h-px bg-primary-800"></div>
                                    <LogoSymbol class="flex-shrink-0" />
                                    <div class="w-full h-px bg-primary-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import JamBreadcrumb from '@/Components/Jam/Breadcrumb.vue'
import LogoSymbol from '@/Components/Icons/LogoSymbol.vue'

export default {
    components: {
        JamBreadcrumb,
        LogoSymbol,
    },
    props: ['banner'],
}
</script>
