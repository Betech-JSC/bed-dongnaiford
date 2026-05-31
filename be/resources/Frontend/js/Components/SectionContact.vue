<template>
    <section class="relative h-[420px] lg:h-[550px] xl:h-[800px] overflow-hidden">
        <div class="absolute inset-0 md:block hidden">
            <div class="grid grid-cols-2">
                <JPicture
                    src="/assets/images/home/bg-contact.webp"
                    alt="background contact"
                    wrapperClass="picture-cover"
                    class="w-full h-full object-cover"
                />
                <JPicture
                    src="/assets/images/home/image-contact.webp"
                    alt="image contact"
                    wrapperClass="picture-cover"
                    class="w-full h-full object-cover"
                />
            </div>
        </div>
        <div class="relative h-full">
            <div class="container h-full">
                <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8 h-full">
                    <div
                        class="col-span-full md:col-span-6 lg:col-span-5 flex items-center justify-center h-full relative"
                    >
                        <div class="absolute inset-0 md:hidden">
                            <JPicture
                                src="/assets/images/home/bg-contact.webp"
                                alt="background contact"
                                wrapperClass="picture-cover"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div
                            class="text-center space-y-6 md:space-y-[40px] xl:space-y-[60px] xl:max-w-[432px] w-full relative z-10 max-md:px-6"
                        >
                            <div>
                                <div class="body-0 font-medium text-white">{{ tt('#Sin N Source') }}</div>
                                <h2 class="display-2 text-primary-100 mt-4 xl:mt-5 mb-4 xl:mb-6 uppercase">
                                    {{ tt('Bạn có ý tưởng chúng tôi có giải pháp') }}
                                </h2>
                                <div class="body-1 xl:!text-[20px] text-primary-100">
                                    {{ tt('Liên hệ để bắt đầu hành trình xây dựng thương hiệu rượu đậm bản sắc.') }}
                                </div>
                            </div>
                            <Link :href="route('contact')" class="btn primary space-x-3 flex items-center justify-center">
                                <span>{{ tt('Liên hệ ngay') }}</span>
                                <Arrow />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import Arrow from '@/Components/Icons/Arrow.vue'

export default {
    components: { Arrow },
}
</script>
