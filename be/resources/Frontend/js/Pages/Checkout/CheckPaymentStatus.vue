<template>
    <main>
        <div class="container py-[64px]">
            <div class="grid grid-cols-12 text-black">
                <div class="col-span-full md:col-start-3 md:col-span-8">
                    <div>
                        <div class="flex justify-center">
                            <div class="text-center">
                                <div class="headline-2 mb-[20px]">
                                    <div>Quét mã thanh toán</div>
                                </div>
                                <div>Hướng dẫn thanh toán qua chuyển khoản ngân hàng</div>
                                <div>Mở app ngân hàng và quét mã QR</div>
                                <div class="flex items-center justify-center">
                                    <div class="mt-3 flex space-x-[12px]">
                                        <img
                                            :src="`https://qr.sepay.vn/img?bank=TPBank&acc=00005262354&template=compact&amount=${order.deposit_fee}&des=DH${order.order_number}`"
                                            class="w-[300px]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div v-if="payStatus === 'UNPAID'" id="checkout_box">
                                        <div>Chưa thanh toán, vui lòng thực hiện thanh toán...</div>
                                        <div><i class="gg-spinner" v-if="isLoading"></i></div>
                                    </div>
                                    <div v-else id="success_pay_box">
                                        <p>Thanh toán thành công! Cảm ơn bạn.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios'

export default {
    props: ['order'],
    data() {
        return {
            payStatus: 'UNPAID',
            intervalId: null,
            isLoading: false,
        }
    },
    methods: {
        created() {},
        async checkPaymentStatus() {
            if (this.payStatus === 'UNPAID') {
                try {
                    const response = await axios.post('/check-payment-order-status', {
                        orderNumber: this.order.order_number,
                    })

                    if (response.data.payment_status === 'PAID') {
                        this.payStatus = 'PAID'

                        const url_success = this.route('checkout.payment.tracking', {
                            orderNumber: this.order.order_number,
                        })
                        this.$inertia.visit(url_success, {
                            preserveState: false,
                            onSuccess: () => {},
                            onFinish: () => {},
                        })
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra thanh toán:', error)
                }
            }
        },
    },
    mounted() {
        this.intervalId = setInterval(this.checkPaymentStatus, 1000)
    },
    beforeUnmount() {
        clearInterval(this.intervalId)
    },
}
</script>

<style lang="scss" scoped>
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