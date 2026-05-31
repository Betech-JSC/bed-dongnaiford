<template>
    <div class="relative group rounded-[24px] overflow-hidden px-3 pt-3 pb-7 space-y-6 bg-white block h-full">
        <div class="relative aspect-w-1 aspect-h-1 overflow-hidden">
            <JPicture
                :src="item.image_url"
                :alt="item.text"
                wrapperClass="picture-cover h-full w-full lg:group-hover:scale-105 duration-300 ease-in-out"
                class="w-full h-full object-cover"
            />
        </div>
        <div class="title-2 font-bold text-[#2F49D9] lg:group-hover:text-primary-600 line-clamp-2 min-h-[52px] duration-300 ease-in-out">
            {{ item.text }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['item'],
}
</script>
