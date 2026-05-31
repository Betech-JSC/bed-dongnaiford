<template>
    <div v-show="links && links.length > 3">
        <div class="flex flex-wrap items-center justify-center space-x-3">
            <template v-for="(link, key) in links">
                <div v-if="link.label == 'Previous' || link.label == 'Next' || link.label == '<' || link.label == '>'" :key="key">
                    <Link
                        v-if="link.url"
                        :href="link.url"
                        class="w-[30px] h-[30px] lg:w-10 lg:h-10 rounded flex items-center justify-center cursor-pointer lg:hover:text-white text-gray-900 lg:hover:bg-brand-100 duration-300 ease-in-out"
                    >
                        <svg
                            :class="{
                                transform: link.label == '<' || link.label == 'Previous',
                                'rotate-180': link.label == '>' || link.label == 'Next',
                            }"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.8337 10.0003H4.16699M4.16699 10.0003L10.0003 15.8337M4.16699 10.0003L10.0003 4.16699"
                                stroke="currentColor"
                                stroke-width="1.66667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Link>
                    <div
                        v-else
                        class="w-[30px] h-[30px] lg:w-10 lg:h-10 flex items-center justify-center rotate-0 text-gray-400"
                    >
                        <svg
                            :class="{
                                transform: link.label == '>' || link.label == 'Next',
                                'rotate-180': link.label == '>' || link.label == 'Next',
                            }"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.8337 10.0003H4.16699M4.16699 10.0003L10.0003 15.8337M4.16699 10.0003L10.0003 4.16699"
                                stroke="currentColor"
                                stroke-width="1.66667"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                </div>
                <div v-else :key="key + 1">
                    <div
                        v-if="link.active"
                        class="body-2 font-medium w-[30px] h-[30px] lg:w-10 lg:h-10 flex bg-primary text-white items-center justify-center rounded"
                    >
                        <div>
                            {{ link.label }}
                        </div>
                    </div>
                    <Link
                        v-else
                        class="body-2 font-medium w-[30px] h-[30px] lg:w-10 lg:h-10 flex text-gray-500 rounded lg:hover:bg-brand-100 duration-300 ease-in-out lg:hover:text-white items-center justify-center"
                        :href="link.url"
                    >
                        <div>
                            {{ link.label }}
                        </div>
                    </Link>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        links: Array,
    },
}
</script>
