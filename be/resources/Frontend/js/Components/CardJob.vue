<template>
    <Link
        :href="route('jobs.show', { slug: item.slug })"
        class="flex md:flex-row flex-col xl:space-x-16 lg:space-x-12 md:space-x-6 rounded-lg border border-gray-300 bg-white lg:hover:border-blue-dark-700 lg:duration-150 xl:px-8 md:px-[22px] px-4 xl:py-[26px] md:py-[18px] py-3"
    >
        <div
            class="xl:w-[320px] lg:w-[240px] md:w-[220px] w-full flex-shrink-0 line-clamp-2 title-3 text-gray-900 max-md:mb-2"
        >
            {{ item.title }}
        </div>
        <div class="xl:w-[560px] flex-shrink-0 xl:space-x-16 lg:space-x-12 md:space-x-6 md:flex max-md:space-y-2">
            <div
                class="xl:w-[176px] md:w-[160px] w-full flex-shrink-0 md:text-center max-md:flex max-md:items-center"
                v-if="item.work_address"
            >
                <div class="mb-2 text-gray-700 body-2 max-md:hidden">{{ tt('Nơi làm việc') }}</div>
                <div class="flex-shrink-0 mr-1 text-gray-700 body-2 md:hidden">{{ tt('Nơi làm việc:') }}</div>
                <div class="text-gray-900 title-3 line-clamp-2">{{ item.work_address }}</div>
            </div>
            <div class="flex xl:space-x-16 lg:space-x-12 md:space-x-6">
                <div class="xl:w-[176px] md:w-[146px] w-1/2 flex-shrink-0 md:text-center" v-if="item.expected_time">
                    <div class="mb-2 text-gray-700 body-2">{{ tt('Hạn nộp hồ sơ') }}</div>
                    <div class="text-gray-900 title-3">{{ getCreatedDate(item.expected_time) }}</div>
                </div>
                <div class="xl:w-[80px] md:w-[60px] w-1/2 flex-shrink-0 text-right" v-if="item.quantity">
                    <div class="mb-2 text-gray-700 body-2">{{ tt('Số lượng') }}</div>
                    <div class="text-gray-900 title-3">{{ checkQuantity(item.quantity) }}</div>
                </div>
            </div>
        </div>
    </Link>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        getCreatedDate(date) {
            if (!date) return null
            const splitItem = date.split('-')
            const year = splitItem[0]
            let month = splitItem[1]
            let day = splitItem[2]
            return `${day}/${month}/${year}`
        },
        parseDate(date) {
            var s = date
            var a = s.split(/[^0-9]/)
            var d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
            return d
        },
        checkQuantity(number) {
            return number < 10 ? `0${number}` : number
        },
    },
}
</script>
