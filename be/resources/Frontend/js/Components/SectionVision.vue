<template>
    <section class="bg-gray-50 pt-[48px] md:pt-[67px] xl:pt-[96px] relative">
        <JPicture src="/assets/images/service/shape-benefits.png" class="absolute top-0 right-0 z-10 opacity-30" />
        <div class="relative z-10">
            <div class="container">
                <div class="max-w-[1008px] mx-auto">
                    <h2 class="display-3 text-primary-dark max-w-[488px]">
                        {{ tt('Tầm nhìn và Sứ mệnh giới thiệu') }}
                    </h2>

                    <div
                        class="mt-[32px] mt:my-[44px] xl:mt-[64px] flex md:flex-row flex-col items-start justify-between space-y-5 md:space-y-0 md:space-x-8"
                    >
                        <div
                            class="text-gray-700 md:w-[390px]"
                            v-for="(benefit, index) in service.benefits"
                            :key="index"
                        >
                            <div>
                                <div class="mb-2 headline-2 md:mb-5 xl:mb-8 text-[#101828]" v-if="benefit.primaryTitle">
                                    {{ benefit.primaryTitle }}
                                </div>
                                <h3 class="pb-2 mb-2 border-b border-gray-300 md:mb-3 xl:mb-4 title-1">
                                    {{ benefit.title }}
                                </h3>
                            </div>
                            <p class="body-1">{{ benefit.content }}</p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="service.benefit_image?.url"
                    class="h-[240px] md:h-[380px] xl:h-[503px] mt-[32px] mt:my-[44px] xl:mt-[64px]"
                    :class="{
                        'mt-[32px] md:mt-[44px] xl:mt-[64px]': service.benefits.length === 0,
                    }"
                >
                    <JPicture
                        :src="service.benefit_image.url"
                        class="object-cover w-full h-full"
                        :alt="service.benefit_image.alt"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: ['service'],
}
</script>

<style></style>
