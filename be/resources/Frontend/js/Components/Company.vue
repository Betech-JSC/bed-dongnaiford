<template>
    <section class="overflow-hidden pt-[21px] md:pt-[32px]">
        <div class="items-center justify-center grid grid-cols-12">
            <div class="marquee col-span-full">
                <div class="marquee-inner items-center justify-center flex">
                    <JPicture
                        v-for="(item, index) in [...logos, ...logos]"
                        :key="index"
                        :src="item.link"
                        :alt="item.title"
                        class="picture-cover min-w-[228px] lg:min-w-[15vw] px-[32px]"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            logos: [
                {
                    title: 'realty',
                    link: '/assets/images/company/6-sense.png',
                },
                {
                    title: 'remax',
                    link: '/assets/images/company/bmz.png',
                },
                {
                    title: 'ser',
                    link: '/assets/images/company/vinamilk.png',
                },
                {
                    title: 'ver',
                    link: '/assets/images/company/vnvc.png',
                },
                {
                    title: 'realty',
                    link: '/assets/images/company/6-sense.png',
                },
                {
                    title: 'remax',
                    link: '/assets/images/company/bmz.png',
                },
                {
                    title: 'ser',
                    link: '/assets/images/company/vinamilk.png',
                },
                {
                    title: 'ver',
                    link: '/assets/images/company/vnvc.png',
                },
            ],
        }
    },
}
</script>

<style scoped>
/* Marquee container styling */
.marquee {
    display: flex;
    overflow: hidden;
    width: 100%;
}

.marquee-inner {
    display: flex;
    animation: scroll 80s linear infinite;
}

/* Scroll animation */
@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}
</style>