<template>
    <main class="bg-white">
        <section class="">
            <div class="container grid grid-cols-12 xl:gap-x-[32px] md:gap-x-[22px] gap-x-[16px]">
                <div class="lg:col-span-10 col-span-full lg:col-start-2 xl:col-span-6 xl:col-start-4">
                    <div
                        class="xl:my-[24px] md:my-[17px] my-[12px] bg-gray-50 md:rounded-lg rounded-[24px] xl:p-[32px] md:p-[17px] p-[12px] xl:space-y-[24px] md:space-y-[17px] space-y-[12px]"
                    >
                        <div class="flex items-center justify-center">
                            <div class="space-y-4 text-center">
                                <div class="flex items-center justify-center">
                                    <div class="p-3 bg-primary-500 rounded-full w-12 h-12">
                                        <JPicture class="picture-contain" loading="eager" src="/assets/svg/check.svg" />
                                    </div>
                                </div>
                                <p class="title_1 text-gray-900">Đặt hàng thành công</p>
                                <p class="body_1 text-gray-900">
                                    Cảm ơn bạn đã đặt mua sản phẩm
                                    <br />
                                    Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div class="p-6 bg-white border-t-2 border-primary-500 space-y-3">
                                <div class="space-y-3">
                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Mã đơn hàng') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">
                                            #{{ order.order_number }}
                                        </div>
                                    </div>
                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Tên khách hàng') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">{{ order.name }}</div>
                                    </div>
                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Email') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">{{ order.email }}</div>
                                    </div>
                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Số điện thoại') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">{{ order.phone }}</div>
                                    </div>
                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Địa chỉ nhận hàng') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">
                                            148 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                                        </div>
                                    </div>

                                    <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Trạng thái đơn hàng') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">
                                            {{ order.formatted_status }}
                                        </div>
                                    </div>
                                    <!-- <div class="flex gap-2 border-b pb-3 border-gray-300">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Trạng thái thanh toán') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">
                                            {{ order.formatted_payment_status }}
                                        </div>
                                    </div> -->
                                    <div class="flex gap-2 pb-3 border-gray-300" v-if="order.note">
                                        <div class="w-[140px] label_1 text-gray-900">
                                            {{ tt('Ghi chú') }}
                                        </div>
                                        <div class="w-[calc(100%-140px)] body_1 text-gray-900">
                                            {{ order.note }}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 class="font-medium text-gray-900 p2">
                                        {{ tt('Sản phẩm đã mua') }}
                                    </h3>
                                    <div
                                        class="xl:space-y-[12px] md:space-y-[8px] space-y-[6px] xl:mt-[12px] md:mt-[8px] mt-[6px]"
                                    >
                                        <div
                                            v-for="(lineItem, index) in order.line_items"
                                            :key="index"
                                            class="md:flex xl:space-x-[12px] md:space-x-[8px] max-md:space-y-[6px] justify-between pb-[12px] border-b border-gray-300"
                                        >
                                            <div
                                                class="flex xl:space-x-[12px] md:space-x-[8px] space-x-[6px] relative gap-2"
                                            >
                                                <Link
                                                    v-if="lineItem.product?.slug"
                                                    class="w-[72px] h-[72px] flex-none rounded-lg overflow-hidden"
                                                    :href="
                                                        route('products.show', {
                                                            slug: lineItem.product.slug,
                                                        })
                                                    "
                                                >
                                                    <JPicture
                                                        :src="lineItem.product.image?.url || '/assets/images/cover.webp'"
                                                        :alt="lineItem.product.image?.alt"
                                                        classCustom="mt-auto"
                                                        class="picture-cover"
                                                    />
                                                    <div
                                                        class="text-[10px] text-white leading-[140%] font-medium w-4 h-4 rounded-full bg-gray-700 absolute top-[-2px] left-[64px] flex items-center justify-center"
                                                    >
                                                        {{ lineItem.qty }}
                                                    </div>
                                                </Link>
                                                <div
                                                    v-else
                                                    class="w-[72px] h-[72px] flex-none rounded-lg overflow-hidden relative"
                                                >
                                                    <JPicture
                                                        :src="lineItem.product?.image?.url || '/assets/images/cover.webp'"
                                                        :alt="lineItem.product?.image?.alt"
                                                        classCustom="mt-auto"
                                                        class="picture-cover"
                                                    />
                                                    <div
                                                        class="text-[10px] text-white leading-[140%] font-medium w-4 h-4 rounded-full bg-gray-700 absolute top-[-2px] left-[64px] flex items-center justify-center"
                                                    >
                                                        {{ lineItem.qty }}
                                                    </div>
                                                </div>

                                                <div class="xl:space-y-[8px] md:space-y-[6px] space-y-[4px]">
                                                    <Link
                                                        v-if="lineItem.product?.slug"
                                                        :href="
                                                            route('products.show', {
                                                                slug: lineItem.product.slug,
                                                            })
                                                        "
                                                        class="font-medium text-gray-900 line-clamp-2 lg:w-[80%]"
                                                    >
                                                        {{ lineItem.product.title }}
                                                    </Link>
                                                    <span
                                                        v-else
                                                        class="font-medium text-gray-900 line-clamp-2 lg:w-[80%]"
                                                    >
                                                        {{ lineItem.product?.title }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="xl:mt-[16px] md:mt-[11px] mt-[8px] xl:space-y-[10px] md:space-y-[7px] space-y-[5px] text-gray-700"
                                    >
                                        <div class="flex justify-between">
                                            <div>{{ tt('Tạm tính') }}</div>
                                            <div class="font-medium text-gray-900">
                                                {{ toMoney(order.subtotal_price) }}
                                            </div>
                                        </div>
                                        <div class="flex justify-between">
                                            <div>
                                                {{ tt('Tổng tiền cần thanh toán') }}
                                            </div>
                                            <div class="font-bold text-red-500 p3">
                                                {{ toMoney(order.total_price) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center xl:mt-[32px] md:mt-[22px] mt-[16px]">
                            <Link
                                :href="route('home')"
                                class="btn secondary space-x-3 flex items-center justify-center"
                                >{{ tt('Tiếp tục mua sắm') }}</Link
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
export default {
    props: ['order'],
}
</script>

<style lang="scss" scoped>
.table {
    @apply space-y-[4px];
    .tr {
        @apply md:flex;
        .td:first-child {
            @apply w-[200px] text-gray-600 flex-none;
        }
        .td:last-child {
            @apply text-gray-700 font-medium;
        }
    }
}
</style>
