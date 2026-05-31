<template>
    <div id="wrapper" ref="wrapperZoom">
        <div id="wrapper-image" ref="imageZoom">
            <img :src="url" />
        </div>
    </div>
</template>
<script>
export default {
    props: ["isZoom", "url"],
    data() {
        return {
            scale: 1,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0,
            currentY: 0,
            currentX: 0,
            currentXInit: 0,
            currentYInit: 0,
            dragging: false,
        };
    },
    watch: {
        isZoom(newVal) {
            if (newVal) {
                this.scale = 2.5;
                this.updateImage();
                document.body.classList.add("overflow-hidden");
                document.body.classList.add("active-zoom");
                this.setInitEvent();
            } else {
                document.body.classList.remove("active-zoom");
                document.body.classList.remove("overflow-hidden");
                this.removeEvent();
            }
        },
    },

    unmounted() {
        this.removeEvent();
    },

    methods: {
        removeEvent() {
            const { imageZoom } = this.$refs;
            this.scale = 1;
            if (!imageZoom) return;
            this.updateImage();
            imageZoom.removeEventListener(
                "touchstart",
                this.onMousedown,
                false
            );
            imageZoom.removeEventListener("touchend", this.onMouseup, false);
            imageZoom.removeEventListener("touchmove", this.onMousemove, false);
        },
        setInitEvent() {
            const { imageZoom } = this.$refs;
            imageZoom.addEventListener("touchstart", this.onMousedown, false);
            imageZoom.addEventListener("touchend", this.onMouseup, false);
            imageZoom.addEventListener("touchmove", this.onMousemove, false);
        },
        onMousemove(e) {
            if (this.dragging) {
                const { imageZoom } = this.$refs;
                var touch = e.touches[0];

                let dx = touch.clientX - this.startX;
                let dy = touch.clientY - this.startY;

                const currentX = this.startLeft + dx / this.scale;
                const currentY = this.startTop + dy / this.scale;
                this.currentX = this.currentXInit + currentX;
                this.currentY = this.currentYInit + currentY;

                imageZoom.style.transform = `scale(${this.scale}) translate(${this.currentX}px, ${this.currentY}px)`;
            }
        },
        onMousedown(e) {
            const { imageZoom } = this.$refs;
            var touch = e.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;

            this.currentXInit = this.currentX;
            this.currentYInit = this.currentY;

            this.startLeft = imageZoom.offsetLeft;
            this.startTop = imageZoom.offsetTop;
            this.dragging = true;
        },

        onMouseup() {
            this.dragging = false;
        },
        onWheel(e) {
            e.preventDefault();
            let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
            if (delta > 0) {
                this.scale *= 1.1;
            } else {
                this.scale = 1;
            }
            this.updateImage();
        },

        updateImage() {
            const { imageZoom, wrapperZoom } = this.$refs;
            imageZoom.style.transform = `scale(${this.scale}) translate(${
                (wrapperZoom.offsetWidth - imageZoom.offsetWidth) / 2
            }px, ${(wrapperZoom.offsetHeight - imageZoom.offsetHeight) / 2}px)`;
        },
    },
};
</script>

<style lang="scss" scoped>
#wrapper {
    max-height: 900px;
    max-width: 900px;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

#wrapper-image {
    margin: auto;
    widows: 100%;
    height: 100%;
}

#wrapper-image img {
    widows: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    margin: auto;
}
</style>
