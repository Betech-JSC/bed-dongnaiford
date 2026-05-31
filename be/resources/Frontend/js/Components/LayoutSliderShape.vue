<template>
    <div class="relative py-8">
        <div class="absolute top-0 -left-6 fullscreen">
            <JPicture src="/assets/images/products/bg-shape.png" alt="background shape" class="max-w-[1064px] w-full h-full object-cover" />
        </div>
        <div class="relative space-y-6">
            <div class="space-y-3 headline-2 font-bold">
                <h2>Chúng tôi <span class="relative z-10">cung cấp<div class="absolute left-0 bottom-0.5 z-[-1] w-full h-1.5 bg-primary-400"></div></span></h2>
                <h2>Những phương pháp hiệu quả <span class="relative z-10">tối ưu<div class="absolute left-0 bottom-0.5 z-[-1] w-full h-1.5 bg-primary-400"></div></span></h2>
            </div>
        <div class="fullscreen">
            <slot />
        </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hasBg: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
        href: {
            type: String,
            default: '',
        },
        linkLabel: {
            type: String,
            default: 'Khám phá thêm',
        },
        showLink: {
            type: Boolean,
            default: true,
        },

    },
}
</script>
<style lang="scss" scoped>
.fullscreen {
    width: 100dvw;
    margin: 0;
}
</style>
