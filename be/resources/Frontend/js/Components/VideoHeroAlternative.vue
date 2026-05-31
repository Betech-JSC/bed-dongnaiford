<template>
    <section class="relative overflow-hidden h-full max-h-[720px]">
        <div class="md:aspect-w-2 md:aspect-h-1 aspect-w-3 aspect-h-4">

            <!-- Video Background -->
            <div class="absolute inset-0 w-full h-full">
                
                <!-- Option 1: MP4 Video File (Best for iPhone) -->
                <video
                    v-if="item.video_file_url"
                    ref="videoElement"
                    :src="item.video_file_url"
                    class="absolute inset-0 w-full h-full object-cover"
                    autoplay
                    muted
                    loop
                    playsinline
                    webkit-playsinline
                    :poster="item.video_poster || item.image_url"
                    @loadstart="onVideoLoadStart"
                    @canplay="onVideoCanPlay"
                    @error="onVideoError">
                </video>

                <!-- Option 2: YouTube for Desktop, Thumbnail for Mobile -->
                <div v-else-if="isYouTube(item.video_url)" class="absolute inset-0 w-full h-full">
                    
                    <!-- Mobile: YouTube Thumbnail + Direct Link -->
                    <div v-if="isMobile" class="absolute inset-0 w-full h-full cursor-pointer" @click="openYouTubeVideo">
                        <img 
                            :src="getYouTubeThumbnail(item.video_url, 'maxresdefault')"
                            :alt="item.title || 'Video thumbnail'"
                            class="absolute inset-0 w-full h-full object-cover"
                            @error="handleThumbnailError"
                        />
                        
                        <!-- Subtle overlay to indicate it's clickable -->
                        <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div class="text-white text-center">
                                <div class="text-sm opacity-75">Tap to watch on YouTube</div>
                            </div>
                        </div>
                    </div>

                    <!-- Desktop: YouTube Iframe -->
                    <iframe
                        v-else
                        :src="getYouTubeEmbedUrl(item.video_url)"
                        class="absolute inset-0 w-full h-full"
                        frameborder="0"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowfullscreen
                        playsinline>
                    </iframe>
                </div>

                <!-- Option 3: Image Fallback -->
                <JPicture
                    v-else
                    :src="item.image_url || '/cover.jpg'"
                    :srcMb="item.image_mobile_url || item.image_url"
                    :alt="item.title || 'Hero image'"
                    class="absolute inset-0 w-full h-full object-cover"
                />

                <!-- Video Controls Overlay (for video files) - Hidden by default -->
                <div 
                    v-if="item.video_file_url && showVideoControls"
                    class="absolute bottom-4 right-4 z-10 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button 
                        @click="toggleVideoPlayback"
                        class="video-control-btn">
                        <svg v-if="isVideoPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <button 
                        @click="toggleVideoMute"
                        class="video-control-btn">
                        <svg v-if="isVideoMuted" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Content Overlay -->
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[800px] w-full md:py-6 py-4 xl:py-8 md:px-8 px-4 xl:px-16 flex flex-col justify-center items-center space-y-4 text-center text-white z-20">
                <AnimatedAppear>
                    <h1 class="display-1 font-bold notranslate">
                        {{ item.title || 'Hero Title' }}
                    </h1>
                </AnimatedAppear>

                <AnimatedAppear>
                    <p class="title-2 notranslate">
                        {{ item.subtitle || 'Hero subtitle description...' }}
                    </p>
                </AnimatedAppear>

                <AnimatedAppear>
                    <Link
                        v-if="item.button_link"
                        :href="item.button_link"
                        class="btn btn-secondary notranslate">
                        {{ item.button_text || 'Learn More' }}
                    </Link>
                </AnimatedAppear>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'VideoHeroAlternative',
    props: {
        item: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            isMobile: false,
            isVideoPlaying: true,
            isVideoMuted: true,
            showVideoControls: false,
            thumbnailQuality: 'maxresdefault'
        }
    },

    mounted() {
        this.detectDevice();
        this.setupVideoHandlers();
    },

    methods: {
        detectDevice() {
            this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        },

        setupVideoHandlers() {
            if (this.item.video_file_url) {
                this.$nextTick(() => {
                    const video = this.$refs.videoElement;
                    if (video) {
                        // Start with controls hidden for clean autoplay
                        this.showVideoControls = false;
                        
                        // Show controls on hover/interaction only
                        video.addEventListener('mouseenter', () => {
                            this.showVideoControls = true;
                        });
                        
                        video.addEventListener('mouseleave', () => {
                            this.showVideoControls = false;
                        });
                    }
                });
            }
        },

        // YouTube Methods
        isYouTube(url) {
            if (!url) return false;
            return /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i.test(url);
        },

        getYouTubeId(url) {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        },

        getYouTubeThumbnail(url, quality = 'maxresdefault') {
            const videoId = this.getYouTubeId(url);
            if (!videoId) return '/cover.jpg';
            
            // Quality options: maxresdefault, hqdefault, mqdefault, sddefault
            return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
        },

        getYouTubeEmbedUrl(url) {
            const videoId = this.getYouTubeId(url);
            if (!videoId) return '';

            const params = new URLSearchParams({
                autoplay: '1',
                mute: '1',
                loop: '1',
                playlist: videoId,
                controls: '0',
                playsinline: '1',
                modestbranding: '1',
                rel: '0'
            });

            return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        },

        openYouTubeVideo() {
            const videoId = this.getYouTubeId(this.item.video_url);
            if (!videoId) return;

            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // iOS: Try app first, fallback to web
                const appUrl = `youtube://watch?v=${videoId}`;
                
                // Create temporary link
                const link = document.createElement('a');
                link.href = appUrl;
                link.style.display = 'none';
                document.body.appendChild(link);
                
                try {
                    link.click();
                    // Fallback to web after 1.5s
                    setTimeout(() => {
                        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                    }, 1500);
                } catch (error) {
                    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                } finally {
                    document.body.removeChild(link);
                }
            } else {
                // Other devices: Direct web link
                window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
            }
        },

        handleThumbnailError(event) {
            // Fallback to lower quality thumbnail
            if (this.thumbnailQuality === 'maxresdefault') {
                this.thumbnailQuality = 'hqdefault';
                event.target.src = this.getYouTubeThumbnail(this.item.video_url, 'hqdefault');
            } else if (this.thumbnailQuality === 'hqdefault') {
                this.thumbnailQuality = 'mqdefault';
                event.target.src = this.getYouTubeThumbnail(this.item.video_url, 'mqdefault');
            } else {
                // Final fallback to item image
                event.target.src = this.item.image_url || '/cover.jpg';
            }
        },

        // Video File Methods
        onVideoLoadStart() {
            console.log('Video loading started');
        },

        onVideoCanPlay() {
            console.log('Video can play');
            this.showVideoControls = true;
        },

        onVideoError(event) {
            console.error('Video error:', event);
            // Could fallback to image here
        },

        toggleVideoPlayback() {
            const video = this.$refs.videoElement;
            if (!video) return;

            if (video.paused) {
                video.play();
                this.isVideoPlaying = true;
            } else {
                video.pause();
                this.isVideoPlaying = false;
            }
        },

        toggleVideoMute() {
            const video = this.$refs.videoElement;
            if (!video) return;

            video.muted = !video.muted;
            this.isVideoMuted = video.muted;
        }
    }
}
</script>

<style scoped>
/* Video Controls */
.video-control-btn {
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.video-control-btn:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
}

/* Clickable thumbnail styling */
.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer img {
    transition: transform 0.3s ease;
}

.cursor-pointer:hover img {
    transform: scale(1.02);
}

/* Video Element Styling */
video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
}

/* iOS Safari Fixes */
@supports (-webkit-appearance: none) {
    video {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
}

/* Accessibility */
.video-control-btn:focus {
    outline: 2px solid #007AFF;
    outline-offset: 2px;
}

.cursor-pointer:focus {
    outline: 3px solid #007AFF;
    outline-offset: 4px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .cursor-pointer:hover img {
        transform: none;
    }
    
    .video-control-btn:hover {
        transform: none;
    }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .cursor-pointer img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
}
</style>