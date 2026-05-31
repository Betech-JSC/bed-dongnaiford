<template>
    <div class="relative inset-x-0 overflow-hidden">
        <div class="marquee">
            <div class="marquee-element">
                <div class="marquee-bar" v-for="(item, index) in marqueeList" :key="index">
                    <div v-for="(card, cardIndex) in item" :key="cardIndex"
                        class="flex items-center justify-center marquee-card">
                        <JPicture wrapperClass="picture-cover h-full"
                            :src="card.image && card.image.url ? card.image.url : '/assets/images/cover.jpg'" :srcMb="card.image_mobile && card.image_mobile.url
                                ? card.image_mobile.url
                                : card.image && card.image.url
                                    ? card.image.url
                                    : '/assets/images/cover.jpg'
                                " loading="eager" :alt="card.image && card.image.alt ? card.image.alt : card.title" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        marquee: {
            type: Array,
            default: [],
        },
        loopTimes: {
            type: Number,
            default: 4,
        },
    },
    data() {
        return {
            marqueeList: [],
        }
    },
    mounted() {
        for (let i = 0; i < this.loopTimes; i++) {
            this.marqueeList.push(this.marquee)
        }
    },
}
</script>
<style lang="scss" scoped>
.marquee {
    width: 100%;
    overflow: hidden;
}

.marquee-bar {
    width: 50%;
    @apply flex items-center w-max;
}

.marquee-element {
    position: relative;
    overflow: hidden;
    animation-name: marquee;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    display: flex;
    width: max-content;
    animation-duration: 18s;

    &.normal {
        animation-direction: normal;
    }

    &.reverse {
        animation-direction: reverse;
    }
}

.marquee-element:hover {
    cursor: pointer;
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
    -moz-animation-play-state: paused;
    -o-animation-play-state: paused;
    -ms-animation-play-state: paused;
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-1036px);

        @screen lg {
            transform: translateX(-2072px);
        }
    }
}

.marquee-card {
    flex: 0 0 300px;
    @apply w-[387px] h-[200px] md:h-[258px] xl:mx-4 md:mx-3 mx-2 duration-150 rounded-[24px] relative overflow-hidden;
}

@media screen and (min-width: 1024px) {
    .marquee-card {
        flex: 0 0 387px;
    }
}
</style>
