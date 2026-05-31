<template>
    <main>
        <section class="relative bg-gray-100 py-12 md:py-14">
            <div class="container">
                <AnimatedAppear>
                    <div class="relative rounded-3xl overflow-hidden">
                        <div class="absolute inset-0">
                            <JPicture
                                src="/assets/images/contact/bg-contact.jpg"
                                alt="background contact"
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="relative flex items-center justify-center py-6 px-3 md:p-8 xl:p-12">
                            <div class="max-w-[660px] w-full space-y-10 md:space-y-8 xl:space-y-14">
                                <div class="md:space-y-4 space-y-3 xl:space-y-6 text-center">
                                    <div class="space-y-3">
                                        <div class="max-w-[152px] w-full mx-auto">
                                            <JPicture
                                                src="/assets/images/contact/logo-contact.png"
                                                alt="logo contact"
                                                class="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h1 class="display-3 text-primary font-bold uppercase">
                                            {{ tt('Liên hệ ngay với chúng tôi') }}
                                        </h1>
                                    </div>
                                    <div class="title-2 text-white">
                                        {{ tt('Bạn có thắc mắc về khóa học cần được giải đáp?') }} <br />
                                        {{ tt('Hãy để lại thông tin, chúng tôi sẽ liên hệ lại ngay để tư vấn cho bạn chi tiết hơn hoàn toàn miễn phí.') }}
                                    </div>
                                </div>
                                <div class="space-y-6">
                                    <JamFieldSet
                                        v-model="form.contact.data.Name"
                                        :field="{
                                            rules: rules,
                                            errors: errors,
                                            type: 'text',
                                            placeholder: tt('Nhập họ và tên'),
                                            name: 'Your Name',
                                            fieldName: 'Name',
                                            label: 'Họ và tên',
                                            errorText: tt('Họ và tên không hợp lệ'),
                                        }"
                                        :isSubmit="isSubmit"
                                        @setIsSubmit="setIsSubmit"
                                        :isContact="true"
                                    />
                                    <div class="grid md:grid-cols-2 gap-6 md:gap-3">
                                        <JamFieldSet
                                            v-model="form.contact.data.Phone"
                                            :field="{
                                                rules: rules,
                                                errors: errors,
                                                type: 'number',
                                                placeholder: tt('Nhập số điện thoại'),
                                                name: 'Phone Number',
                                                fieldName: 'Phone',
                                                label: 'Số điện thoại',
                                                errorText: tt('Số điện thoại không hợp lệ'),
                                            }"
                                            :isSubmit="isSubmit"
                                            @setIsSubmit="setIsSubmit"
                                            :isContact="true"
                                        />
                                        <JamFieldSet
                                            v-model="form.contact.data.Email"
                                            :field="{
                                                rules: rules,
                                                errors: errors,
                                                type: 'email',
                                                placeholder: tt('Nhập email'),
                                                name: 'Email',
                                                fieldName: 'Email',
                                                label: 'Email',
                                                errorText: tt('Email không hợp lệ'),
                                            }"
                                            :isSubmit="isSubmit"
                                            @setIsSubmit="setIsSubmit"
                                            :isContact="true"
                                        />
                                    </div>
                                    <JamFieldSet
                                        v-model="form.contact.data['Nội dung yêu cầu']"
                                        :field="{
                                            rules: rules,
                                            errors: errors,
                                            type: 'text',
                                            placeholder: tt('Lời nhắn muốn gửi đến chúng tôi'),
                                            name: 'Message',
                                            fieldName: 'Note',
                                            label: tt('Lời nhắn'),
                                            errorText: tt('Lời nhắn không hợp lệ'),
                                        }"
                                        :isSubmit="isSubmit"
                                        @setIsSubmit="setIsSubmit"
                                        :isContact="true"
                                    />
                                    <div class="flex items-center justify-center">
                                        <button
                                            class="space-x-3 btn btn-primary min-w-[280px] flex items-center justify-center"
                                            @click="contact"
                                        >
                                            <div>{{ tt('Send Now') }}</div>
                                            <i class="gg-spinner" v-if="isLoading"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="md:space-y-4 space-y-3 xl:space-y-6 text-center">
                                    <div class="headline-2 font-bold text-gray-900">{{ tt('Hỗ trợ nhà giao dịch') }}</div>
                                    <div class="uppercase">
                                        <p>{{ tt('Phân tích chuyên sâu - Zhouyi Lotus') }}</p>
                                        <p>{{ tt('Cộng đồng Facebook') }}</p>
                                    </div>
                                    <div class="flex items-center justify-center gap-4">
                                        <a :href="itemSocial.url" v-for="(itemSocial, indexSocial) in socials" :key="indexSocial" class="w-12 h-12" :target="itemSocial.target" rel="noopener noreferrer nofollow">
                                            <JPicture :src="itemSocial.image?.url" :alt="itemSocial.image?.alt" class="w-full h-full object-cover" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedAppear>
            </div>
        </section>
        <ModalSuccess
            @close="closePopup"
            :isSuccess="isSuccess"
            :title="tt('Gửi thông tin thành công')"
            :description="tt('Hệ thống đã nhận được thông tin yêu cầu của bạn. Chúng tôi sẽ liên hệ và thông báo cho bạn trong thời gian sớm nhất.')"
        />
    </main>
</template>
<script>
import { validateForm } from '@/validator'
import JamFieldSet from '../Components/Jam/FieldSet.vue'

const emptyForm = {
    Name: '',
    Phone: null,
    Email: '',
    Note: '',
}
export default {
    props: ['agencies'],
    components: { JamFieldSet },
    directives: {
        'click-outside': {
            beforeMount: (el, binding) => {
                el.clickOutsideEvent = (event) => {
                    // here I check that click was outside the el and his children
                    if (!(el == event.target || el.contains(event.target))) {
                        // and if it did, call method provided in attribute value
                        binding.value()
                    }
                }
                document.addEventListener('click', el.clickOutsideEvent)
            },
            unmounted: (el) => {
                document.removeEventListener('click', el.clickOutsideEvent)
            },
        },
    },
    data() {
        return {
            socials: [
                {
                    image: {
                        url: "/assets/images/contact/icon-phone.png",
                        alt: "icon phone"
                    },
                    url: `tel:${this.$page.props.global.general_phone}`,
                    target: "_self"
                },
                {
                    image: {
                        url: "/assets/images/contact/icon-facebook.png",
                        alt: "icon facebook"
                    },
                    url: this.$page.props.global.general_fb_link ?? '',
                    target: "_blank"
                },
                {
                    image: {
                        url: "/assets/images/contact/icon-zalo.png",
                        alt: "icon zalo"
                    },
                    url: this.$page.props.global.general_zalo_link ?? '',
                    target: "_blank"
                },
            ],
            form: {
                contact: {
                    data: {
                        ...emptyForm,
                    },
                    type: 'CONTACT_FORM',
                },
            },
            rules: {
                Name: 'required|min:3|max:25',
                Phone: 'phone|required|min:10|max:11',
                Email: 'email|required',
            },
            errors: {},
            isSuccess: false,
            isLoading: false,
            isSubmit: false,
            isShowTypeService: false,
            servicesList: [],
            typeServiceActive: null,
            isEmptyService: false,
            screenWidth: 0,
        }
    },
    mounted() {
        if (this.$page.props.data.services && this.$page.props.data.services.length > 0) {
            this.servicesList = this.$page.props.data.services
        }
        this.screenWidth = window.innerWidth
    },
    methods: {
        contact() {
            this.errors = validateForm(this.form.contact.data, this.rules)

            if (Object.keys(this.errors).length > 0) {
                return false
            }
            this.isLoading = true

            this.$inertia.post('contacts', this.form, {
                preserveScroll: true,
                onSuccess: () => {
                    this.form.contact.data = { ...emptyForm }
                    this.typeServiceActive = null
                    this.isEmptyService = false
                    this.isSuccess = true
                    this.isSubmit = true
                    this.isLoading = false
                    document.body.classList.add('overflow-hidden')
                },
            })
        },
        closePopup() {
            this.isSuccess = false
            document.body.classList.remove('overflow-hidden')
        },
        setIsSubmit(val) {
            this.isSubmit = val
        },
        toggleTypeService(event) {
            event.stopPropagation()
            this.isShowTypeService = !this.isShowTypeService
        },
        setTypeService(item) {
            this.typeServiceActive = item
            this.form.contact.data.Service.id = this.typeServiceActive.id
            this.form.contact.data.Service.title = this.typeServiceActive.title
            this.form.contact.data.Service.slug = this.typeServiceActive.slug
            this.isShowTypeService = false
        },
        hideBox() {
            this.isShowTypeService = false
        },
    },
}
</script>
<style lang="scss" scoped>
/* width */
::-webkit-scrollbar {
    width: 8px;
    background: white;
    border-radius: 30px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    @apply bg-gray-200 rounded-[30px];
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
}

.select-shadow {
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
}

.gg-spinner {
    transform: scale(var(--ggs, 1));
}

.gg-spinner,
.gg-spinner::after,
.gg-spinner::before {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 1rem;
    height: 1rem;
}

.gg-spinner::after,
.gg-spinner::before {
    content: '';
    position: absolute;
    border-radius: 100px;
}

.gg-spinner::before {
    animation: spinner 1s cubic-bezier(0.6, 0, 0.4, 1) infinite;
    border: 3px solid transparent;
    border-top-color: currentColor;
}

.gg-spinner::after {
    border: 3px solid;
    opacity: 0.2;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(359deg);
    }
}
</style>
