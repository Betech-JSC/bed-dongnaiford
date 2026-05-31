<template>
    <div class="flex items-center w-full h-full">
        <div v-if="isVideo(staticUrl(file.path))" class="relative w-full h-full flex items-center justify-center bg-black">
            <video muted playsinline class="object-contain w-full h-full" onmouseover="this.play()" onmouseout="this.pause()">
                <source :src="staticUrl(file.path)" type="video/mp4" />
            </video>
        </div>
        <v-lazy-image v-else :src="`${staticUrl(file.path)}?w=200`" class="object-contain w-full h-full" />
        <a
            class="absolute top-0 right-0 invisible space-x-1 text-white uppercase bg-black group-hover:visible w-[20px] h-[20px] flex items-center justify-center rounded-sm"
            :href="staticUrl(file.path)"
            target="_blank"
        >
            <ph:arrow-square-up-right />
        </a>
        <Button
            class="absolute invisible right-1 bottom-1 group-hover:visible btn-white btn-sm"
            :label="tt('models.files.delete')"
            @click="$emit('remove', file)"
        />
    </div>
</template>

<script>
import VLazyImage from 'v-lazy-image'
import 'plyr/dist/plyr.css'
export default {
    components: { VLazyImage },
    props: ['file'],

    methods: {
        isVideo(url) {
            return (
                url.endsWith('.mp4') ||
                url.endsWith('.avi') ||
                url.endsWith('.mov') ||
                url.endsWith('.wmv') ||
                url.endsWith('.flv') ||
                url.endsWith('.mkv')
            )
        },
    },
}
</script>

<style scoped>
.v-lazy-image {
    filter: blur(10px);
    transition: filter 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    will-change: filter;
}
.v-lazy-image-loaded {
    filter: blur(0);
}
</style>
