<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin đơn hàng</div>
                <div class="card-body">
                    <Field
                        v-model="form.order_number"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'order_number',
                            label: 'Mã đơn hàng',
                        }"
                    />
                    <Field
                        v-model="form.formatted_created_at"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'formatted_created_at',
                            label: 'Ngày đặt đơn',
                        }"
                    />

                    <Field
                        v-model="form.formatted_payment_status"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'formatted_payment_status',
                            label: 'Trạng thái thanh toán',
                        }"
                    />
                    <Field
                        v-model="form.note"
                        :disabled="true"
                        :field="{
                            type: 'textarea',
                            name: 'note',
                            label: 'Ghi chú đơn hàng (Khách hàng)',
                        }"
                    />

                    <Field
                        v-model="form.note"
                        :field="{
                            type: 'textarea',
                            name: 'note',
                            label: 'Ghi chú (Quản trị viên)',
                            rows: 10,
                        }"
                    />
                </div>
            </div>
            <div v-if="form.status == 7" class="card">
                <div class="card-header">Ghi chú trạng thái hủy đơn</div>
                <div class="card-body">
                    <Field
                        v-model="form.cancel_status"
                        :field="{
                            type: 'dropdown',
                            name: 'type',
                            label: false,
                            keyBy: 'id',
                            labelBy: 'label',
                            placeholder: 'Lý do hủy đơn hàng',
                            options: [
                                { id: 1, label: 'Khách hàng đổi ý' },
                                { id: 2, label: 'Thanh toán bị từ chối' },
                                { id: 3, label: 'Đơn hàng giả mạo' },
                                { id: 4, label: 'Sai thông tin' },
                                { id: 5, label: 'Không liên lạc được' },
                                { id: 6, label: 'Hết hàng' },
                                { id: 7, label: 'Khác' },
                            ],
                        }"
                    />
                    <Field
                        v-if="form.cancel_status == 7"
                        v-model="form.status_note"
                        :field="{
                            type: 'textarea',
                            name: 'status_note',
                            label: 'Lý do hủy đơn hàng (Ghi chú)',
                            rows: 10,
                        }"
                    />
                </div>
            </div>
            <div class="card">
                <div class="card-header">Thông tin khách hàng</div>
                <div class="card-body">
                    <Field
                        v-model="form.name"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'name',
                            label: 'Họ tên',
                        }"
                    />
                    <Field
                        v-model="form.email"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email',
                        }"
                    />
                    <Field
                        v-model="form.phone"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'phone',
                            label: 'Sô điện thoại',
                        }"
                    />
                    <div class="mt-4">
                        <Link
                            :href="
                                this.route('admin.customers.form', {
                                    id: form.customer_id,
                                })
                            "
                            target="_blank"
                            class="link"
                        >
                            Thông tin khách hàng
                        </Link>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">Chi tiết đơn hàng</div>
                <div class="card-body">
                    <table class="table">
                        <tbody>
                            <tr>
                                <td>Tên sản phẩm</td>
                                <td></td>
                                <td class="text-right">Giá</td>
                                <td class="text-right">Số lượng</td>
                                <td class="text-right">Tổng</td>
                            </tr>
                            <tr v-for="(product, index) in form.order_lines" :key="index">
                                <td>
                                    <Link target="_blank" class="link">{{ product.title ?? form.title }}</Link>
                                    <div v-if="product.product.categories.length > 0" class="text-xs text-gray-600">
                                        SKU: {{ product.sku }}, Danh mục: {{ product.product.categories[0].title }}
                                    </div>
                                    <div v-else class="text-xs text-gray-600">SKU: {{ product.sku }}</div>
                                    <div class="text-xs text-gray-600">
                                        {{ product.title }}
                                    </div>
                                </td>
                                <td class="text-center">
                                    <span v-if="product.is_sale" class="font-bold text-red-500"> Flash sale</span>
                                </td>
                                <td
                                    class="text-right"
                                    :class="product.is_sale ? 'text-red-500 font-semibold' : 'text-gray-600'"
                                >
                                    {{ toMoney(product.price) }}
                                </td>
                                <td class="text-right">
                                    {{ product.quantity }}
                                </td>
                                <td
                                    class="text-right"
                                    :class="product.is_sale ? 'text-red-500 font-semibold' : 'text-gray-600'"
                                >
                                    {{ toMoney(product.price * product.quantity) }}
                                </td>
                            </tr>
                            <tr class="font-semibold">
                                <td colspan="5" class="text-right">Tổng tiền: {{ toMoney(form.total_price) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card" v-if="typeof form.tax_lines === 'object' && form.tax_lines?.company">
                <div class="card-header">Thông tin xuất hóa đơn</div>
                <div class="card-body">
                    <template v-for="(key, field) in form.tax_lines" :key="field">
                        <Field
                            :disabled="true"
                            :modelValue="form.tax_lines[field]"
                            :field="{
                                name: field,
                            }"
                        />
                    </template>
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.status"
                        @change="changeStatus(form.status)"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: [
                                { id: 'NEW', label: 'trạng thái mới' },
                                { id: 'VERIFIED', label: 'Xác nhận' },
                                { id: 'PROCESSING', label: 'Đang xử lý' },
                                { id: 'COMPLETED', label: 'Hoàn thành' },
                                { id: 'CANCELLED', label: 'Hủy' },
                                { id: 'UNREAD', label: 'Chưa xem' },
                            ],
                        }"
                    />
                    <Field
                        v-model="form.payment_status"
                        :field="{
                            type: 'radio_list',
                            name: 'payment_status',
                            label: 'Trạng thái thanh toán',
                            options: [
                                { id: 'UNPAID', label: 'Chưa thanh toán' },
                                { id: 'PAID', label: 'Đã được thanh toán' },
                            ],
                        }"
                    />
                </div>
            </div>
            <Dialog
                header="Hủy đơn hàng"
                v-model:visible="showStatusModal"
                :breakpoints="{
                    '960px': '75vw',
                    '640px': '90vw',
                }"
                :style="{ width: '50vw' }"
                :draggable="false"
            >
                <div class="space-y-6">
                    <Field
                        v-model="form.cancel_status"
                        :field="{
                            type: 'dropdown',
                            name: 'type',
                            label: 'Lý do',
                            keyBy: 'id',
                            labelBy: 'label',
                            placeholder: 'Lý do hủy đơn hàng',
                            options: [
                                { id: 1, label: 'Khách hàng đổi ý' },
                                { id: 2, label: 'Thanh toán bị từ chối' },
                                { id: 3, label: 'Đơn hàng giả mạo' },
                                { id: 4, label: 'Sai thông tin' },
                                { id: 5, label: 'Không liên lạc được' },
                                { id: 6, label: 'Hết hàng' },
                                { id: 7, label: 'Khác' },
                            ],
                        }"
                    />
                    <Field
                        v-if="form.cancel_status == 7"
                        v-model="form.status_note"
                        :field="{
                            type: 'textarea',
                            name: 'status_note',
                            label: 'Lý do hủy đơn hàng (Ghi chú)',
                            rows: 10,
                        }"
                    />
                </div>

                <template #footer>
                    <Button variant="white" @click="showStatusModal = null" label="Đóng" />
                </template>
            </Dialog>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['item', 'schema'],
    data() {
        return {
            formData: this.item,
            showStatusModal: null,
        }
    },

    watch: {
        item() {
            this.formData = {
                ...this.item,
                cancel_status: this.item.cancel_status ?? 7,
            }
        },
    },

    methods: {
        changeStatus(status) {
            if (status == 7) {
                this.showStatusModal = true
            }
        },
    },
}
</script>
