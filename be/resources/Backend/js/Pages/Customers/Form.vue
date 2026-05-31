<template layout>
    <Form v-model="formData"
        :config="{
            showActions: false,
        }">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin chung</div>
                <div class="card-body">
                    <Field
                        v-model="form.name"
                        :field="{
                            type: 'text',
                            name: 'name',
                            label: 'Họ tên',
                        }"
                    />
                    <Field
                        v-model="form.phone"
                        :field="{
                            type: 'text',
                            name: 'phone',
                            label: 'Số điện thoại',
                        }"
                    />
                    <Field
                        v-model="form.email"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email',
                        }"
                    />
                    <Field
                        v-model="form.full_address"
                        :field="{
                            type: 'textarea',
                            name: 'full_address',
                            label: 'Địa chỉ',
                        }"
                    />
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.total_order"
                        :field="{
                            type: 'number',
                            name: 'total_order',
                            label: 'Số lượng đơn hàng',
                        }"
                    />
                    <div class="mt-4">
                        <Link
                            :href="
                                this.route('admin.orders.index', {
                                    customer_id: form.id,
                                })
                            "
                            target="_blank"
                            class="link"
                        >
                            Danh sách đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ["item", "schema"],
    data() {
        return {
            formData: this.item,
        };
    },

    watch: {
        item() {
            this.formData = this.item;
        }
    }
};
</script>
