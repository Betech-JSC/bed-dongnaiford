/**
 * YouTube Autoplay Helper
 * Xử lý autoplay YouTube trên Safari và các browser khác
 */

class YouTubeAutoplayHelper {
    constructor() {
        this.apiLoaded = false;
        this.apiLoading = false;
        this.callbacks = [];
    }

    /**
     * Load YouTube IFrame API
     */
    loadYouTubeAPI() {
        return new Promise((resolve, reject) => {
            // Nếu API đã load
            if (window.YT && window.YT.Player) {
                this.apiLoaded = true;
                resolve();
                return;
            }

            // Nếu đang load
            if (this.apiLoading) {
                this.callbacks.push({ resolve, reject });
                return;
            }

            this.apiLoading = true;

            // Tạo script tag
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;

            // Callback khi API ready
            window.onYouTubeIframeAPIReady = () => {
                this.apiLoaded = true;
                this.apiLoading = false;
                
                resolve();
                
                // Resolve tất cả callbacks đang chờ
                this.callbacks.forEach(callback => callback.resolve());
                this.callbacks = [];
            };

            script.onerror = () => {
                this.apiLoading = false;
                reject(new Error('Failed to load YouTube API'));
                
                this.callbacks.forEach(callback => callback.reject(new Error('Failed to load YouTube API')));
                this.callbacks = [];
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Detect browser type
     */
    detectBrowser() {
        const userAgent = navigator.userAgent;
        return {
            isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
            isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
            isChrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
            isFirefox: /Firefox/.test(userAgent),
            isMobile: /Mobi|Android/i.test(userAgent)
        };
    }

    /**
     * Extract YouTube video ID from URL
     */
    getYouTubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * Generate YouTube embed URL with optimal parameters for each browser
     */
    generateEmbedUrl(videoUrl, options = {}) {
        const videoId = this.getYouTubeId(videoUrl);
        if (!videoId) return '';

        const browser = this.detectBrowser();
        
        const defaultParams = {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            ...options
        };

        // Safari-specific parameters
        if (browser.isSafari || browser.isIOS) {
            defaultParams.origin = window.location.origin;
            defaultParams.widget_referrer = window.location.href;
            // Safari thường cần user interaction, nên tắt autoplay ban đầu
            if (!options.forceAutoplay) {
                defaultParams.autoplay = 0;
            }
        }

        const paramString = Object.entries(defaultParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        return `https://www.youtube.com/embed/${videoId}?${paramString}`;
    }

    /**
     * Create YouTube player with autoplay handling
     */
    async createPlayer(element, videoUrl, options = {}) {
        const videoId = this.getYouTubeId(videoUrl);
        if (!videoId) throw new Error('Invalid YouTube URL');

        const browser = this.detectBrowser();

        // Load API if needed
        if (!this.apiLoaded) {
            await this.loadYouTubeAPI();
        }

        return new Promise((resolve, reject) => {
            const playerVars = {
                autoplay: 1,
                mute: 1,
                loop: 1,
                playlist: videoId,
                controls: 0,
                playsinline: 1,
                modestbranding: 1,
                rel: 0,
                ...options.playerVars
            };

            // Safari/iOS specific handling
            if (browser.isSafari || browser.isIOS) {
                playerVars.autoplay = 0; // Tắt autoplay ban đầu
            }

            const player = new window.YT.Player(element, {
                videoId: videoId,
                playerVars: playerVars,
                events: {
                    onReady: (event) => {
                        // Thử autoplay nếu không phải Safari/iOS
                        if (!browser.isSafari && !browser.isIOS) {
                            try {
                                event.target.playVideo();
                            } catch (error) {
                                console.log('Autoplay failed:', error);
                            }
                        }
                        
                        resolve({
                            player: event.target,
                            needsUserInteraction: browser.isSafari || browser.isIOS
                        });
                    },
                    onStateChange: (event) => {
                        if (options.onStateChange) {
                            options.onStateChange(event);
                        }
                    },
                    onError: (event) => {
                        reject(new Error(`YouTube player error: ${event.data}`));
                    }
                }
            });
        });
    }

    /**
     * Handle user interaction for Safari/iOS
     */
    handleUserInteraction(player, videoId) {
        if (!player) return false;

        try {
            // Thử play video
            player.playVideo();
            
            // Nếu cần, update player vars để enable autoplay
            player.loadVideoById({
                videoId: videoId,
                startSeconds: 0,
                suggestedQuality: 'default'
            });

            return true;
        } catch (error) {
            console.log('Failed to play video:', error);
            return false;
        }
    }

    /**
     * Fallback method: reload iframe with autoplay
     */
    reloadIframeWithAutoplay(iframe, videoUrl) {
        if (!iframe || !videoUrl) return;

        const newUrl = this.generateEmbedUrl(videoUrl, { forceAutoplay: true });
        
        // Store current src and clear
        const currentSrc = iframe.src;
        iframe.src = '';

        // Reload with new parameters
        setTimeout(() => {
            iframe.src = newUrl;
        }, 100);
    }

    /**
     * Check if autoplay is likely to work
     */
    canAutoplay() {
        const browser = this.detectBrowser();
        
        // Safari và iOS thường block autoplay
        if (browser.isSafari || browser.isIOS) {
            return false;
        }

        // Chrome, Firefox thường cho phép autoplay với muted
        return true;
    }

    /**
     * Get optimal strategy for current browser
     */
    getAutoplayStrategy() {
        const browser = this.detectBrowser();

        if (browser.isSafari || browser.isIOS) {
            return {
                strategy: 'user-interaction',
                showPlayButton: true,
                autoplayOnLoad: false,
                message: 'Safari/iOS requires user interaction for video playback'
            };
        }

        if (browser.isChrome || browser.isFirefox) {
            return {
                strategy: 'auto',
                showPlayButton: false,
                autoplayOnLoad: true,
                message: 'Autoplay should work with muted video'
            };
        }

        return {
            strategy: 'fallback',
            showPlayButton: true,
            autoplayOnLoad: true,
            message: 'Unknown browser, using fallback strategy'
        };
    }
}

// Export singleton instance
export default new YouTubeAutoplayHelper();