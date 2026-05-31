<template>
    <div class="relative" :class="hasBg ? 'py-8' : ''">
        <div v-if="hasBg" class="absolute inset-0 fullscreen">
            <svg width="100%" height="100%" viewBox="0 0 1064 404" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1064 0H280C125.36 0 0 125.36 0 280V404H1064V0Z" fill="#FFDED4"/>
            </svg>
        </div>
        <div class="relative space-y-6">
            <div class="flex items-center justify-between gap-2">
            <h2 class="headline-2 font-bold text-gray-900 notranslate">{{ title }}</h2>
            <Link v-if="href && showLink" :href="href" class="btn btn-secondary">
                {{ linkLabel }}
            </Link>
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
}
</style>