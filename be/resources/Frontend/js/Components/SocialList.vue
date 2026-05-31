<template>
    <div class="flex items-center justify-center space-x-2 xl:space-x-4 md:space-x-3 lg:justify-end">
        <div class="text-gray-500 body-2">{{ tt('Share') }}</div>

        <div class="flex items-center xl:space-x-3 md:space-x-2 space-x-2.5">
            <a v-if="checkShow('messenger')" :href="messageUrl" target="_blank"
                class="transition duration-200 ease-in-out hover:opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25" fill="none">
                    <path
                        d="M12.4989 0.5C5.74054 0.5 0.5 5.45256 0.5 12.139C0.5 15.6367 1.93387 18.6604 4.26767 20.7482C4.46265 20.9222 4.58264 21.1682 4.58864 21.4321L4.65463 23.568C4.67563 24.2489 5.37757 24.6929 6.00151 24.4169L8.3833 23.367C8.58428 23.277 8.81226 23.262 9.02524 23.319C10.1201 23.619 11.284 23.7809 12.4989 23.7809C19.2573 23.7809 24.4979 18.8284 24.4979 12.142C24.4979 5.45556 19.2573 0.5 12.4989 0.5Z"
                        fill="url(#paint0_radial_487_2278)" />
                    <path
                        d="M5.29315 15.5435L8.81784 9.952C9.37879 9.06107 10.5787 8.84209 11.4216 9.47204L14.2264 11.5749C14.4843 11.7668 14.8383 11.7668 15.0933 11.5719L18.8789 8.69811C19.3829 8.31414 20.0428 8.92009 19.7069 9.45704L16.1792 15.0455C15.6182 15.9365 14.4183 16.1554 13.5754 15.5255L10.7707 13.4227C10.5127 13.2307 10.1587 13.2307 9.90374 13.4257L6.11808 16.2994C5.61412 16.6834 4.95418 16.0805 5.29315 15.5435Z"
                        fill="white" />
                    <defs>
                        <radialGradient id="paint0_radial_487_2278" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(5.11959 24.3672) scale(26.1481 26.148)">
                            <stop stop-color="#0099FF" />
                            <stop offset="0.6098" stop-color="#A033FF" />
                            <stop offset="0.9348" stop-color="#FF5280" />
                            <stop offset="1" stop-color="#FF7061" />
                        </radialGradient>
                    </defs>
                </svg>
            </a>
            <a v-if="checkShow('linkedin')" :href="linkedinUrl" target="_blank"
                class="transition duration-200 ease-in-out hover:opacity-80">
                <svg class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM5.75977 9.93892H8.47923V18.1098H5.75977V9.93892ZM8.66094 7.41135C8.64329 6.6102 8.07039 6 7.14008 6C6.20977 6 5.60156 6.6102 5.60156 7.41135C5.60156 8.1959 6.19179 8.82367 7.10478 8.82367H7.12216C8.07039 8.82367 8.66094 8.1959 8.66094 7.41135ZM15.1554 9.74707C16.9449 9.74707 18.2865 10.9151 18.2865 13.4249L18.2864 18.1098H15.5671V13.7384C15.5671 12.6404 15.1735 11.8911 14.1891 11.8911C13.4378 11.8911 12.9903 12.3962 12.7937 12.8841C12.7218 13.0589 12.7042 13.3025 12.7042 13.5467V18.11H9.98438C9.98438 18.11 10.0202 10.7059 9.98438 9.93915H12.7042V11.0965C13.0651 10.5401 13.7115 9.74707 15.1554 9.74707Z"
                        fill="#124798" />
                </svg>
            </a>
            <a v-if="checkShow('facebook')" :href="facebookUrl" target="_blank"
                class="transition duration-200 ease-in-out hover:opacity-80">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24 12C24 5.3719 18.6281 0 12 0C5.3719 0 0 5.3719 0 12C0 17.9907 4.3875 22.9547 10.125 23.8547V15.4688H7.0781V12H10.125V9.35625C10.125 6.3492 11.9156 4.6875 14.6578 4.6875C15.9703 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8297C14.3391 7.875 13.875 8.8008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8547C19.6125 22.9547 24 17.9907 24 12Z"
                        fill="#3399FF" />
                    <path
                        d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.8008 14.3391 7.875 15.8297 7.875H17.3438V4.92188C17.3438 4.92188 15.9703 4.6875 14.6578 4.6875C11.9157 4.6875 10.125 6.3492 10.125 9.35625V12H7.07812V15.4688H10.125V23.8547C10.7367 23.9508 11.3625 24 12 24C12.6375 24 13.2633 23.9508 13.875 23.8547V15.4688H16.6711Z"
                        fill="white" />
                </svg>
            </a>

            <div v-if="checkShow('zalo')" class="w-6 h-6">
                <div class="zalo-share-button" data-href="" data-oaid="1111640952861619960" data-layout="3"
                    data-color="blue" data-customize="false"></div>
            </div>

            <a v-if="checkShow('pinterest')" :href="pinterestUrl" target="_blank"
                class="transition duration-200 ease-in-out hover:opacity-80">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 25 25"
                    fill="none">
                    <path
                        d="M12.5 24.4016C19.1274 24.4016 24.5 19.0511 24.5 12.4508C24.5 5.85056 19.1274 0.5 12.5 0.5C5.87258 0.5 0.5 5.85056 0.5 12.4508C0.5 19.0511 5.87258 24.4016 12.5 24.4016Z"
                        fill="white" />
                    <path
                        d="M12.5 0.5C5.87284 0.5 0.5 5.85082 0.5 12.4508C0.5 17.5164 3.66049 21.8443 8.12469 23.5852C8.01605 22.641 7.92716 21.1852 8.1642 20.1525C8.38148 19.218 9.56667 14.2115 9.56667 14.2115C9.56667 14.2115 9.21111 13.4934 9.21111 12.441C9.21111 10.7787 10.179 9.53934 11.384 9.53934C12.4111 9.53934 12.9049 10.3066 12.9049 11.2213C12.9049 12.2443 12.2531 13.7787 11.9074 15.2049C11.621 16.3951 12.5099 17.3689 13.6852 17.3689C15.8185 17.3689 17.458 15.1262 17.458 11.9C17.458 9.0377 15.3938 7.04098 12.4407 7.04098C9.02346 7.04098 7.01852 9.58852 7.01852 12.2246C7.01852 13.2475 7.41358 14.3492 7.90741 14.9492C8.00617 15.0672 8.01605 15.1754 7.98642 15.2934C7.89753 15.6672 7.69012 16.4836 7.65062 16.6508C7.60123 16.8672 7.47284 16.9164 7.24568 16.8082C5.74444 16.1098 4.80617 13.9361 4.80617 12.1754C4.80617 8.4082 7.55185 4.9459 12.737 4.9459C16.8951 4.9459 20.1346 7.89672 20.1346 11.8508C20.1346 15.9721 17.5272 19.2869 13.9123 19.2869C12.6975 19.2869 11.5519 18.6574 11.1667 17.9098C11.1667 17.9098 10.5642 20.1918 10.416 20.7525C10.1494 21.7951 9.41852 23.0934 8.92469 23.8902C10.0506 24.2344 11.2358 24.4213 12.4802 24.4213C19.1074 24.4213 24.4802 19.0705 24.4802 12.4705C24.5 5.85082 19.1272 0.5 12.5 0.5Z"
                        fill="#E60019" />
                </svg>
            </a>
            <div v-if="checkShow('copy-link')" class="relative inline-block cursor-pointer">
                <div class="w-6 h-6 transition duration-200 ease-in-out hover:opacity-80" @click="copyLink()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.7076 18.3639L11.2933 19.7781C9.34072 21.7308 6.1749 21.7308 4.22228 19.7781C2.26966 17.8255 2.26966 14.6597 4.22228 12.7071L5.63649 11.2929M18.3644 12.7071L19.7786 11.2929C21.7312 9.34024 21.7312 6.17441 19.7786 4.22179C17.826 2.26917 14.6602 2.26917 12.7076 4.22179L11.2933 5.636M8.50045 15.4999L15.5005 8.49994"
                            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <input id="input-copy" type="hidden" />
                <div class="absolute xl:top-1/2 -top-full xl:-translate-y-1/2 bg-gray-900 text-white duration-300 py-1 px-3 w-max xl:left-[150%] left-[-280%] rounded cursor-default lg:text-[0.875rem] text-[0.75rem] leading-[100%]"
                    :class="copySuccess ? 'opacity-100 visible' : 'opacity-0 invisible'">
                    {{ tt('Link copied') }}!
                </div>
            </div>
            <a v-if="checkShow('twitter')" :href="twitterUrl" target="_blank"
                class="transition duration-200 ease-in-out hover:opacity-80">
                <svg class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM11.6658 10.169L11.6406 9.75375C11.5651 8.67755 12.2282 7.69456 13.2774 7.31323C13.6635 7.17765 14.3182 7.1607 14.7463 7.27934C14.9142 7.33018 15.2331 7.49966 15.4598 7.65219L15.8711 7.93184L16.3243 7.78778C16.5761 7.71151 16.9119 7.5844 17.063 7.49966C17.2057 7.42339 17.3316 7.38102 17.3316 7.40645C17.3316 7.5505 17.021 8.042 16.7608 8.31317C16.4083 8.6945 16.509 8.72839 17.2224 8.47417C17.6505 8.33011 17.6589 8.33011 17.575 8.49112C17.5246 8.57586 17.2644 8.87245 16.9874 9.14362C16.5174 9.60969 16.4922 9.66054 16.4922 10.0503C16.4922 10.652 16.2068 11.9062 15.9214 12.5925C15.3926 13.8806 14.2595 15.211 13.1263 15.8805C11.5315 16.8211 9.40786 17.0584 7.61999 16.5075C7.02404 16.3211 6 15.8466 6 15.7618C6 15.7364 6.31057 15.7025 6.68829 15.694C7.4773 15.6771 8.26631 15.4568 8.93781 15.067L9.39108 14.7958L8.87066 14.6178C8.13201 14.3636 7.46891 13.7789 7.30103 13.2281C7.25067 13.0501 7.26746 13.0417 7.73751 13.0417L8.22434 13.0332L7.81305 12.8383C7.32621 12.5925 6.88134 12.1773 6.66311 11.7536C6.50363 11.4486 6.30218 10.6774 6.36093 10.6181C6.37772 10.5927 6.55399 10.6435 6.75544 10.7113C7.33461 10.9232 7.41015 10.8723 7.0744 10.5164C6.44487 9.87239 6.25181 8.91482 6.55399 8.0081L6.69668 7.60135L7.25067 8.15216C8.38383 9.26226 9.71843 9.92323 11.2461 10.1181L11.6658 10.169Z"
                        fill="#124798" />
                </svg>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        listSocial: {
            type: Array,
            default: () => ['messenger', 'facebook', 'zalo', 'pinterest', 'twitter', 'copy-link', 'linkedin'],
        },
    },

    data() {
        return {
            messageUrl: null,
            facebookUrl: null,
            pinterestUrl: null,
            twitterUrl: null,
            linkedinUrl: null,
            copySuccess: false,
            appID: 687076339675790,
        }
    },

    mounted() {
        let Script = document.createElement('script')
        Script.setAttribute('src', 'https://sp.zalo.me/plugins/sdk.js')
        document.head.appendChild(Script)
        this.facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
        this.messageUrl = `https://www.facebook.com/dialog/send?app_id=${this.appID}&display=popup&link=${window.location.href}&redirect_uri=${window.location.href}`
        this.pinterestUrl = `http://pinterest.com/pin/create/button/?url=${window.location.href}`
        this.twitterUrl = `http://twitter.com/share?text=${window.location.href}`
        this.linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
    },
    methods: {
        copyLink() {
            const input = document.querySelector('#input-copy')
            input.value = window.location.href
            input.setAttribute('type', 'text')
            input.select()
            input.setSelectionRange(0, 99999)
            document.execCommand('copy')
            input.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
            this.copySuccess = true
            setTimeout(() => {
                this.copySuccess = false
            }, 1000)
        },

        checkShow(social) {
            return this.listSocial.includes(social)
        },
    },
}
</script>
