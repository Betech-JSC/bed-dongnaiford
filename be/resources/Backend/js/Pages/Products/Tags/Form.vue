<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.title"
                        :field="{
                            type: 'text',
                            name: 'title',
                            label: 'Tiêu đề',
                        }"
                    />
                    <Field
                        v-model="form.color"
                        :field="{
                            type: 'text',
                            name: 'color',
                            label: 'Mã màu (Hex Code #RRGGBB)',
                        }"
                    />
                    <Field
                        v-model="form.icon"
                        :field="{
                            type: 'textarea',
                            name: 'icon',
                            label: 'Icon',
                        }"
                    />
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: schema.columns.status.list,
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['item', 'schema'],
    data() {
        this.item.status = this.item.status ?? 'ACTIVE'
        return {
            formData: this.item,
        }
    },

    watch: {
        item() {
            this.formData = this.item
        },
    },
}
</script>
