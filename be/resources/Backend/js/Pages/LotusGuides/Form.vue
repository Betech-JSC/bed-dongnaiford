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
                            label: 'Tiêu đề hướng dẫn',
                        }"
                    />
                    <Field
                        v-model="form.icon"
                        :field="{
                            type: 'text',
                            name: 'icon',
                            label: 'Icon (emoji hoặc tên icon)',
                            placeholder: 'e.g. 📝 hoặc ph:book',
                        }"
                    />
                    <Field
                        v-model="form.category"
                        :field="{
                            type: 'select',
                            name: 'category',
                            label: 'Nhóm chức năng',
                            options: categoryList,
                            labelBy: 'label',
                            valueBy: 'id',
                        }"
                    />
                    <Field
                        v-model="form.summary"
                        :field="{
                            type: 'textarea',
                            name: 'summary',
                            label: 'Mô tả ngắn',
                            rows: 3,
                        }"
                    />
                    <Field
                        v-model="form.content"
                        :field="{
                            type: 'richtext',
                            name: 'content',
                            label: 'Nội dung hướng dẫn chi tiết',
                        }"
                    />
                    <Field
                        v-model="form.video_url"
                        :field="{
                            type: 'text',
                            name: 'video_url',
                            label: 'Link video hướng dẫn (YouTube, v.v.)',
                            placeholder: 'https://www.youtube.com/watch?v=...',
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
                    <Field
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema', 'data'],
    data() {
        return {
            formData: {
                status: this.item?.status ?? 'ACTIVE',
                sort_order: this.item?.sort_order ?? 0,
                ...this.item,
            },
        }
    },
    watch: {
        item() {
            this.formData = {
                status: this.item?.status ?? 'ACTIVE',
                sort_order: this.item?.sort_order ?? 0,
                ...this.item,
            }
        },
    },
    computed: {
        categoryList() {
            return this.data?.category_list ?? []
        },
    },
}
</script>
