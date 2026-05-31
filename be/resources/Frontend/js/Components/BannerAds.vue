<template>
    <a v-if="item" :href="item.link" :target="item.target || '_blank'">
        <JPicture
            wrapperClass="picture-contain"
            :src="item.image && item.image.url ? item.image.url : '/assets/images/cover.jpg'"
            :mobileSrc="
                item.image_mobile && item.image_mobile.url
                    ? item.image_mobile.url
                    : item.image && item.image.url
                    ? item.image.url
                    : '/assets/images/cover.jpg'
            "
            :alt="item.image.alt"
        />
    </a>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: null,
        },
    },
}
</script>
