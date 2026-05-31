<template>
   <div class="bg-white rounded-[10px] p-3 space-y-6">
        <div class="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center" :style="`background: ${item.color}`" translate="no">
            <div v-html="item.icon"></div>
        </div>
        <div class="space-y-1">
            <h3 class="title-3 font-bold min-h-[48px]" translate="no">{{ item.title }}</h3>
            <div class="body-2 text-gray-400 min-h-[66px]" translate="no">{{ item.description }}</div>
        </div>
   </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
