<template>
    <div class="cd-timeline-line"></div>
    <section id="cd-timeline" class="cd-container">
        <div class="cd-timeline-block" v-for="(history, index) in histories" :key="index">
            <div class="cd-timeline-img">
                <div class="text-center text-white">
                    <div class="font-semibold title-1">{{ history.year }}</div>
                    <div class="flex items-center space-x-[6px] justify-center" v-if="history.staff_quantity">
                        <User />
                        <div class="button-2">{{ history.staff_quantity }}</div>
                    </div>
                </div>
            </div>

            <div class="cd-timeline-content">
                <div class="dot"></div>
                <div class="flex items-center space-x-[4px] mb-[4px]">
                    <div class="font-bold text-gray-900 headline-2">{{ history.year }}</div>
                    <div class="flex md:hidden items-center space-x-[4px] justify-center" v-if="history.staff_quantity">
                        <span>-</span>
                        <User />
                        <div class="font-bold text-gray-900 headline-2">{{ history.staff_quantity }}</div>
                    </div>
                </div>
                <div
                    class="body-1"
                    :class="history.image.url ? 'line-clamp-2' : 'line-clamp-6'"
                    v-html="history.description"
                ></div>
                <div class="mt-2 md:mt-3 xl:mt-[16px]" v-if="history.has_content">
                    <Link
                        :href="route('histories.show', { slug: history.slug })"
                        class="flex items-center space-x-3 font-medium text-gray-900 duration-300 ease-in-out label-1 hover:text-blue-700"
                    >
                        <span>{{ tt('Xem chi tiết') }}</span>
                        <Chervon />
                    </Link>
                </div>
                <div class="aspect-w-2 aspect-h-1 mt-[16px]" v-if="history.image.url">
                    <JPicture
                        :src="history.image.url"
                        wrapperClass="picture-cover h-full"
                        :alt="history.image.alt || 'image'"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import User from './Icon/User.vue'
import Chervon from './Icons/Chervon.vue'

export default {
    props: ['histories'],
    components: { Chervon, User },
    mounted() {
        const timelineLine = document.querySelector('.cd-timeline-line')
        const timelinesHeight = []
        const screen = window.innerWidth
        document.querySelectorAll('.cd-timeline-block').forEach(function (el) {
            el.style.maxHeight = el.scrollHeight + 'px'
            if (screen >= 1280) {
                timelinesHeight.push(el.scrollHeight - 96)
            } else {
                timelinesHeight.push(el.scrollHeight + 32)
            }
        })
        const total = timelinesHeight.slice(0, -1).reduce((prev, next) => {
            return prev + next
        })
        timelineLine.style.height = total + 'px'
    },
}
</script>

<style lang="scss" scoped>
#cd-timeline {
    position: relative;
}
.cd-timeline-line {
    @apply absolute top-[56px] md:left-10 xl:left-[51%] w-0.5 bg-blue-600 md:block hidden;
}
@media only screen and (min-width: 1280px) {
    #cd-timeline::before {
        @apply left-1/2 ml-[14px];
    }
}
@screen xl {
    #cd-timeline::before {
        height: calc(100% - 15%);
    }
}
.cd-timeline-block {
    position: relative;
    margin: 2rem 0;
}
.cd-timeline-block::after {
    clear: both;
    content: '';
    display: table;
}
.cd-timeline-block:first-child {
    margin-top: 0;
}
.cd-timeline-block:last-child {
    margin-bottom: 0;
}
@media only screen and (min-width: 1170px) {
    .cd-timeline-block {
        margin: -6rem 0;
    }
    .cd-timeline-block:first-child {
        margin-top: 0;
    }
    .cd-timeline-block:last-child {
        margin-bottom: 0;
    }
}
.cd-timeline-img {
    background: linear-gradient(330.4deg, #2b40b6 19.98%, #2067e3 96.8%);
    @apply hidden md:flex items-center justify-center rounded-full absolute top-0 left-0 w-[80px] h-[80px] z-20;
}

@media only screen and (min-width: 1170px) {
    .cd-timeline-img {
        @apply w-[91px] h-[91px] left-1/2 ml-[-30px] z-20;
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;
    }
    .cssanimations .cd-timeline-img.is-hidden {
        visibility: hidden;
    }
}
.cd-timeline-content {
    @apply relative md:ml-[204px] xl:ml-[60px] p-4 bg-white md:w-[500px] xl:w-[457px];
}
.cd-timeline-content .dot::before {
    content: '';
    @apply absolute w-4 h-4 bg-error-600 top-1/2 -translate-y-1/2 left-0 rounded-full;
}
.cd-timeline-content .dot {
    @apply w-[30%] xl:w-[35%] h-[2px] bg-error-600 relative top-[24px] xl:top-[30px] right-[32%] xl:right-[-102%] rotate-180 xl:rotate-0 md:block hidden;
}

.no-touch .cd-timeline-content .cd-read-more:hover {
    background-color: #bac4cb;
}
.cd-timeline-content .cd-date {
    float: left;
    padding: 0.8em 0;
    opacity: 0.7;
}

@media only screen and (min-width: 1280px) {
    .cd-timeline-content {
        margin-left: 0;
        padding: 1rem;
    }
    .cd-timeline-content::before {
        @apply top-6 left-full;
    }

    .cd-timeline-block:nth-child(even) .cd-timeline-content {
        float: right;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content::before {
        @apply top-6 left-auto right-full;
    }
    .cd-timeline-block:nth-child(even) .cd-timeline-content .dot {
        @apply left-[-37%] rotate-180;
    }
}
</style>
