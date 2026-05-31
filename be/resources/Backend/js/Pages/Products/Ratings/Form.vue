<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
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
                        v-model="form.content"
                        :disabled="true"
                        :field="{
                            type: 'textarea',
                            name: 'content',
                            label: 'Nội dung',
                        }"
                    />
                    <div class="card" v-if="form.images && form.images.length > 0">
                        <label for="">Hình ảnh</label>
                        <div class="flex space-x-3 flex-nowrap">
                            <div v-for="(file, index) in form.images" class="w-[200px] aspect-square" :key="index">
                                <img
                                    v-if="file.path"
                                    class="object-contain w-full h-full pointer-events-none"
                                    :src="staticUrl(file.path)"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="pt-2">
                        <Link
                            :href="
                                this.route('admin.products.form', {
                                    id: form.product_id,
                                })
                            "
                            target="_blank"
                            class="link"
                        >
                            Chi tiết sản phẩm
                        </Link>
                    </div>
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
        return {
            formData: this.item,
        }
    },
}
</script>
