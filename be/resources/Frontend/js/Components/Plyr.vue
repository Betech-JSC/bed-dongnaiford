<template>
    <div class="relative z-10 h-full">
        <vue-plyr :options="playerOptions" ref="player">
            <div class="plyr__video-embed">
                <iframe
                    :src="getLinkVideo(src)"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>
        </vue-plyr>
        <div
            class="absolute flex items-center justify-center w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full text-white cursor-pointer bg-primary-500 top-1/2 left-1/2 pl-1.5"
            @click="play()"
            v-show="!playing"
        >
            <IconPlay />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            playerOptions: {
                autoplay: true,
                controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            },
            playing: false,
            randomId: 'id-' + Math.random().toString(36).substr(2, 9).toLowerCase(),
        }
    },
    mounted() {
        this.$refs.player.player.on('playing', (event) => {
            this.playing = event.detail.plyr.playing
            this.$emit('change', event.detail.plyr.playing)
        })
        this.$refs.player.player.on('pause', (event) => {
            this.playing = event.detail.plyr.playing
            this.$emit('change', event.detail.plyr.playing)
        })
    },
    methods: {
        play() {
            this.$refs.player.player.play()
        },
        pause() {
            this.$refs.player?.player.pause()
        },
        toggle() {
            this.playing ? this.pause() : this.play()
        },

        checkIsVideo(url) {
            return url.includes('https://www.youtube.com') || url.includes('https://vimeo.com/')
        },

        getLinkVideo(link) {
            if (link) {
                let video_id = ''
                if (link.includes('https://www.youtube.com')) {
                    if (link.includes('?v=')) {
                        video_id = link.split('?v=').pop()
                        let ampersandPosition = video_id.indexOf('&')
                        if (ampersandPosition != -1) {
                            video_id = video_id.substring(0, ampersandPosition)
                        }
                    }
                    if (link.includes('embed')) {
                        video_id = link.split('/').pop()
                    }
                    return (
                        'https://www.youtube.com/embed/' +
                        video_id +
                        '?amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1&amp;autoplay=1'
                    )
                } else {
                    video_id = link.split('/').pop()
                    return 'https://player.vimeo.com/video/' + video_id
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
:deep(.plyr) {
    iframe {
        @apply max-h-screen;
    }
}
</style>
