<template>
    <section class="overflow-hidden">
        <div class="items-center justify-center">
            <div class="marquee">
                <div class="marquee-inner md:gap-x-[6px] gap-x-[4px] xl:gap-x-[10px]">
                    <div
                        v-for="(item, index) in [...items, ...items]"
                        :key="index"
                        class="min-w-[55vw] lg:min-w-[355px] h-full mr-[4px] md:mr-[6px] xl:mr-[10px] bg-primary-100 rounded-lg overflow-hidden"
                    >
                        <JPicture :src="item.image" :alt="item.title" class="picture-cover" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: [],
        },
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
    margin-right: 10px;
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
