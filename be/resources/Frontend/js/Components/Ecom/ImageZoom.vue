<template>
    <div class="image-wrapper" ref="imageWrapper">
        <img :src="url" class="image-product" ref="imageProduct" />
        <div
            class="image-cover"
            ref="imageCover"
            :class="{ isZoom: isZoom }"
            @click="onToggleZoom"
        ></div>
    </div>
</template>
<script>
export default {
    props: ["isZoom", "url"],
    data() {
        return {
            isReadyZoom: false,
        };
    },
    mounted() {
        const { imageCover } = this.$refs;
        imageCover.addEventListener("mousemove", this.handleHoverImage, false);
        imageCover.addEventListener("touchmove", this.onTouchmoveImage, false);

        imageCover.addEventListener(
            "touchstart",
            this.onTouchstartImage,
            false
        );
        imageCover.addEventListener("touchend", this.onTouchendImage, false);
    },
    unmounted() {
        const { imageCover } = this.$refs;
        imageCover?.removeEventListener("mousemove", this.handleHoverImage);
        imageCover?.removeEventListener("touchmove", this.onTouchmoveImage);
        imageCover?.removeEventListener(
            "touchstart",
            this.onTouchstartImage,
            false
        );
        imageCover?.removeEventListener(
            "touchend",
            this.onTouchendImage,
            false
        );
    },
    watch: {
        isZoom(newZoom) {
            const { imageProduct } = this.$refs;
            if (!imageProduct) return;

            if (newZoom) {
                imageProduct.style =
                    "width: 200%; height: 200%; max-height: unset";
            } else {
                imageProduct.style = "";
            }
        },
    },

    methods: {
        onTouchstartImage() {
            this.isReadyZoom = true;
        },
        onTouchendImage() {
            const { imageProduct } = this.$refs;
            imageProduct.style = "";
            this.isReadyZoom = false;
        },
        onToggleZoom() {
            const isScreenXL = window.matchMedia("(min-width: 1280px)").matches;
            if (!isScreenXL) return;
            this.$emit("toggleZoom");
        },
        onTouchmoveImage(event) {
            if (!this.isReadyZoom) return;
            var touch = event.touches[0];
            var pX = touch.clientX;
            var pY = touch.clientY;
            this.onZoomImageByFinger({ pX, pY });
        },

        handleHoverImage(event) {
            if (!this.isZoom) return;
            const { clientY, clientX } = event;
            const pX = clientX;
            const pY = clientY;
            this.onZoomImage({ pX, pY });
        },
        onZoomImage({ pX, pY }) {
            const { imageProduct, imageWrapper } = this.$refs;
            const imageWrapperWidth = imageWrapper.offsetWidth;
            const imageWrapperHeight = imageWrapper.offsetHeight;

            imageProduct.style = "width: 200%; height: 200%; max-height: unset";
            let imageWidth = imageProduct.offsetWidth;
            let imageHeight = imageProduct.offsetHeight;

            let spaceX = (imageWidth / 2 - imageWrapperWidth) * 2;
            let spaceY = (imageHeight / 2 - imageWrapperHeight) * 2;

            imageWidth = imageWidth + spaceX;
            imageHeight = imageHeight + spaceY;

            let ratioX = imageWidth / imageWrapperWidth / 2;
            let ratioY = imageHeight / imageWrapperHeight / 2;

            const { left: imageWrapperLeft, top: imageWrapperTop } =
                imageWrapper.getBoundingClientRect();

            let x = (pX - imageWrapperLeft) * ratioX;
            let y = (pY - imageWrapperTop) * ratioY;

            imageProduct.style = `left: ${-x}px; top: ${-y}px; width: 200%; height: 200%; max-height: unset; transform: none;`;
        },

        onZoomImageByFinger({ pX, pY }) {
            const { imageProduct, imageWrapper } = this.$refs;
            const imageWrapperWidth = imageWrapper.offsetWidth;
            const imageWrapperHeight = imageWrapper.offsetHeight;

            imageProduct.style = "width: 200%; height: 200%; max-height: unset";
            let imageWidth = imageProduct.offsetWidth;
            let imageHeight = imageProduct.offsetHeight;

            let ratioX = imageWidth / imageWrapperWidth / 2;
            let ratioY = imageHeight / imageWrapperHeight / 2;

            const { right: imageWrapperRight, bottom: imageWrapperBottom } =
                imageWrapper.getBoundingClientRect();

            let x = (pX - imageWrapperRight) * ratioX;
            let y = (pY - imageWrapperBottom) * ratioY;
            imageProduct.style = `left: ${x}px; top: ${y}px; width: 200%; height: 200%; max-height: unset; transform: none;`;
        },
    },
};
</script>

<style lang="scss" scoped>
.image-wrapper {
    max-height: 900px;
    max-width: 900px;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
.image-product {
    object-fit: contain;
    max-height: 100%;
    max-width: unset;
    position: relative;
    top: 50%;
    left: 50%;
    width: 100%;
    height: auto;
    transform: translate(-50%, -50%);
}
.image-cover {
    cursor: zoom-in;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    touch-action: none;

    &.isZoom {
        cursor: zoom-out;
    }
}
</style>
