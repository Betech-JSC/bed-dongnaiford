<template>
    <main class="container mx-auto flex items-center justify-center py-[100px]">
        <div class="bg-white rounded-[4px] p-[2rem] max-w-[600px] space-y-[2rem]">
            <div class="space-y-[8px]">
                <div class="headline-2 text-gray-900">Tra cứu thông tin đơn hàng</div>
                <div class="body-1 text-gray-700">
                    Nhập mã đơn hàng vào ô bên dưới để kiểm tra trạng thái và thông tin chi tiết đơn hàng.
                </div>
            </div>
            <div>
                <p class="text-gray-700 label-2 font-semibold mb-[6px]">
                    {{ tt('Mã đơn hàng *') }}
                </p>
                <input
                    v-model="orderCode"
                    @keyup.enter="handleSearch"
                    class="w-full rounded-[4px] p-[10px] border border-gray-300 placeholder:text-gray-500"
                    placeholder="Nhập mã đơn hàng của bạn"
                />
            </div>
            <!-- Nút tra cứu -->
            <button
                class="w-full button-1 bg-black hover:bg-gray-900 flex items-center justify-center text-center transform transition-all text-white uppercase py-[12px] w-full font-bold rounded-[8px]"
                @click="handleSearch"
                :disabled="isLoading"
            >
                <span v-if="isLoading" class="loader"></span>
                <span v-else>Tra cứu</span>
            </button>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            orderCode: '', // Biến lưu trữ mã đơn hàng nhập vào
            isLoading: false,
        }
    },
    methods: {
        handleSearch() {
            if (!this.orderCode.trim()) {
                alert('Vui lòng nhập mã đơn hàng!')
                return
            }

            this.isLoading = true

            const orderNumber = this.orderCode
            const url_success = this.route('checkout.payment.tracking', {
                orderNumber,
            })
            this.$inertia.visit(url_success, {
                preserveState: false,
                onSuccess: () => {
                    this.getCart()
                },
                onFinish: () => {
                    this.isLoading = false
                },
            })
        },
    },
}
</script>

<style scoped>
.container {
    background-color: #f9fafb;
}

.loader {
    border: 2px solid #f3f3f3; /* Light grey */
    border-top: 2px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    margin-right: 8px; /* Khoảng cách giữa loader và text */
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}
</style>
