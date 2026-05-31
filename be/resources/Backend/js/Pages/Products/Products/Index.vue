<template layout>
    <Table
        :schema="schema"
        :columns="['id', 'image', 'title', 'price', 'status', , 'view_count', 'created_at', 'updated_at']"
        :config="{
            canExport: false,
            canImport: false,
        }"
    >
        <template #filter="{ filters }">
            <div class="flex space-x-2">
                <Field
                    class="w-[250px]"
                    v-model="status"
                    @change="filters['status'] = status"
                    :field="{
                        type: 'dropdown',
                        name: 'status',
                        label: false,
                        keyBy: 'id',
                        labelBy: 'label',
                        placeholder: 'Trạng thái',
                        options: [
                            { id: 'ALL', label: 'Xem tất cả' },
                            { id: 'ACTIVE', label: 'Hiển thị' },
                            { id: 'INACTIVE', label: 'Ẩn' },
                            { id: 'STOCKING', label: 'Còn hàng' },
                            { id: 'OUT_OF_STOCK', label: 'Hết hàng' },
                        ],
                    }"
                />
                <Field
                    class="w-[250px]"
                    v-model="type"
                    @change="filters['type'] = type"
                    :field="{
                        type: 'dropdown',
                        name: 'type',
                        label: false,
                        keyBy: 'id',
                        labelBy: 'label',
                        placeholder: 'Thể loại',
                        options: [
                            { id: 'ALL', label: 'Xem tất cả' },
                            { id: 'IS_SALE', label: 'Sản phẩm Flash Sale' },
                            { id: 'NOT_SALE', label: 'Sản phẩm không Flash Sale' },
                        ],
                    }"
                />
            </div>
        </template>
    </Table>
</template>
<script>
export default {
    props: ['schema'],
    methods: {
        getType(value) {
            let position = this.position_display.filter((item) => item.id == value)
            return position[0].label
        },
    },
}
</script>
