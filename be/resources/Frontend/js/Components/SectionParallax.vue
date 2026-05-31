<template>
    <section
        class="parallax-section relative overflow-hidden bg-fixed bg-center bg-cover after:contents-[''] after:bg-black/30 after:absolute after:inset-0 h-[450px] lg:h-[600px] xl:h-[800px]"
        :style="{ backgroundImage: `url(${image})` }"
    >
        <div class="relative z-10 h-full flex items-center justify-center">
            <div class="container">
                <h2 class="display-1 !font-sans text-linear text-center">
                    {{ title }}
                </h2>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
})

const offset = ref(0)

const handleScroll = () => {
    offset.value = window.pageYOffset * 0.5
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.parallax-section {
    min-height: 400px;
}

.parallax-bg {
    min-height: 120%;
    will-change: transform;
}

.text-linear {
    background: linear-gradient(91.48deg, rgba(255, 251, 239, 0.45) 2.89%, rgba(255, 251, 239, 0.72) 29.24%, rgba(255, 251, 239, 0.9) 82.89%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}
</style>
