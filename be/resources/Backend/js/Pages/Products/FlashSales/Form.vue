<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.title"
                        :field="{
                            type: 'text',
                            name: 'title',
                            label: 'Tiêu đề',
                        }"
                    />
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <div class="space-y-3">
                        <Field
                            v-model="form.status"
                            :field="{
                                type: 'radio_list',
                                name: 'status',
                                label: 'Trạng thái',
                                options: [
                                    {
                                        id: 'ACTIVE',
                                        label: 'Hoạt động',
                                    },
                                    {
                                        id: 'INACTIVE',
                                        label: 'Ẩn',
                                    },
                                ],
                            }"
                        />
                        <Field
                            v-model="form.product_id"
                            :field="{
                                type: 'select_single',
                                name: 'product_id',
                                labelBy: 'title',
                                source: {
                                    model: 'App\\Models\\Product\\Product',
                                    method: 'get',
                                    only: ['id', 'title'],
                                },
                            }"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['item', 'schema'],
    computed: {
        currentResource() {
            return this.config.resource ?? this.getResource()
        },
        formUrl() {
            return this.config.formUrl ?? this.route(`admin.${this.currentResource}.form`)
        },
    },
    data() {
        return {
            formData: {
                ...this.item,
                flash_sale_price: this.item.flash_sale_price ?? 0,
                flash_sale_quantity: this.item.flash_sale_quantity ?? 0,
                status: this.item.status ?? 'ACTIVE',
            },
        }
    },

    watch: {
        item() {
            this.formData = {
                ...this.item,
            }
        },
    },
}
</script>
