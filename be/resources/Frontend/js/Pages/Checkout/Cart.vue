<template>
    <main class="bg-primary-25">
        <section class="py-12">
            <div class="container md:space-y-6 space-y-4 xl:space-y-8">
                <h1 class="display-3 text-gray-900 uppercase">Shopping cart</h1>

                <div class="mt-8 w-full max-md:max-w-full">
                    <div class="flex flex-col xl:flex-row gap-4 md:gap-6 xl:gap-8 items-start w-full">
                        <div
                            class="p-4 md:p-6 bg-white rounded-[24px] max-w-full xl:max-w-[696px] w-full md:space-y-6 space-y-4 xl:space-y-8">
                            <div class="space-y-4">
                                <div class="pb-1 border-b border-gray-300">
                                    <h2 class="label-1 text-gray-900">Thông tin liên hệ</h2>
                                </div>
                                <div class="md:space-y-5 space-y-4 xl:space-y-6 body-1">
                                    <JamFieldSet v-model="form.name" :field="{
                                        rules: rules,
                                        errors: errors,
                                        type: 'text',
                                        placeholder: tt('Họ và tên'),
                                        name: 'Họ và tên',
                                        fieldName: 'name',
                                        label: 'Họ và tên',
                                        errorText: tt('Họ tên không hợp lệ'),
                                        validate: isSubmit,
                                    }" :isCart="true" :isSubmit="isSubmit" @setIsSubmit="setIsSubmit"
                                        :isContact="true" />
                                    <div class="grid md:grid-cols-2 md:gap-5 gap-4 xl:gap-6">
                                        <JamFieldSet v-model="form.phone" :field="{
                                            rules: rules,
                                            errors: errors,
                                            type: 'number',
                                            placeholder: tt('Số điện thoại'),
                                            name: 'Số điện thoại',
                                            fieldName: 'phone',
                                            label: 'Số điện thoại',
                                            errorText: tt('Số điện thoại không hợp lệ'),
                                            validate: isSubmit,
                                        }" :isCart="true" :isSubmit="isSubmit" @setIsSubmit="setIsSubmit"
                                            :isContact="true" />
                                        <JamFieldSet v-model="form.email" :field="{
                                            rules: rules,
                                            errors: errors,
                                            type: 'email',
                                            placeholder: tt('Email'),
                                            name: 'Email',
                                            fieldName: 'email',
                                            label: 'Email',
                                            errorText: tt('Email không hợp lệ'),
                                            validate: isSubmit,
                                        }" :isCart="true" :isSubmit="isSubmit" @setIsSubmit="setIsSubmit"
                                            :isContact="true" />
                                    </div>
                                    <JamFieldSet v-model="form.note" :field="{
                                        rules: rules,
                                        errors: errors,
                                        type: 'textarea',
                                        placeholder: tt('Lời nhắn gửi tới Vietnam Farmer'),
                                        name: 'Nội dung yêu cầu',
                                        fieldName: 'note',
                                        label: 'Lời nhắn',
                                        errorText: tt('Lời nhắn không hợp lệ'),
                                        validate: isSubmit,
                                    }" :isCart="true" :isSubmit="isSubmit" @setIsSubmit="setIsSubmit"
                                        :isContact="true" />
                                </div>
                            </div>
                            <div>
                                <div class="pb-1 border-b border-gray-300">
                                    <h2 class="label-1 text-gray-900">Thông tin thanh toán</h2>
                                </div>

                                <div
                                    class="flex flex-wrap gap-6 items-start mt-6 w-full text-sm leading-snug max-md:max-w-full">
                                    <img src="/assets/images/qrcode.jpg" alt="QR Code"
                                        class="object-contain shrink-0 w-full md:w-32 aspect-square" />

                                    <div class="flex-1 bg-gray-50 rounded-xl p-2 w-full space-y-3">
                                        <div class="flex md:flex-row flex-col gap-2 md:items-center">
                                            <span class="label-2 text-gray-700 w-[180px]">Số tài khoản</span>
                                            <span class="body-2 text-gray-900"> 1234567 </span>
                                        </div>

                                        <div class="flex md:flex-row flex-col gap-2 md:items-center">
                                            <span class="label-2 text-gray-700 w-[180px]">Chủ tài khoản</span>
                                            <span class="body-2 text-gray-900"> Nguyen Van A </span>
                                        </div>

                                        <div class="flex md:flex-row flex-col gap-2 md:items-center">
                                            <span class="label-2 text-gray-700 w-[180px]"> Ngân hàng</span>
                                            <span class="body-2 text-gray-900"> ABC ( Ngân Hàng Thương Mại ABC) </span>
                                        </div>

                                        <div class="flex md:flex-row flex-col gap-2 md:items-center">
                                            <span class="label-2 text-gray-700 w-[180px]">Chi Nhánh</span>
                                            <span class="body-2 text-gray-900"> ABC - PGD THANH DA </span>
                                        </div>

                                        <div class="flex md:flex-row flex-col gap-2 md:items-center">
                                            <span class="label-2 text-gray-700 w-[180px]"> Nội dung chuyển khoản </span>
                                            <span class="body-2 text-gray-900"> Tên + SĐT </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside
                            class="flex flex-col flex-1 p-4 md:p-6 space-y-4 md:space-y-5 xl:space-y-6 bg-white rounded-[24px]">
                            <div class="pb-1 border-b border-gray-300">
                                <h2 class="label-1 text-gray-900">Thông tin đơn hàng</h2>
                            </div>

                            <OrderProduct v-for="(cart, index) in form?.products" :key="index" :cart="cart"
                                @deleteItem="handleOrderInfo" />

                            <div class="p-4 w-full bg-gray-100 rounded space-y-4">
                                <div class="flex flex-col justify-center w-full">
                                    <div class="flex gap-4 items-center justify-between w-full text-gray-700">
                                        <span class="body-2">Tạm tính</span>
                                        <span class="body-1"> {{ toMoney(form?.total_price) }} </span>
                                    </div>
                                </div>
                                <div class="w-full h-px bg-gray-200"></div>
                                <div class="flex flex-col justify-center w-full text-slate-700">
                                    <div class="flex gap-4 items-center justify-between w-full text-gray-900">
                                        <span class="label-1">Tổng chi phí</span>
                                        <span class="label-1"> {{ toMoney(form?.total_price) }} </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                class="button-1 space-x-[12px] bg-primary-800 lg:hover:bg-primary-900 text-primary-100 flex items-center justify-center text-center transform transition-all py-[12px] w-full rounded-full button-1"
                                as="button" :loading="isLoading" @click="onSubmitForm()">
                                <div>{{ tt('Thanh toán') }}</div>
                                <i class="gg-spinner" v-if="isLoading"></i>
                            </button>

                            <p class="body-1">
                                Nhấn đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo
                                <Link :href="route('policies.index')" class="font-bold underline">Chính sách đặt hàng
                                </Link>
                                của chúng tôi.
                            </p>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import JamFieldSet from '@/Components/Jam/FieldSet.vue'

import axios from 'axios'
import { validateForm } from '@/lib/validator'
import { useAppStore } from '@/stores/index'
import Close from '@/Components/Icons/Close.vue'

export default {
    components: { JamFieldSet, Close },

    data() {
        return {
            banner: {
                title: this.tt('Liên hệ'),
                image: '/assets/images/contact/bg-banner.webp',
                breadcrumbs: [
                    {
                        title: this.tt('Liên hệ'),
                    },
                ],
            },
            form: {
                name: '',
                phone: '',
                email: '',
                note: '',
                products: [],
                total_price: 0,
                total_deposit: 0,
            },
            rules: {
                name: 'required',
                phone: 'required|phone|min:10|max:10',
                email: 'required|email',
                note: '',
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
            products: [
                {
                    id: '1',
                    name: "Tito's Puptail Toy Kit",
                    price: '500.000₫',
                    quantity: 1,
                    image: 'https://api.builder.io/api/v1/image/assets/TEMP/0dfbfe98450311817515d3a460d1d8f3128accde?placeholderIfAbsent=true&apiKey=46d5c20749a240c186a47eb8282d0295',
                },
                {
                    id: '2',
                    name: "Tito's Handmade Vodka",
                    price: '450.000₫',
                    quantity: 2,
                    image: 'https://api.builder.io/api/v1/image/assets/TEMP/64a3c632cf29f618acf4e79af4dfbcb9ab634c31?placeholderIfAbsent=true&apiKey=46d5c20749a240c186a47eb8282d0295',
                },
            ],
        }
    },
    created() {
        this.handleOrderInfo()
    },
    computed: {
        cartData() {
            return useAppStore().cart
        },
    },
    methods: {
        async handleOrderInfo() {
            const requestData = {}

            const data = await axios.post('/calculate-total-cost', requestData).then((res) => {
                const { products, total_cost } = res.data.original
                this.form.products = products
                this.form.total_price = total_cost
            })
        },
        async onSubmitForm() {
            if (this.requestBillChecked) {
                this.errors = validateForm({ ...this.form }, this.rules)
            } else {
                this.errors = validateForm(this.form, this.rules)
            }

            console.log(this.errors)

            if (Object.keys(this.errors).length > 0 || this.isLoading) {
                return
            }
            this.isLoading = true
            let formOrder = {
                ...this.form,
            }

            const { data } = await axios.post(this.route('checkout.payment.store'), formOrder)

            if (data && data.url) {
                window.location.href = data.url
                return
            }

            if (data && data.status) {
                let listItem = []
                this.cartData.items.forEach((item) => {
                    listItem.push({
                        id: item.product.variant_id,
                        google_business_vertical: 'retail',
                    })
                })
                if (typeof this.$gtm !== 'undefined') {
                    this.$gtm.trackEvent({
                        event: 'purchase', // Event type [default = 'interaction'] (Optional)
                        value: this.cartData.total_price,
                        items: listItem,
                    })
                }

                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Purchase', {
                        value: this.cartData.total_price,
                        currency: 'VND',
                    })
                }
                if (typeof ttq !== 'undefined') {
                    ttq.track('Purchase', {
                        value: this.cartData.total_price,
                        currency: 'VND',
                    })
                }

                const orderNumber = data.order.order_number

                this.$inertia.visit(this.route('checkout.payment.check.payment.status', { orderNumber }), {
                    preserveState: false,
                    onSuccess: () => {
                        this.getCart()
                    },
                    onFinish: () => {
                        this.isLoading = false
                    },
                })
            } else {
                const orderNumber = data.order.order_number

                const url_failed = this.route('checkout.payment.payment_failed', { orderNumber })
                this.$inertia.visit(url_failed, {
                    preserveState: false,
                    onFinish: () => {
                        this.isLoading = false
                    },
                })
            }
        },
        closePopup() {
            this.isSuccess = false
            document.body.classList.remove('overflow-hidden')
        },
        setIsSubmit(val) {
            this.isSubmit = val
        },
        async getCart() {
            await this.appStore.fetchCart()
        },
    },
}
</script>
<style lang="scss" scoped>
.check-control-bill {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    @apply relative;

    .checkmark {
        @apply absolute top-1/2 left-0 overflow-hidden -translate-y-1/2 w-[16px] h-[16px] border-gray-300 border rounded-sm;

        &:before {
            content: '';
            @apply block absolute w-full h-full inset-0 z-10 bg-no-repeat bg-center opacity-0;
            background-image: url('/assets/images/icons/checked.svg');
            background-size: cover;
        }
    }

    .label-check {
        @apply text-gray-700 font-medium cursor-pointer pl-[26px] relative z-10;
    }

    input:checked {
        ~.checkmark {
            @apply border-primary-600;

            &:before {
                @apply opacity-100;
            }
        }
    }
}

.button-linear {
    background: linear-gradient(81deg, #1da89f 8.3%, #025e33 103.63%);
}

.button-linear:hover {
    background: #101828;
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
