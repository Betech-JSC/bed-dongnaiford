<template>
    <div
        :id="`slider_${fieldId}`"
        :ref="`slider_${fieldId}`"
        class="jam-slider"
        :style="styleConfig"
    >
        <div
            :ref="`slide-container_${fieldId}`"
            class="jam-slider__container"
            @scroll="onScroll()"
            @mouseover="stopAutoPlay()"
            @mouseout="startAutoPlay()"
        >
            <slot :current="current" />
        </div>
        <div class="jam-slider__dots">
            <slot
                v-if="$slots.dots"
                name="dots"
                :dots="parseInt(dots)"
                :navigate="navigate"
                :current="current"
                class="jam-slider__dots"
            />
        </div>
        <div
            v-if="$slots.arrows"
            class="jam-slider__arrows hidden"
            @mouseover="stopAutoPlay()"
        >
            <slot name="arrows" :navigate="navigate" :current="current" />
        </div>
    </div>
</template>
<script>
const defaultBreakpoints = ["sm", "md", "lg", "xl", "2xl"];
const defaultConfig = {
    cols: 5,
    gutter: "12px",
    align: "center",
    loop: false,
};
export default {
    props: {
        config: {
            type: Object,
        },
        breakpoints: {
            type: Object,
        },
        autoplay: {
            type: [Number, Boolean, Object],
            default: false,
        },
        slidesPerView: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            current: 0,
            autoplayInterval: null,
            breakpoint: null,
            currentCols: parseFloat(this.config.cols),
        };
    },
    computed: {
        sliderConfig() {
            return { ...defaultConfig, ...this.config };
        },

        styleConfig() {
            let config = {};

            Object.entries(this.sliderConfig).forEach((x) => {
                config["--slider-init-" + x[0]] = x[1];
                Object.entries(defaultBreakpoints).forEach((breakpoint) => {
                    const breakpointConfig = `${breakpoint[1]}-${x[0]}`;
                    if (
                        this.breakpoints &&
                        this.breakpoints[breakpoint[1]] &&
                        this.breakpoints[breakpoint[1]][x[0]]
                    ) {
                        config[`--slider-init-${breakpointConfig}`] =
                            this.breakpoints[breakpoint[1]][x[0]];
                    } else {
                        config[`--slider-init-${breakpointConfig}`] = x[1];
                    }
                });
            });

            return config;
        },

        fieldId() {
            return Math.random().toString(36).substr(2, 9);
        },

        slider() {
            return this.$refs[`slide-container_${this.fieldId}`];
        },

        slides() {
            return this.slider.querySelectorAll(".jam-slide");
        },

        dots() {
            return this.config.total / this.currentCols;
        },

        autoplayDelay() {
            const type = typeof this.autoplay;
            const defaultDelay = 3000;

            if (type === "boolean" && !!this.autoplay) {
                return defaultDelay;
            } else if (type === "number") {
                return this.autoplay;
            } else if (type === "object") {
                return this.autoplay.delay;
            } else {
                return null;
            }
        },

        slidesPerViewOption() {
            return this.slidesPerView || this.currentCols;
        },
    },

    mounted() {
        this.startAutoPlay();
        this.setCurrentCols();
        window.addEventListener("resize", this.setCurrentCols);
    },

    unmounted() {
        window.removeEventListener("resize", this.setCurrentCols);
    },

    methods: {
        navigate(arg) {
            this.$refs[`slide-container_${this.fieldId}`]?.scrollTo({
                top: 0,
                left: this.getNewScrollPosition(arg),
                behavior: "smooth",
            });
        },

        // Ref code: https://web.dev/patterns/web-vitals-patterns/carousels/carousel-autoplay/
        getNewScrollPosition(arg) {
            const slideContainerEl =
                this.$refs[`slide-container_${this.fieldId}`];

            const gapWidth = parseFloat(this.sliderConfig.gutter);
            const scrollLeft = slideContainerEl.scrollLeft;
            const scrollWidth = slideContainerEl.scrollWidth;

            const itemWidth = slideContainerEl.scrollWidth / this.config.total;
            const itemsPerViewWidth = itemWidth * this.slidesPerViewOption;
            const itemsPerScreenWidth = itemWidth * this.currentCols;

            const maxScrollPerViewLeft = scrollWidth - itemsPerViewWidth;
            const maxScrollPerScreenLeft = scrollWidth - itemsPerScreenWidth;

            let x, y;
            if (arg === "next") {
                x = scrollLeft + itemsPerScreenWidth;
                y = scrollLeft + itemsPerViewWidth;

                if (x >= scrollWidth) {
                    return 0;
                } else if (y <= maxScrollPerViewLeft) {
                    return y;
                } else {
                    return scrollWidth - itemWidth;
                }
            } else if (arg === "prev") {
                x = scrollLeft - itemWidth;
                return x >= -gapWidth ? x : maxScrollPerScreenLeft;
            } else if (typeof arg === "number") {
                return arg * itemWidth;
            }
        },

        // Ref code: https://github.com/tannerhodges/snap-slider/blob/main/src/snap-slider.js#L1013
        getClosest() {
            return Array.from(this.slides).reduce((prev, slide, index) => {
                const offset = this.getScrollOffset(slide);
                const diff = {
                    top: Math.abs(this.slider.scrollTop - offset.top),
                    left: Math.abs(this.slider.scrollLeft - offset.left),
                };
                const next = { index, slide, diff };

                if (!prev) {
                    return next;
                }

                if (
                    next.diff.left <= prev.diff.left &&
                    next.diff.top <= prev.diff.top
                ) {
                    return next;
                }
                return prev;
            }, false);
        },

        getScrollOffset(slide) {
            const align = this.sliderConfig.align;
            let top = slide.offsetTop;
            let left = slide.offsetLeft;
            if (align.indexOf("center") >= 0) {
                top =
                    slide.offsetTop +
                    slide.offsetHeight / 2 -
                    this.slider.offsetHeight / 2;
                left =
                    slide.offsetLeft +
                    slide.offsetWidth / 2 -
                    this.slider.offsetWidth / 2;
            } else if (align.indexOf("end") >= 0) {
                top =
                    slide.offsetTop -
                    this.slider.offsetHeight +
                    slide.offsetHeight;
                left =
                    slide.offsetLeft -
                    this.slider.offsetWidth +
                    slide.offsetWidth;
            }
            top = this.minmax(top, 0, this.slider.scrollHeight);
            left = this.minmax(left, 0, this.slider.scrollWidth);
            return { top, left };
        },

        minmax(value, min, max) {
            value = Math.min(max, value);
            value = Math.max(min, value);
            return value;
        },

        onScroll() {
            const closest = this.getClosest();
            if (closest.index !== this.current) {
                this.current = closest.index;
                this.$emit("onChangeSlide", this.current);
            }
        },

        startAutoPlay() {
            if (!this.autoplayDelay) return;

            this.autoplayInterval = setInterval(
                () => this.navigate("next"),
                this.autoplayDelay
            );
        },

        stopAutoPlay() {
            clearInterval(this.autoplayInterval);
        },

        setCurrentCols() {
            const slider = document.getElementById(`slider_${this.fieldId}`);
            const propertyName = `--slider-init-${this.getBreakpoint()}-cols`;

            this.currentCols = parseFloat(
                this.getPropertyOf(slider, propertyName)
            );
        },

        getPropertyOf(element, property) {
            return getComputedStyle(element).getPropertyValue(property);
        },

        getBreakpoint() {
            return window
                .getComputedStyle(document.body, ":before")
                .content.replace(/"/g, "");
        },
    },
};
</script>

<style lang="scss">
body:before {
    content: "sm";
    @apply absolute -left-full invisible;
}
@screen md {
    body:before {
        content: "md";
    }
}
@screen lg {
    body:before {
        content: "lg";
    }
}
@screen xl {
    body:before {
        content: "xl";
    }
}

.jam-slider {
    @apply w-full;
    --slider-align: var(--slider-init-align);
    --slider-cols: var(--slider-init-cols);
    --slider-gutter: var(--slider-init-gutter);

    @screen sm {
        --slider-align: var(--slider-init-sm-align, var(--slider-init-align));
        --slider-cols: var(--slider-init-sm-cols, var(--slider-init-cols));
        --slider-gutter: var(
            --slider-init-sm-gutter,
            var(--slider-init-gutter)
        );
    }

    @screen md {
        --slider-align: var(
            --slider-init-md-align,
            var(--slider-init-sm-align)
        );
        --slider-cols: var(--slider-init-md-cols, var(--slider-init-sm-cols));
        --slider-gutter: var(
            --slider-init-md-gutter,
            var(--slider-init-sm-gutter)
        );
    }

    @screen lg {
        --slider-align: var(
            --slider-init-lg-align,
            var(--slider-init-md-align)
        );
        --slider-cols: var(--slider-init-lg-cols, var(--slider-init-md-cols));
        --slider-gutter: var(
            --slider-init-lg-gutter,
            var(--slider-init-md-gutter)
        );
    }

    @screen xl {
        --slider-align: var(
            --slider-init-xl-align,
            var(--slider-init-lg-align)
        );
        --slider-cols: var(--slider-init-xl-cols, var(--slider-init-lg-cols));
        --slider-gutter: var(
            --slider-init-xl-gutter,
            var(--slider-init-lg-gutter)
        );
    }

    .jam-slider {
        &__container {
            -ms-overflow-style: none;
            scrollbar-width: none;
            @apply relative flex w-full overflow-x-auto snap-x snap-mandatory;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

    .jam-slide {
        scroll-snap-align: var(--slider-align);
        width: calc(100% / var(--slider-cols));
        padding: 0 calc(var(--slider-gutter) / 2);
    }
}
</style>
