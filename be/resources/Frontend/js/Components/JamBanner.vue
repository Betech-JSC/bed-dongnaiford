<template>
    <section class="banner">
        <div class="banner-image">
            <JPicture :src="image.url" :alt="image.alt" loading="eager" wrapperClass="picture-cover" />
            <slot />
        </div>
    </section>
</template>
<script>
import JPicture from '@core/components/JPicture.vue'
export default {
    components: { JPicture },
    props: {
        image: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
}
</script>
