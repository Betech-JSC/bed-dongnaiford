<template>
    <section class="relative md:min-h-[400px] lg:min-h-[550px] xl:min-h-[720px] bg-black">
        <!-- Gradient Overlay -->
        <div class="absolute z-10 inset-0 bg-linear-video pointer-events-none"></div>

        <!-- Video Container -->
        <div class="relative h-full w-full overflow-hidden" @mouseenter="showControls = true"
            @mousemove="handleMouseMove" @mouseleave="hideControlsDelayed">
            <!-- Video Element -->
            <video ref="videoPlayer" src="/assets/video/video.mp4" @loadedmetadata="onVideoLoaded"
                @timeupdate="onTimeUpdate" @play="isPlaying = true" @pause="isPlaying = false" @ended="onVideoEnded"
                @click="toggleVideo" muted loop autoplay class="w-full h-full object-cover cursor-pointer"></video>

            <!-- Bottom Controls Bar -->
            <div v-if="isPlaying"
                class="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-6 pb-2 md:pb-6 pt-12 md:block hidden">
                <!-- Progress Bar -->
                <div class="mb-4">
                    <div class="relative h-1 bg-white/30 rounded-full cursor-pointer group" @click="seek"
                        ref="progressBar">
                        <!-- Progress -->
                        <div class="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all"
                            :style="{ width: `${progress}%` }"></div>

                        <!-- Hover Preview -->
                        <div class="absolute top-0 h-full bg-white/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            :style="{ width: `${hoverProgress}%` }"></div>

                        <!-- Thumb -->
                        <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            :style="{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }"></div>
                    </div>

                    <!-- Time Display -->
                    <div class="flex justify-between text-xs text-white/80 mt-2">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                </div>

                <!-- Control Buttons -->
                <div class="flex items-center justify-between">
                    <!-- Left Controls -->
                    <div class="flex items-center gap-4">
                        <!-- Play/Pause -->
                        <button @click="toggleVideo" class="text-white hover:text-yellow-400 transition-colors">
                            <svg v-if="!isPlaying" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        </button>

                        <!-- Volume -->
                        <div class="flex items-center gap-2 group">
                            <button @click="toggleMute" class="text-white hover:text-yellow-400 transition-colors">
                                <svg v-if="isMuted || volume === 0" class="w-6 h-6" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path
                                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                </svg>
                                <svg v-else-if="volume < 0.5" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                                </svg>
                                <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                                </svg>
                            </button>

                            <!-- Volume Slider -->
                            <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume"
                                class="w-0 group-hover:w-20 transition-all duration-300 accent-yellow-400" />
                        </div>
                    </div>

                    <!-- Right Controls -->
                    <div class="flex items-center gap-4">
                        <!-- Speed Control -->
                        <div class="relative" ref="speedMenu">
                            <button @click="showSpeedMenu = !showSpeedMenu"
                                class="text-white hover:text-yellow-400 transition-colors text-sm font-medium">
                                {{ playbackRate }}x
                            </button>

                            <!-- Speed Menu -->
                            <transition name="fade">
                                <div v-show="showSpeedMenu"
                                    class="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg overflow-hidden shadow-xl">
                                    <button v-for="rate in [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]" :key="rate"
                                        @click="changeSpeed(rate)"
                                        class="block w-full px-4 py-2 text-sm text-white hover:bg-yellow-400/20 transition-colors text-left"
                                        :class="{ 'bg-yellow-400/30': playbackRate === rate }">
                                        {{ rate }}x
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <!-- Fullscreen -->
                        <button @click="toggleFullscreen" class="text-white hover:text-yellow-400 transition-colors">
                            <svg v-if="!isFullscreen" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                            <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading Spinner -->
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-40">
                <div class="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            isPlaying: false,
            showControls: false,
            isLoading: true,
            isMuted: true,
            volume: 1,
            currentTime: 0,
            duration: 0,
            progress: 0,
            hoverProgress: 0,
            playbackRate: 1,
            showSpeedMenu: false,
            isFullscreen: false,
            controlsTimeout: null,
        }
    },
    methods: {
        toggleVideo() {
            const video = this.$refs.videoPlayer
            this.showControls = true
            if (video.paused) {
                video.play()
            } else {
                video.pause()
            }
        },

        onVideoLoaded() {
            this.duration = this.$refs.videoPlayer.duration
            this.isLoading = false

            // Auto play after loaded
            this.$refs.videoPlayer.play().catch((err) => {
                console.log('Autoplay prevented:', err)
            })
        },

        onTimeUpdate() {
            const video = this.$refs.videoPlayer
            this.currentTime = video.currentTime
            this.progress = (video.currentTime / video.duration) * 100
        },

        onVideoEnded() {
            this.isPlaying = false
        },

        seek(event) {
            const progressBar = this.$refs.progressBar
            const rect = progressBar.getBoundingClientRect()
            const percent = (event.clientX - rect.left) / rect.width
            const video = this.$refs.videoPlayer

            video.currentTime = percent * video.duration
        },

        toggleMute() {
            this.isMuted = !this.isMuted
            this.$refs.videoPlayer.muted = this.isMuted
        },

        changeVolume() {
            const video = this.$refs.videoPlayer
            video.volume = this.volume

            if (this.volume > 0) {
                this.isMuted = false
                video.muted = false
            }
        },

        changeSpeed(rate) {
            this.playbackRate = rate
            this.$refs.videoPlayer.playbackRate = rate
            this.showSpeedMenu = false
        },

        toggleFullscreen() {
            const container = this.$el

            if (!document.fullscreenElement) {
                container.requestFullscreen().then(() => {
                    this.isFullscreen = true
                })
            } else {
                document.exitFullscreen().then(() => {
                    this.isFullscreen = false
                })
            }
        },

        handleMouseMove() {
            this.showControls = true
            this.resetControlsTimeout()
        },

        hideControlsDelayed() {
            this.resetControlsTimeout()
        },

        resetControlsTimeout() {
            clearTimeout(this.controlsTimeout)

            if (this.isPlaying) {
                this.controlsTimeout = setTimeout(() => {
                    this.showControls = false
                }, 3000)
            }
        },

        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00'

            const mins = Math.floor(seconds / 60)
            const secs = Math.floor(seconds % 60)
            return `${mins}:${secs.toString().padStart(2, '0')}`
        },

        handleClickOutside(event) {
            const speedMenu = this.$refs.speedMenu
            if (speedMenu && !speedMenu.contains(event.target)) {
                this.showSpeedMenu = false
            }
        },
    },

    mounted() {
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement
        })

        // Listen for clicks outside speed menu
        document.addEventListener('click', this.handleClickOutside)

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const video = this.$refs.videoPlayer

            switch (e.key) {
                case ' ':
                    e.preventDefault()
                    this.toggleVideo()
                    break
                case 'ArrowLeft':
                    video.currentTime = Math.max(0, video.currentTime - 5)
                    break
                case 'ArrowRight':
                    video.currentTime = Math.min(video.duration, video.currentTime + 5)
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    this.volume = Math.min(1, this.volume + 0.1)
                    this.changeVolume()
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    this.volume = Math.max(0, this.volume - 0.1)
                    this.changeVolume()
                    break
                case 'f':
                    this.toggleFullscreen()
                    break
                case 'm':
                    this.toggleMute()
                    break
            }
        })
    },

    beforeUnmount() {
        clearTimeout(this.controlsTimeout)
        document.removeEventListener('click', this.handleClickOutside)
    },
}
</script>

<style lang="scss" scoped>
.bg-linear-video {
    background: linear-gradient(180deg, #e5c025 0%, rgba(229, 192, 37, 0) 24.58%);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s, opacity 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

/* Custom scrollbar for volume slider */
input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    border-radius: 10px;
    height: 4px;
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #e5c025;
    cursor: pointer;
    border-radius: 50%;
}

input[type='range']::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #e5c025;
    cursor: pointer;
    border-radius: 50%;
    border: none;
}
</style>
