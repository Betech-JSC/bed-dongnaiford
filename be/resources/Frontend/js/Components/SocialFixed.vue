<template>
    <div class="fixed xl:bottom-28 bottom-[74px] md:bottom-[84px] xl:right-[26px] md:right-4 right-2 z-[100] space-y-4">
        <a :href="zaloLink" target="_blank" rel="noopener noreferrer nofollow"
            class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative z-10 box-chatapp">
            <img src="/assets/images/contact/icon-zalo.png" alt="Whatsapp" class="w-full h-full relative z-10 rounded-full overflow-hidden shadow-sm">
            <div class="absolute inset-0 rounded-full pulse-blue shadow-blue-500/50"></div>
            <div class="absolute inset-0 rounded-full pulse-blue delay-700 shadow-blue-500/40"></div>
        </a>
        <a :href="'tel:' + phoneLink" target="_blank" rel="noopener noreferrer nofollow"
            class="group duration-300 ease-in-out relative z-10 box-phone block">
            <div
                class="relative rounded-full bg-primary shadow-sm w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="relative z-10 block">
                    <rect width="32" height="32" rx="16" fill="url(#paint0_radial_10750_3329)"></rect>
                    <g clip-path="url(#clip0_10750_3329)">
                        <path
                            d="M22.7162 18.5022C21.7366 18.5022 20.7747 18.349 19.8633 18.0478C19.4167 17.8954 18.8676 18.0352 18.595 18.3151L16.796 19.6732C14.7096 18.5595 13.4245 17.2748 12.326 15.204L13.6441 13.4519C13.9865 13.1099 14.1094 12.6103 13.9622 12.1415C13.6597 11.2253 13.506 10.2639 13.506 9.28392C13.5061 8.57596 12.9301 8 12.2222 8H9.28387C8.57596 8 8 8.57596 8 9.28387C8 17.3985 14.6016 24 22.7162 24C23.4241 24 24 23.424 24 22.7161V19.786C24 19.0781 23.424 18.5022 22.7162 18.5022Z"
                            fill="white"></path>
                    </g>
                </svg>
                <span
                    class="absolute right-0 h-12 w-12 rounded-full lg:group-hover:w-[180px] bg-primary duration-300 z-[-1] ease-in-out overflow-hidden hidden md:flex items-center pl-4 text-white body-1">
                    {{ phoneLink }}
                </span>
            </div>
            <div class="absolute inset-0 rounded-full pulse-primary shadow-primary-500/50"></div>
            <div class="absolute inset-0 rounded-full pulse-primary delay-700 shadow-primary-500/40"></div>
        </a>
    </div>
</template>

<script>
export default {
    computed: {
        phoneLink() {
            return this.$page?.props?.global?.general_phone ?? ''
        },
        zaloLink() {
            return this.$page?.props?.global?.general_zalo_link ?? ''
        },
    },
}
</script>

<style scoped>
.pulse-blue {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: pulse-blue 2s infinite;
}

.pulse-primary {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: pulse-primary 2s infinite;
}

.delay-700 {
    animation-delay: 0.7s;
}

@keyframes pulse-blue {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(27, 88, 220, 0.7);
    }

    70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 8px rgba(27, 88, 220, 0);
    }

    100% {
        transform: scale(1.1);
        box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
    }
}

@keyframes pulse-primary {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgb(234, 170, 8);
    }

    70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 8px rgba(96, 20, 10, 0);
    }

    100% {
        transform: scale(1.1);
        box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
    }
}

.box-chatapp,
.box-phone {
    transition: all 0.3s ease;
}

.box-chatapp:hover,
.box-phone:hover {
    transform: scale(1.1);
}
</style>
