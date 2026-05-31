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
                </div>
            </div>
            <div>
                <div class="card">
                    <div class="card-header">Thuộc tính</div>
                    <div class="card-body">
                        <Draggable
                            tag="ul"
                            v-model="form.children_value"
                            item-key="id"
                            handle=".handle"
                            :animation="200"
                        >
                            <template #item="{ index, element }">
                                <div class="flex items-center space-x-3 space-y-3 bg-white rounded" :key="index">
                                    <div>
                                        <div class="p-2 border rounded handle">
                                            <heroicons-outline:bars-4 />
                                        </div>
                                    </div>
                                    <div class="flex items-center w-full space-x-2">
                                        <div class="flex flex-col w-full">
                                            <Field
                                                v-model="element.title"
                                                :field="{
                                                    type: 'text',
                                                    name: 'children_value',
                                                    label: 'Thuộc tính',
                                                }"
                                            />
                                            <Field
                                                class="grow"
                                                v-if="item.children_range.length"
                                                :modelValue="element.range_id"
                                                @update:modelValue="element.range_id = $event"
                                                :field="{
                                                    label: 'Chọn khoảng',
                                                    type: 'dropdown',
                                                    options: item.children_range,
                                                    keyBy: 'id',
                                                    labelBy: 'title',
                                                }"
                                            />
                                            <!-- <Field
                                              v-if="form.title === 'Màu sắc'"
                                                class="pt-2"
                                                v-model="element.color"
                                                :field="{
                                                    type: 'text',
                                                    name: 'text',
                                                    label: 'Mã màu',
                                                }"
                                            /> -->
                                            <Field
                                                class="pt-2"
                                                v-model="element.is_filter"
                                                :field="{
                                                    type: 'checkbox',
                                                    name: 'text',
                                                    label: 'Hiển thị',
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        @click="form.children_value.splice(index, 1)"
                                        class="ml-auto border rounded cursor-pointer text-gray500 hover:text-gray-700 hover:bg-gray-100"
                                    >
                                        <material-symbols:delete-outline-sharp />
                                    </div>
                                </div>
                            </template>
                        </Draggable>
                        <div class="flex p-2 space-x-2 bg-white rounded">
                            <Button
                                label="Thêm mới"
                                variant="outline-secondary"
                                @click="
                                    form.children_value.push({
                                        title: '',
                                        is_range: false,
                                        range_id: null,
                                        is_filter: true,
                                    })
                                "
                            />
                        </div>
                    </div>
                </div>
                <!-- <div class="card">
                    <div class="card-header">Khoảng lọc</div>
                    <div class="card-body">
                        <Draggable
                            tag="ul"
                            v-model="form.children_range"
                            item-key="id"
                            handle=".handle"
                            :animation="200"
                        >
                            <template #item="{ index, element }">
                                <div
                                    class="flex items-center space-x-3 space-y-3 bg-white rounded"
                                    :key="index"
                                >
                                    <div>
                                        <div class="p-2 border rounded handle">
                                            <heroicons-outline:bars-4 />
                                        </div>
                                    </div>
                                    <div
                                        class="flex items-center w-full space-x-2"
                                    >
                                        <div class="flex flex-col w-full">
                                            <Field
                                                v-model="element.title"
                                                :field="{
                                                    type: 'text',
                                                    name: 'children_range',
                                                    label: 'Thuộc tính',
                                                }"
                                            />
                                            <Field
                                                class="pt-2"
                                                v-model="element.is_filter"
                                                :field="{
                                                    type: 'checkbox',
                                                    name: 'text',
                                                    label: 'Hiển thị',
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        @click="
                                            form.children_range.splice(index, 1)
                                        "
                                        class="ml-auto border rounded cursor-pointer text-gray500 hover:text-gray-700 hover:bg-gray-100"
                                    >
                                        <material-symbols:delete-outline-sharp />
                                    </div>
                                </div>
                            </template>
                        </Draggable>
                        <div class="flex p-2 space-x-2 bg-white rounded">
                            <Button
                                label="Thêm mới"
                                variant="outline-secondary"
                                @click="
                                    form.children_range.push({
                                        title: '',
                                        is_range: true,
                                        range_id: null,
                                        is_filter: true,
                                    })
                                "
                            />
                        </div>
                    </div>
                </div> -->
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
                        class="pt-2"
                        v-model="form.is_show_detail"
                        :field="{
                            type: 'checkbox',
                            name: 'text',
                            label: 'Thông tin sản phẩm',
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
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
import Draggable from 'vuedraggable'
export default {
    components: { Draggable },
    props: ['item', 'schema'],
    data() {
        return {
            formData: this.item,
        }
    },

    created() {
        this.initForm()
    },

    watch: {
        item() {
            this.initForm()
        },
    },
    methods: {
        initForm() {
            if (!this.item.children_value) {
                this.item.children_value = []
            }

            if (!this.item.children_range) {
                this.item.children_range = []
            }

            this.item.status = this.item.status ?? 'ACTIVE'

            this.form = this.$inertia.form({ ...this.item })
        },
    },
}
</script>
