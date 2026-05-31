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
                    <small v-if="form.id">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="item" target="_blank" class="link">{{ decodeURI(item) }}</a
                            ><br />
                        </span>
                    </small>
                    <Field
                        v-model="form.description"
                        :field="{
                            type: 'textarea',
                            name: 'description',
                            label: 'Mô tả',
                        }"
                    />
                    <Field
                        v-model="form.content"
                        :field="{
                            type: 'richtext',
                            name: 'content',
                            label: 'Nội dung',
                        }"
                    />
                </div>
            </div>

            <SeoFields :modelValue="form" @update:modelValue="form = $event" />
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
                        v-model="form.position"
                        :field="{
                            type: 'number',
                            name: 'position',
                            label: 'Thứ tự sắp xếp',
                        }"
                    />
                    <Field
                        v-model="form.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            multiple: false,
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
        return {
            formData: {
                ...this.item,
                sliders: this.item.sliders ?? [],
                content_by_tab: this.item.content_by_tab ?? [],
                benefits: this.item.benefits ?? [],
                is_content_by_tab: this.item.is_content_by_tab == true ? true : false,
            },
        }
    },
    methods: {
        confirmRemoveTabItem(index) {
            if (confirm('Bạn có thực sự muốn xoá đối tượng này?')) {
                this.formData.content_by_tab.splice(index, 1)
            }
        },
        confirmRemoveBenefitItem(index) {
            if (confirm('Bạn có thực sự muốn xoá đối tượng này?')) {
                this.formData.benefits.splice(index, 1)
            }
        },
    },
    watch: {
        item() {
            this.formData = this.item
        },
    },
}
</script>
