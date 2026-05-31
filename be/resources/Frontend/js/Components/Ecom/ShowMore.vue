<template>
    <div class="relative">
        <div
            ref="contentShowMore"
            class="overflow-hidden"
            :class="!isToggleShow ? `max-h-[500px]` : 'max-h-fit'"
        >
            <slot />
        </div>
        <!-- Layer -->
        <div
            v-if="isShowMore && !isToggleShow"
            class="h-[120px] lg:h-[150px] w-full absolute bottom-0 inset-x-0 layer-white"
        ></div>

        <div
            v-if="isShowMore"
            @click="toggleShowMore()"
            class="relative z-10 flex justify-center mt-3 md:mt-4"
        >
            <ButtonShowMore :isShow="isToggleShow" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isShowMore: true,
            isToggleShow: false,

            realHeight: null,
            viewerHeight: null,
        };
    },
    mounted() {
        const { contentShowMore } = this.$refs;
        this.viewerHeight = contentShowMore.offsetHeight;
        this.realHeight = contentShowMore.scrollHeight;

        if (this.viewerHeight === this.realHeight) {
            this.isShowMore = false;
        }
    },

    methods: {
        toggleShowMore() {
            this.isToggleShow = !this.isToggleShow;
        },
    },
};
</script>
<style lang="scss" scoped>
.layer-white {
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 56.56%
    );
}
</style>
