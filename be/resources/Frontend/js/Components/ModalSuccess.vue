<template>
    <div class="fixed top-0 inset-x-0 w-full h-full z-[1001]" v-if="isSuccess">
        <div
            class="absolute top-0 left-0 z-[150] w-full h-full duration-300 ease-in-out bg-gray-700 bg-opacity-70"
            :class="isSuccess ? 'opacity-100' : 'opacity-0'"
            @click="close"
        ></div>
        <div
            class="w-[340px] md:w-[600px] xl:p-6 md:p-5 p-4 bg-white absolute duration-300 ease-in-out rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center z-[200]"
        >
            <Close
                @click="close"
                class="absolute text-gray-500 cursor-pointer xl:top-4 md:top-3 top-1 xl:right-4 md:right-3 right-1 lg:hover:text-green-default lg:duration-150"
            />
            <div class="w-14 h-14 xl:mb-5 md:mb-4 mb-2.5">
                <JPicture src="/assets/images/contact/success-icon.png" class="picture-cover" alt="success icon" />
            </div>
            <div class="space-y-2">
                <div class="text-gray-900 title-1">{{ title }}</div>
                <div class="text-gray-700 body-1">
                    {{ description }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Close from '@/Components/Icons/Close.vue'
export default {
    props: {
        isSuccess: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
    },
    components: { Close },
    methods: {
        close() {
            this.$emit('close')
        },
    },
}
</script>
