<template>
    <main>
        <BannerImage :banner="banner" classBanner="md:h-[550px] h-[200px] xl:h-[700px]" />
        <section v-if="jobs && jobs.length" class="bg-gray-25 md:py-16 py-12 xl:py-20">
            <div class="container md:space-y-8 space-y-6 xl:space-y-12">
                <AnimatedAppear>
                    <h2 class="display-3 text-center font-bold text-brand-100">JOIN Vietnam Farmer</h2>
                </AnimatedAppear>
                <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
                    <div v-for="(itemJob, indexJob) in jobs" :key="indexJob"
                        class="border border-gray-200 rounded-[16px] relative px-6 py-8">
                        <div class="absolute h-[66px] w-2 bg-brand-100 top-1/2 -translate-y-1/2 left-0"></div>
                        <div class="relative space-y-3">
                            <div class="flex items-center gap-2 text-brand-300">
                                <Location />
                                <span>{{ itemJob.work_address }}</span>
                            </div>
                            <Link :href="route('jobs.show', { slug: itemJob.slug })" class="block">
                            <h3 class="button-1 font-bold text-gray-900">{{ itemJob.title }}</h3>
                            </Link>
                            <div class="flex items-center gap-3 body-1 text-gray-700">
                                <span>Quantity: {{ itemJob.quantity }}</span>
                                <span>|</span>
                                <span>Application Deadline: {{ formatDate(itemJob.expected_time) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="bg-primary-25 relative md:py-16 py-12 xl:py-[100px] overflow-hidden">
            <div class="absolute bottom-0 left-0 max-w-[130px] md:max-w-[320px] xl:max-w-[481px] w-full">
                <JPicture class="w-full h-full object-contain" src="/assets/images/job/image-mask-left.png"
                    alt="image mask left" />
            </div>
            <div class="absolute bottom-0 right-0 max-w-[90px] md:max-w-[260px] xl:max-w-[302px] w-full">
                <JPicture class="w-full h-full object-contain" src="/assets/images/job/image-mask-right.png"
                    alt="image mask right" />
            </div>
            <div class="relative">
                <div class="container md:space-y-8 space-y-6 xl:space-y-12 text-center">
                    <AnimatedAppear>
                        <h2 class="display-3 text-center font-bold text-brand-100 uppercase">Share and Connect</h2>
                    </AnimatedAppear>
                    <AnimatedAppear>
                        <div class="headline-3 text-gray-900">
                            At Vietnam Farmer, we believe that the strength of a team comes not only from professional
                            capabilities, but also from moments of sharing.
                        </div>
                    </AnimatedAppear>
                    <AnimatedAppear>
                        <div class="relative">
                            <JPicture class="w-full h-full object-contain" src="/assets/images/job/image-connect.png"
                                alt="image connect" />
                        </div>
                    </AnimatedAppear>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import Location from '@/Components/Icons/Location.vue'
import BannerImage from '@/Components/BannerImage.vue'
import JPicture from '@toannguyen112/bed-library-essentials/src/js/components/JPicture.vue'

export default {
    components: { Location, BannerImage, JPicture },
    props: ['jobs'],
    data() {
        return {
            banner: {
                title: this.tt('Careers'),
                image: '/assets/images/job/banner.jpg',
            },
        }
    },
}
</script>
