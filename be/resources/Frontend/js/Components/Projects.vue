<template>
    <section class="overflow-hidden">
        <div class="items-center justify-center">
            <div class="marquee">
                <div class="marquee-inner gap-x-[10px]">
                    <JPicture
                        v-for="(item, index) in [...projects, ...projects]"
                        :key="index"
                        :src="item.image.url"
                        :alt="item.image.alt"
                        class="picture-cover lg:min-w-[25vw] min-w-[355px] h-full mr-[10px]"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        projects: {
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
