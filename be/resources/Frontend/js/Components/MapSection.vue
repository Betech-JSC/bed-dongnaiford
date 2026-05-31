<template>
    <section class="xl:py-[64px] md:py-[45px] py-8 overflow-hidden map-section" id="section-map">
        <div class="container space-y-[32px]">
            <div class="space-y-[12px]">
                <div class="display-3 text-primary-700">Supply Chain Around Worldwide</div>
                <div class="body-1 text-primary-900">
                    U-TREND operates an extensive supply chain, ensuring efficient product sourcing and <br />
                    distribution across the globe.
                </div>
            </div>
            <div class="relative max-md:hidden">
                <img src="/assets/images/home/map.webp" alt="global map" class="relative object-cover w-full h-full" />
            </div>
            <div class="md:hidden">
                <img src="/assets/images/home/map.webp" alt="global map" class="relative object-cover w-full h-full" />
            </div>
        </div>
    </section>
</template>
<script>
export default {
    data() {
        return {
            current: 0,
        }
    },
}
</script>
